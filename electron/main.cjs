const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let devServer;
let isServerReady = false;

function checkServerHealth() {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.request({
      hostname: 'localhost',
      port: 2222,
      method: 'GET',
      timeout: 1000
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      resolve(false);
    });

    req.end();
  });
}

function startDevServer() {
  return new Promise(async (resolve, reject) => {
    console.log('Checking for existing server...');
    
    // Check if server is already running
    const serverRunning = await checkServerHealth();
    if (serverRunning) {
      console.log('✅ Server already running - connecting instantly!');
      isServerReady = true;
      resolve();
      return;
    }
    
    console.log('Starting dev server...');
    
    // Start the dev server
    devServer = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let serverOutput = '';
    
    devServer.stdout.on('data', (data) => {
      const output = data.toString();
      serverOutput += output;
      console.log('Server output:', output);
      
      // Check if server is ready
      if (output.includes('Local:   http://localhost:2222')) {
        isServerReady = true;
        console.log('Dev server is ready!');
        resolve();
      }
    });

    devServer.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });

    devServer.on('error', (error) => {
      console.error('Failed to start dev server:', error);
      reject(error);
    });

    // Reduced timeout for faster failure detection
    setTimeout(() => {
      if (!isServerReady) {
        reject(new Error('Dev server timeout'));
      }
    }, 15000);
  });
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    icon: path.join(__dirname, '../public/favicon.svg'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    titleBarStyle: 'default',
    show: false, // Don't show until ready
    backgroundColor: '#ffffff'
  });

  // Always use localhost for auto-server mode
  const startUrl = 'http://localhost:2222';
  
  mainWindow.loadURL(startUrl);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    
    // Stop dev server when window closes
    if (devServer) {
      devServer.kill('SIGTERM');
      devServer = null;
    }
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Prevent navigation to external sites
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const currentUrl = new URL(mainWindow.webContents.getURL());
    
    if (parsedUrl.origin !== currentUrl.origin && !isDev) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
}

// App event listeners
app.whenReady().then(async () => {
  try {
    // Start dev server first
    await startDevServer();
    
    // If server was already running, connect instantly
    // Otherwise wait briefly for startup
    const delay = isServerReady ? 500 : 2000;
    setTimeout(() => {
      createWindow();
    }, delay);
  } catch (error) {
    console.error('Failed to start dev server:', error);
    // Fallback to built files if dev server fails
    createWindow();
  }

  // Create application menu
  const template = [
    {
      label: 'SISO Agency',
      submenu: [
        {
          label: 'About SISO Agency',
          role: 'about'
        },
        { type: 'separator' },
        {
          label: 'Hide SISO Agency',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
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
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Stop dev server
  if (devServer) {
    devServer.kill('SIGTERM');
    devServer = null;
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up on app quit
app.on('before-quit', () => {
  if (devServer) {
    devServer.kill('SIGTERM');
    devServer = null;
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});