const { app, BrowserWindow } = require('electron')
const NODE_ENV = process.env.NODE_ENV

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  //win.loadURL('http://localhost:5173') // 这里是 Vue 项目的本地开发服务器地址
  if (NODE_ENV === "development") {
    win.loadURL('http://localhost:5173')
  }else{
    win.loadFile('dist/index.html')
  }

  console.log(NODE_ENV)

  // 打开开发工具
  //win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})