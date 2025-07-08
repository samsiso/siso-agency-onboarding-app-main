const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

// Production configuration - optimized for security and performance
function createWindow() {
  console.log('🚀 Starting SISO Agency - PRODUCTION MODE');
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      // Production settings - prioritize security
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,           // Enabled for production security
      sandbox: true,               // Enabled for production security
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      devTools: false,             // Disabled in production
      backgroundThrottling: true   // Allow throttling for performance
    },
    icon: path.join(__dirname, 'SISO-Agency-App.icns'),
    titleBarStyle: 'hiddenInset',
    show: false,
    backgroundColor: '#111111',
    title: 'SISO Agency'
  });

  // Load built application
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));

  // Production-specific event handlers
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    
    console.log('✅ Production app ready');
    console.log('🔒 Security features enabled');
    console.log('🚀 Performance optimizations active');
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Production close behavior - actually close
  mainWindow.on('close', () => {
    // In production, allow normal close behavior
  });

  // Suppress console messages in production
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    // Only log errors in production
    if (level >= 2) {
      console.error(`[RENDERER ERROR] ${message}`);
    }
  });

  // Handle crashes in production
  mainWindow.webContents.on('crashed', () => {
    console.error('💥 Application crashed');
    // In production, show error dialog or restart
    app.quit();
  });
}

// App event listeners
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // In production, quit when all windows are closed
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Production menu - minimal
const template = [
  {
    label: 'SISO Agency',
    submenu: [
      { role: 'about' },
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
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

console.log('🔒 Production Electron app initialized');