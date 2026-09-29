declare module 'ipaddr.js' {
  const ipaddr: {
    parse(address: string): { range(): string; kind(): string };
  };
  export default ipaddr;
}
