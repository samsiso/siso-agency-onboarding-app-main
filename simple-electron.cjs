const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      allowRunningInsecureContent: false,
      webSecurity: false, // Allow localhost connections
      experimentalFeatures: true
    },
    icon: path.join(__dirname, 'SISO-Agency-App.icns'),
    show: false,
    backgroundColor: '#000000',
    title: 'SISO Agency'
  });

  // Load the dev server
  mainWindow.loadURL('http://localhost:2222');

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    
    // Enable debugging
    console.log('✅ Window ready and focused');
    
    // Test JavaScript interaction
    mainWindow.webContents.executeJavaScript(`
      console.log('🔧 JavaScript execution test - SUCCESS');
      
      // Test if clicking works
      document.addEventListener('click', (e) => {
        console.log('👆 Click detected on:', e.target.tagName, e.target.className);
      });
      
      // Test if React is working
      if (window.React) {
        console.log('⚛️ React is available');
      } else {
        console.log('❌ React not found');
      }
      
      // Return success
      'JavaScript injection successful'
    `).then(result => {
      console.log('JS injection result:', result);
    }).catch(err => {
      console.error('JS injection failed:', err);
    });
  });

  // Prevent accidental closing
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  // Only quit when explicitly told to
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

// Prevent app from quitting
app.on('window-all-closed', () => {
  // Don't quit, just hide
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

// Force quit only with Cmd+Q
app.on('before-quit', (event) => {
  app.isQuiting = true;
});