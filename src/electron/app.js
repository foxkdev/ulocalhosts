const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
import { TrayMenu } from './tray.js';

export class App {
  mainWindow = null;  
  isDev = false;
  constructor({ window: { width, height, minWidth, minHeight } }) {
    this.width = width;
    this.height = height;
    this.minWidth = minWidth || width;
    this.minHeight = minHeight || height;
  }
  init() {
    // Handle creating/removing shortcuts on Windows when installing/uninstalling.
    if (require('electron-squirrel-startup')) {
      app.quit();
    }
    app.on('ready', this.onReady.bind(this));
    app.on('window-all-closed', this.onWindowAllClosed.bind(this));
    app.on('activate', this.onActivate.bind(this));
  }

  createMainWindow() {
    
    // const icon = nativeImage.createFromPath(app.getAppPath() + '/assets/icon.icns');
    // console.log('icon', )
    this.mainWindow = new BrowserWindow({
      width: this.width,
      height: this.height,
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      icon: app.getAppPath() + 'src/assets/icon_ulocalhosts.png',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        webSecurity: false,
      },

    });
    if(MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      this.mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }



    this.mainWindow.on('closed', this.onClosed.bind(this));
    this.mainWindow.once('ready-to-show', this.onReadyToShow.bind(this));
  }

  onReady() {
    this.createMainWindow();
    const tray = new TrayMenu();
    tray.load();
  }
  // Emitted when the window is closed.
  onClosed() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    this.mainWindow = null;
  }

  // Emitted when the window is ready to be shown
  // This helps in showing the window gracefully.
  onReadyToShow() {
    this.mainWindow.show();
  }

  onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createMainWindow();
    }
  }


}