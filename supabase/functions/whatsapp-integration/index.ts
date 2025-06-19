
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock data for demonstration purposes
// In a real implementation, you would use WhatsApp Business API
const mockQrCode = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=whatsapp-mock-qr-code";
const mockMessages = [
  {
    id: "msg1",
    content: "Hello, I need help building my app",
    timestamp: new Date(Date.now() - 3600000),
    from: "app",
    status: "read"
  },
  {
    id: "msg2",
    content: "I can help with that! What kind of app are you building?",
    timestamp: new Date(Date.now() - 3500000),
    from: "whatsapp",
    status: "delivered"
  },
  {
    id: "msg3",
    content: "I want to build a social media platform for creators",
    timestamp: new Date(Date.now() - 3400000),
    from: "app",
    status: "delivered"
  },
  {
    id: "msg4",
    content: "Great! Let's discuss the features you need",
    timestamp: new Date(Date.now() - 3300000),
    from: "whatsapp",
    status: "delivered"
  }
];

// Mock connection state
let mockConnected = false;
let mockAutoForward = true;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { action, message, autoForward } = await req.json();
    console.log(`Processing WhatsApp integration request: ${action}`);

    // Handle different action types
    switch (action) {
      case 'status':
        // Return connection status
        return new Response(
          JSON.stringify({
            success: true,
            connected: mockConnected,
            qrCode: mockConnected ? null : mockQrCode,
            messages: mockMessages,
            autoForward: mockAutoForward
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'connect':
        // Simulate connection process
        mockConnected = true; // In a real app, this would happen after QR scan
        return new Response(
          JSON.stringify({
            success: true,
            qrCode: mockQrCode
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'disconnect':
        // Disconnect WhatsApp
        mockConnected = false;
        return new Response(
          JSON.stringify({
            success: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'send':
        // Send a message to WhatsApp
        if (!mockConnected) {
          throw new Error('WhatsApp is not connected');
        }
        
        if (!message) {
          throw new Error('No message provided');
        }

        // In a real implementation, this would use the WhatsApp Business API to send a message
        const newMessage = {
          id: `msg${Date.now()}`,
          content: message,
          timestamp: new Date(),
          from: "app",
          status: "sent"
        };
        
        mockMessages.push(newMessage);
        
        // Simulate response after a short delay
        // In a real app, this would come from the WhatsApp API callback
        setTimeout(() => {
          const response = {
            id: `msg${Date.now() + 1}`,
            content: `Got your message: "${message}". How can I help with that?`,
            timestamp: new Date(),
            from: "whatsapp",
            status: "delivered"
          };
          mockMessages.push(response);
        }, 5000);
        
        return new Response(
          JSON.stringify({
            success: true,
            message: newMessage
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'settings':
        // Update settings
        if (typeof autoForward === 'boolean') {
          mockAutoForward = autoForward;
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            autoForward: mockAutoForward
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error in whatsapp-integration function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
