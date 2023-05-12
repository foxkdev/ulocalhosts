
import { ipcMain } from 'electron';

import {App} from './electron/app';
import { Dns } from './lib/dns';
import { HttpServer } from './lib/http';
import { Domains } from './lib/domains';


const app = new App({
  window: {
    width: 800,
    height: 700,
    minWidth: 800,
    minHeight: 700
  },
});

app.init()

const httpServer = new HttpServer({ port: 80 });
httpServer.listen();

const dns = new Dns();
dns.init();

const domains = new Domains();

ipcMain.handle('domains:all', async (event, arg) => {
  const domainsList = await domains.getAll();
  return domainsList.map(dm => dm.toJSON());
});

ipcMain.handle('domains:add', async (event, arg) => {
  return domains.add(arg);
});

ipcMain.handle('domains:remove', async (event, arg) => {
  return domains.remove(arg);
});
