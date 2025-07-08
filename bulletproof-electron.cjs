const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

// Prevent any accidental quitting
app.on('before-quit', (event) => {
  console.log('⚠️ App trying to quit - preventing...');
  event.preventDefault();
});

// Override window-all-closed to prevent quitting
app.on('window-all-closed', (event) => {
  console.log('⚠️ All windows closed - preventing quit...');
  event.preventDefault();
});

function createWindow() {
  console.log('🚀 Creating main window...');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'SISO-Agency-App.icns'),
    show: false,
    backgroundColor: '#000000',
    title: 'SISO Agency - BULLETPROOF',
    closable: false, // Prevent close button from working
    minimizable: true,
    maximizable: true
  });

  // Load the dev server
  mainWindow.loadURL('http://localhost:2222');

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    console.log('✅ Window ready - showing...');
    mainWindow.show();
    mainWindow.focus();
  });

  // Completely prevent closing
  mainWindow.on('close', (event) => {
    console.log('⚠️ Window trying to close - BLOCKED!');
    event.preventDefault();
    return false;
  });

  // Log if anything tries to close it
  mainWindow.on('closed', () => {
    console.log('❌ Window was closed somehow!');
    mainWindow = null;
    // Recreate it immediately
    setTimeout(createWindow, 1000);
  });

  // Log navigation
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Page loaded successfully');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('❌ Page failed to load:', errorDescription);
  });

  console.log('✅ Window created successfully');
}

app.whenReady().then(() => {
  console.log('🚀 App ready - creating window...');
  createWindow();
});

// Force the app to stay alive
app.on('activate', () => {
  console.log('🔄 App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});

// Keep the app alive
setInterval(() => {
  if (mainWindow && mainWindow.isDestroyed()) {
    console.log('⚠️ Window was destroyed - recreating...');
    createWindow();
  }
}, 5000);

console.log('🔧 Bulletproof Electron app initialized');