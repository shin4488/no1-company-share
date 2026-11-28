import { clientsClaim } from '@vite-pwa/workbox-swkit/core';
import {
  cleanupOutdatedCaches,
  precacheAndRoute,
} from '@vite-pwa/workbox-swkit/precaching';

// 認証用のfetchハンドラーを、プリキャッシュのルーティングより先に登録する
importScripts('/firebase-auth-sw.js');

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
