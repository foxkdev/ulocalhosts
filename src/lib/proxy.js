const { createProxyMiddleware } = require('http-proxy-middleware');
import logger from './logger';

export class Proxy {
  constructor(host) {
    if(Proxy.instance && Proxy.instance.host === host) {
      return Proxy.instance;
    }
     this.host = host
     this.proxy = createProxyMiddleware({
      target: `${host.protocol}://localhost:${host.port}`,
      changeOrigin: false,
      wss: true,
      logger,
      logLevel: 'info',
    });
    Proxy.instance = this;
  }
}