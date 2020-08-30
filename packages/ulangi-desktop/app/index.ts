import { BrowserWindow, app } from 'electron';

let mainWindow;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    minWidth: 300,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
}

app.whenReady().then(createWindow);
