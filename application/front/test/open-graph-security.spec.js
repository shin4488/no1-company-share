/** @jest-environment node */

import axios from 'axios';
import { lookup } from 'node:dns';
import { OpenGraphLogicImpl } from '../../server/commonBL/openGraph/logic';
import { OpenGraphType } from '../../server/commonBL/openGraph/definition/openGraphType';

jest.mock('axios');
jest.mock('node:dns', () => ({ lookup: jest.fn() }));

const logic = new OpenGraphLogicImpl();

describe('OG画像の取得先', () => {
  beforeEach(() => {
    axios.get.mockReset();
    lookup.mockReset();
  });

  test.each([
    'file:///etc/passwd',
    'http://127.0.0.1/',
    'http://[::1]/',
    'https://localhost/',
    'https://user:password@example.com/',
    'https://example.com:8080/',
  ])('取得できないURL %s は外部要求を行わない', async (url) => {
    expect(await logic.getOpenGraph(url, [OpenGraphType.IMAGE])).toEqual({
      image: '',
    });
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('公開URLへのリダイレクトだけを追跡し、応答量と待ち時間を制限する', async () => {
    axios.get
      .mockResolvedValueOnce({
        status: 301,
        headers: { location: '/company' },
        data: '',
      })
      .mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: '<html><head><meta property="og:image" content="https://example.com/image.png"></head></html>',
      });

    const result = await logic.getOpenGraph('https://example.com/', [
      OpenGraphType.IMAGE,
    ]);

    expect(result.image).toBe('https://example.com/image.png');
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get.mock.calls[1][0]).toBe('https://example.com/company');
    expect(axios.get.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        timeout: 5000,
        maxRedirects: 0,
        maxContentLength: 1000000,
        proxy: false,
      }),
    );
  });

  test('内部アドレスへのリダイレクトを追跡しない', async () => {
    axios.get.mockResolvedValue({
      status: 302,
      headers: { location: 'http://127.0.0.1/private' },
      data: '',
    });

    expect(
      await logic.getOpenGraph('https://example.com/', [OpenGraphType.IMAGE]),
    ).toEqual({ image: '' });
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  test('リダイレクトは3回までに制限する', async () => {
    axios.get.mockResolvedValue({
      status: 302,
      headers: { location: '/again' },
      data: '',
    });

    expect(
      await logic.getOpenGraph('https://example.com/', [OpenGraphType.IMAGE]),
    ).toEqual({ image: '' });
    expect(axios.get).toHaveBeenCalledTimes(4);
  });

  test('接続時のDNS応答に内部アドレスが混ざれば拒否する', async () => {
    axios.get.mockResolvedValue({ status: 200, headers: {}, data: '' });
    await logic.getOpenGraph('https://example.com/', [OpenGraphType.IMAGE]);
    const safeLookup = axios.get.mock.calls[0][1].httpsAgent.options.lookup;
    lookup.mockImplementation((_hostname, _options, callback) =>
      callback(null, [
        { address: '8.8.8.8', family: 4 },
        { address: '169.254.169.254', family: 4 },
      ]),
    );
    const callback = jest.fn();

    safeLookup('example.com', { all: false }, callback);

    expect(callback.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  test('接続時の公開DNSアドレスはそのまま使用する', async () => {
    axios.get.mockResolvedValue({ status: 200, headers: {}, data: '' });
    await logic.getOpenGraph('https://example.com/', [OpenGraphType.IMAGE]);
    const safeLookup = axios.get.mock.calls[0][1].httpsAgent.options.lookup;
    lookup.mockImplementation((_hostname, _options, callback) =>
      callback(null, [{ address: '8.8.8.8', family: 4 }]),
    );
    const callback = jest.fn();

    safeLookup('example.com', { all: false }, callback);

    expect(callback).toHaveBeenCalledWith(null, '8.8.8.8', 4);
  });

  test('内部IPv4に変換され得るNAT64アドレスも拒否する', async () => {
    axios.get.mockResolvedValue({ status: 200, headers: {}, data: '' });
    await logic.getOpenGraph('https://example.com/', [OpenGraphType.IMAGE]);
    const safeLookup = axios.get.mock.calls[0][1].httpsAgent.options.lookup;
    lookup.mockImplementation((_hostname, _options, callback) =>
      callback(null, [{ address: '64:ff9b:1::a9fe:a9fe', family: 6 }]),
    );
    const callback = jest.fn();

    safeLookup('example.com', { all: false }, callback);

    expect(callback.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
