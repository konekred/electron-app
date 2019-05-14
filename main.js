const url = require('url')
const path = require('path')
const electron = require('electron')
const { app, BrowserWindow, Menu } = electron

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

  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'public/index.html'),
      protocol: 'file',
      slashes: true
    })
  )

  mainWindow.on('closed', () => {
    app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
  mainWindow.setMenuBarVisibility(true)
})


