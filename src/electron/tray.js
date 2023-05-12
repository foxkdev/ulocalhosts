const { Menu, Tray } = require('electron')

export class TrayMenu {
  constructor() {
    this.tray = null
  }
  load() {
    this.tray = new Tray('/src/assets/icon_ulocalhosts.png')
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Configuration', type: 'normal' },
    ])
    tray.setToolTip('uCanHosts Local Domains')
    tray.setContextMenu(contextMenu)
  }
}