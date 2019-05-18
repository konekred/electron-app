const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')


function getInstallerConfig() {
  console.log('creating windows installer')

  return Promise.resolve({
    appDirectory: path.resolve('release-builds', 'paysight-win32-ia32'), // where's the generated package
    authors: 'Red Company',
    noMsi: true,
    outputDirectory: path.join('release-builds', 'windows-installer'), // where to put the installer
    exe: 'paysight.exe',
    setupExe: 'PaySightInstaller.exe',
    setupIcon: path.resolve('assets', 'icons', 'win', 'icon.ico')
  })
}

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })
