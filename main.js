const { app, BrowserWindow, screen, ipcMain } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubframes: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')

  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })

  if (externalDisplay) {
    const { width, height } = externalDisplay.workAreaSize
    const externalWin = new BrowserWindow({
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      width,
      height,
      alwaysOnTop: false, // 总在最顶
      useContentSize: true,
      frame: false, // 显示标题栏
      resizable: false, // 不可改变尺寸
      center: true,
      minimizable: false,
      maximizable: true,
      focusable: true,
      kiosk: true,
      show: true,
      autoHideMenuBar: true,
      disableAutoHideCursor: true,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        nodeIntegrationInSubframes: true,
        contextIsolation: false
      }
    })
    externalWin.loadURL(`file://${__dirname}/video/index.html`)

    ipcMain.on('SpeakerManager', (_event, action, value) => {
      externalWin.webContents.send(action, value)
    })
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})