const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

class MainWindow {
  constructor() {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      show: false, // Oculta a janela até que esteja pronta para evitar flash de conteúdo
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, '../../preload.js') // Ajustar caminho do preload
      },
      icon: path.join(__dirname, '../../assets/icon.png'), // Definir o ícone
      autoHideMenuBar: true, // Esconder a barra de menu padrão
    })

    this.window.loadURL(url.format({
      pathname: path.join(__dirname, '../../../app/dist/index.html'), // Ajustar caminho do index.html
      protocol: 'file:',
      slashes: true
    }))

    this.window.once('ready-to-show', () => {
      this.window.maximize() // Maximiza a janela ao iniciar
      this.window.show()
    })

    // Opcional: Abrir as ferramentas de desenvolvedor
    // this.window.webContents.openDevTools()
  }

  getWindow() {
    return this.window
  }
}

module.exports = MainWindow