export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'SISO Agency Telegram Voice Assistant is running',
      timestamp: new Date().toISOString(),
      method: 'GET',
      url: req.url
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      console.log('Webhook received:', JSON.stringify(body, null, 2));
      
      // Simple test response
      return res.status(200).json({ 
        ok: true, 
        received: true,
        timestamp: new Date().toISOString(),
        message: 'Webhook received successfully'
      });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 