import detect from 'detect-port'
import settings from 'electron-settings'

import crypto from 'crypto';

class Domain {
  constructor({id, host, port, active = false, protocol = 'http'}) {
    this.id = id
    this.host = host;
    this.port = port;
    this.active = active;
    this.protocol = protocol;
  }

  isHost(host) {
    return this.host === host;
  }

  getUrl() {
    return `${this.protocol}://${this.host}`;
  }

  getLocalhostUrl() {
    return `${this.protocol}://localhost:${this.port}`;
  }

  toJSON() {
    return {
      id: this.id,
      host: this.host,
      port: this.port,
      protocol: this.protocol,
      url: this.getUrl(),
      active: this.active,
    }
  }
}


export class Domains {
  constructor() {
    if(Domains.intance) {
      return Domains.intance;
    }
    Domains.intance = this;
  }
  
  async getAll() {
    let domains = []
    const settingsDomains = await settings.get('domains') || [];
    for(const domain of await settingsDomains) {
      domains.push(new Domain({
        id: domain.id,
        host: domain.host,
        port: domain.port,
        active: await this.isPortInUse(domain.port),
        protocol: domain.protocol,
      }))
    }
    return domains
  }

  async getByHost(host) {
    const list = await this.getAll();
    return list.find(dm => dm.isHost(host));
  }

  async getById(id) {
    const list = await this.getAll();
    return list.find(dm => dm.id === id);
  }

  async add({host, port, protocol = 'http'}) {
    const localDomains = await this.getAll();
    const domain = new Domain({
      id: crypto.randomUUID(),
      host,
      port,
      protocol
    });
    localDomains.push(domain);
    await this.save(localDomains)
  }

  async remove(id) {
    const localDomains = await this.getAll();
    const domain = localDomains.find(dm => dm.id === id);
    if(domain) {
      localDomains.splice(localDomains.indexOf(domain), 1);
      await this.save(localDomains)
    }
  }

  async save(domains) {
    await settings.set('domains', domains.map(dm => dm.toJSON()));
  }

  async isPortInUse(port) {
    return detect(port).then(_port => {
      return _port !== port;
    })
  }
}