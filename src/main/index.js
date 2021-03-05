import { app, BrowserWindow } from 'electron'
const storage = require('electron-localstorage');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({

    height: 555,
    useContentSize: true,
    width: 872,
    minWidth: 872,
    minHeight: 555,
    webPreferences: {webSecurity: false}
  })


  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    storage.clear();
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// 获取可执行文件位置
const ex=process.execPath;
const path = require('path');
const exeName = path.basename(process.execPath);
const ipcMain = require('electron').ipcMain
// 开启 开机自启动
ipcMain.on('openAutoStart',()=>{
  app.setLoginItemSettings({
    openAtLogin: true,
    path: ex,
    args: [
      '--processStart', `"${exeName}"`,
    ]
  });
});
// 关闭 开机自启动
ipcMain.on('closeAutoStart',()=>{
  app.setLoginItemSettings({
    openAtLogin: false,
    path: ex,
    args: []
  });
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
