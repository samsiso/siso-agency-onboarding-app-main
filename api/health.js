export default async function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Telegram webhook server is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    service: 'SISO Agency Telegram Voice Assistant'
  });
} 