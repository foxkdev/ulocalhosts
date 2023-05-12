const express = require('express');
import { Domains } from './domains';
import { Proxy } from './proxy';
const domains = new Domains();

export class HttpServer {
  app = null
  port = 80
  constructor({ port = 80 }) {
    if(HttpServer.intance) {
      return HttpServer.intance;
    }
    this.port = port
    this.app = express();
    this.app.use('/', async (req, res, next) => {
      const host = await domains.getByHost(req.headers.host);
      if(!host) {
        return res.status(404).send('Not found HOST');
      }
      const proxy = new Proxy({
        host: host.host,
        port: host.port,
        protocol: host.protocol,
      });
      return proxy.proxy(req, res)
    });

    HttpServer.intance = this;
  }

  listen() {
    this.app.listen(this.port);
  }
}