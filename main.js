const path = require('path')
const electron = require('electron')
const { app, BrowserWindow, Menu } = electron

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow = null

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Refresh',
        role: 'reload'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        }
      }
    ]
  }
]

if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({})
}

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Tools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}

app.on('ready', () => {

  // start server
  require('./server/app')
  const settings = require('./config/settings')

  // start electron window
  mainWindow = new BrowserWindow({
    show: false,
    icon: path.join(__dirname, 'assets/icons/win/icon.ico')
  })

  mainWindow.maximize()
  mainWindow.show()

  mainWindow.loadURL(`http://localhost:${settings.server.port}`)

  mainWindow.on('closed', () => {
    app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
  mainWindow.setMenuBarVisibility(true)
})
