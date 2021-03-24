const { app, BrowserWindow,ipcMain} = require('electron')
const path = require('path')

ipcMain.on("a",data => {
  console.log(data)
})
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      NodeIntegration:true,
      contextIsolation:false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('server.html')
  win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
