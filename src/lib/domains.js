import detect from 'detect-port'
import settings from 'electron-settings'

import crypto from 'crypto';

function sortByPath(items = []) {
  return items.sort((a, b) => {
    if (a.host !== b.host) {
      return a.host.localeCompare(b.host); // Agrupa por host y ordena alfabéticamente
    }

    if (a.path === '*') {
      return 1; // Coloca el elemento con path '*' al final
    }
    if (b.path === '*') {
      return -1; // Coloca el elemento con path '*' al final
    }
    return a.path.localeCompare(b.path);
  });
}


class Domain {
  constructor({id, host, port, active = false, protocol = 'http', path = '*'}) {
    this.id = id
    this.host = host;
    this.port = port;
    this.active = active;
    this.protocol = protocol;
    this.path = path;
  }

  isHost(host) {
    return this.host === host;
  }

  isPath(path) {
    if(this.path === '*') {
      return true;
    }
    const pathParsed = this.path.startsWith('/') ? this.path : `/${this.path}`;
    return path.startsWith(pathParsed);
  }


  getUrl() {
    return `${this.protocol}://${this.host}${this.path === '*' ? '' : this.path}`;
  }

  getLocalhostUrl() {
    return `${this.protocol}://localhost:${this.port}${this.path === '*' ? '' : this.path}`;
  }


  toJSON() {
    return {
      id: this.id,
      host: this.host,
      port: this.port,
      protocol: this.protocol,
      path: this.path,
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
    for(const domain of settingsDomains) {
      domains.push(new Domain({
        id: domain.id,
        host: domain.host,
        port: domain.port,
        active: await this.isPortInUse(domain.port),
        protocol: domain.protocol,
        path: domain.path,
      }))
    }
    return domains
  }

  async getByHost(host) {
    const list = await this.getAll();
    return list.find(dm => dm.isHost(host));
  }
  async getByHostAndPath(host, path = '*') {
    const list = await this.getAll();
    return list.find(dm => dm.isHost(host) && dm.isPath(path));
  }

  async getById(id) {
    const list = await this.getAll();
    return list.find(dm => dm.id === id);
  }

  async add({host, port, protocol = 'http', path = '*'}) {
    const localDomains = await this.getAll();
    const domain = new Domain({
      id: crypto.randomUUID(),
      host,
      port,
      protocol,
      path
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
    await settings.set('domains', sortByPath(domains).map(dm => dm.toJSON()));
  }

  async isPortInUse(port) {
    return detect(port).then(_port => {
      return _port !== port;
    })
  }
}