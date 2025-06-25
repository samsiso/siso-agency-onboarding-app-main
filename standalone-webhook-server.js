const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase configuration
const SUPABASE_URL = 'https://avdgyrepwrvsvwgxrccr.supabase.co/functions/v1/telegram-webhook';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2ZGd5cmVwd3J2c3Z3Z3hyY2NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzgwODIsImV4cCI6MjA1OTIxNDA4Mn0.8MZ2etAhQ1pTJnK84uoqAFfUirv_kaoYcmKHhKgLAWU';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SISO Telegram Webhook Proxy Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Main webhook proxy endpoint
app.post('/webhook', async (req, res) => {
  console.log(`🔥 Webhook received: ${new Date().toISOString()}`);
  console.log('📝 Payload:', JSON.stringify(req.body, null, 2));
  
  try {
    // Forward to Supabase Edge Function with auth
    console.log(`📤 Forwarding to: ${SUPABASE_URL}`);
    
    const response = await fetch(SUPABASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(req.body)
    });
    
    const result = await response.text();
    console.log(`📦 Supabase response [${response.status}]:`, result);
    
    // Return the response from Supabase
    res.status(response.status);
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Handle OPTIONS requests
app.options('*', (req, res) => {
  res.status(200).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SISO Telegram Webhook Proxy running on port ${PORT}`);
  console.log(`📍 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`🔗 Supabase Target: ${SUPABASE_URL}`);
}); 