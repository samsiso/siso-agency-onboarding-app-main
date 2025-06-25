export default async function handler(req: any, res: any) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Telegram webhook server is running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
} 