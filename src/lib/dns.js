const mdns = require('multicast-dns');

import { Domains } from './domains';
const domains = new Domains();
export class Dns {
  mdns = null;
  constructor() {
    if(Dns.instance) {
      return Dns.instance;
    }
    Dns.instance = this;
  }
  init() {
    this.mdns = mdns();
    this.mdns.on('query', this.onQuery.bind(this));
  }
  async onQuery(query) {
    const domain = await domains.getByHost(query.questions[0].name);
    if (domain) {
      this.mdns.respond({
        answers: [{
          name: domain.host,
          type: 'A',
          data: '127.0.0.1',
          ttl: 100,
          flush: true,
        },
        {
          name: domain.host,
          type: 'AAAA',
          data: '::1',
          ttl: 100,
          flush: true,
        }],
      });
    }
  }
}