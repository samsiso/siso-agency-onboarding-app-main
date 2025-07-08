const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

// Development configuration - optimized for React development
function createWindow() {
  console.log('🚀 Starting SISO Agency - DEVELOPMENT MODE');
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      // Development settings - prioritize functionality over security
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,          // Disabled for localhost development
      sandbox: false,              // Disabled for React development
      allowRunningInsecureContent: false,
      experimentalFeatures: true,
      devTools: true,              // Always available in dev
      backgroundThrottling: false  // Prevent throttling for hot reload
    },
    icon: path.join(__dirname, 'SISO-Agency-App.icns'),
    titleBarStyle: 'hiddenInset',
    show: false,
    backgroundColor: '#111111',
    title: 'SISO Agency - Development'
  });

  // Load development server
  mainWindow.loadURL('http://localhost:2222');

  // Development-specific event handlers
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    
    // Auto-open DevTools in development
    mainWindow.webContents.openDevTools();
    
    console.log('✅ Development app ready');
    console.log('📱 DevTools opened for debugging');
    console.log('🔄 Hot reload enabled');
  });

  // Handle window closed - don't quit in development
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Development-friendly close behavior
  mainWindow.on('close', (event) => {
    // In development, hide instead of close for faster restart
    event.preventDefault();
    mainWindow.hide();
  });

  // Console logging for development
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[RENDERER] ${level}: ${message}`);
  });

  // Handle crashes in development
  mainWindow.webContents.on('crashed', () => {
    console.error('💥 Renderer process crashed - restarting...');
    mainWindow.reload();
  });
}

// App event listeners
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // On macOS, keep the app running in development
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

// Development menu
const template = [
  {
    label: 'SISO Agency - Dev',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { 
        label: 'Reload App',
        accelerator: 'CmdOrCtrl+R',
        click: () => mainWindow.reload()
      },
      { 
        label: 'Force Reload',
        accelerator: 'CmdOrCtrl+Shift+R',
        click: () => mainWindow.webContents.reloadIgnoringCache()
      },
      { 
        label: 'Toggle DevTools',
        accelerator: 'F12',
        click: () => mainWindow.webContents.toggleDevTools()
      },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectall' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

console.log('🔧 Development Electron app initialized');