/* eslint-disable class-methods-use-this */
import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    const menu = Menu.buildFromTemplate([
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'F5',
            click: (_item, focusedWindow) => {
              if (focusedWindow) {
                // on reload, start fresh and close any old
                // open secondary windows
                if (focusedWindow.id === 1) {
                  BrowserWindow.getAllWindows().forEach((win) => {
                    if (win.id > 1) win.close();
                  });
                }
                focusedWindow.reload();
              }
            },
          },
          {
            label: 'Toggle Dev Tools',
            accelerator: 'F12',
            click: (_item, focusedWindow) => {
              if (focusedWindow) focusedWindow.webContents.toggleDevTools();
            },
          },
        ],
      },
    ]);
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      Menu.setApplicationMenu(menu);
    } else {
      Menu.setApplicationMenu(null);
    }

    return menu;
  }
}
