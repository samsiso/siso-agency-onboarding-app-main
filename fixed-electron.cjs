const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  console.log('🚀 Creating Electron window with full interaction support...');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      allowRunningInsecureContent: false,
      webSecurity: false, // Allow localhost
      experimentalFeatures: true,
      backgroundThrottling: false, // Prevent throttling
      offscreen: false,
      sandbox: false, // Disable sandbox for full functionality
      spellcheck: false,
      devTools: true
    },
    icon: path.join(__dirname, 'SISO-Agency-App.icns'),
    show: false,
    backgroundColor: '#000000',
    title: 'SISO Agency - FIXED',
    titleBarStyle: 'default',
    resizable: true,
    minimizable: true,
    maximizable: true,
    fullscreenable: true,
    webSecurity: false
  });

  // Load the dev server
  mainWindow.loadURL('http://localhost:2222');

  // Show when ready
  mainWindow.once('ready-to-show', () => {
    console.log('✅ Window ready - showing and focusing...');
    mainWindow.show();
    mainWindow.focus();
    
    // Open DevTools to see console logs
    mainWindow.webContents.openDevTools();
    
    // Test clicking after a delay
    setTimeout(() => {
      console.log('🔧 Testing click functionality...');
      
      mainWindow.webContents.executeJavaScript(`
        console.log('=== CLICK DEBUGGING ===');
        
        // Remove any existing click blockers
        document.body.style.pointerEvents = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        
        // Test if we can click on buttons
        const buttons = document.querySelectorAll('button, a, [role="button"]');
        console.log('Found', buttons.length, 'clickable elements');
        
        // Add universal click handler
        document.addEventListener('click', (e) => {
          console.log('👆 CLICK:', e.target.tagName, e.target.className);
          console.log('Event details:', {
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            defaultPrevented: e.defaultPrevented,
            isTrusted: e.isTrusted
          });
        }, true);
        
        // Test React event system
        if (window.React) {
          console.log('⚛️ React found');
        } else {
          console.log('❌ React not found - checking for React elements...');
          const reactElements = document.querySelectorAll('[data-reactroot], [data-react-checksum]');
          console.log('React elements found:', reactElements.length);
        }
        
        // Force enable all interactions
        const style = document.createElement('style');
        style.textContent = \`
          * {
            pointer-events: auto !important;
            user-select: auto !important;
            touch-action: auto !important;
          }
        \`;
        document.head.appendChild(style);
        
        console.log('🔧 Interaction fixes applied');
        
        'Click debugging complete'
      `).then(result => {
        console.log('✅ Click debugging result:', result);
      }).catch(err => {
        console.error('❌ Click debugging failed:', err);
      });
    }, 2000);
  });

  // Handle navigation
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('📄 Page loaded');
  });

  // Handle console messages
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[RENDERER] ${level}: ${message}`);
  });

  // Handle crashes
  mainWindow.webContents.on('crashed', () => {
    console.error('💥 Renderer crashed!');
  });

  // Prevent accidental closing
  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Don't quit on macOS
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

console.log('🔧 Fixed Electron app initialized');