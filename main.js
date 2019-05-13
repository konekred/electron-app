const electron = require('electron')
const fs = require('fs')
const url = require('url')
const path = require('path')

const { app, BrowserWindow, Menu } = electron

let mainWindow = null
let newWindow = null

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Window',
        click() {
          newWindow = new BrowserWindow({
            width: 200,
            height: 200,
            title: 'New Window'
          })

          newWindow.loadURL(url.format({
            pathname: path.resolve('public/index.html'),
            protocol: 'file',
            slashes: true
          }))

          newWindow.on('close', () => {
            newWindow = null
          })
        }
      },
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
      },
      {
        label: 'Print',
        click() {


          mainWindow.webContents.printToPDF({}, (error, data) => {
            if (error) throw error
            fs.writeFile('./print.pdf', data, (error) => {
              if (error) throw error
              console.log('Write PDF successfully.')
            })
          })
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
  require('./server/app')
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL('http://localhost:7000/index.html')

  mainWindow.on('closed', () => {
    app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
  mainWindow.setMenuBarVisibility(true)
})


