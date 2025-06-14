// Partner Application Notification Edge Function
// Sends email notifications when new applications are submitted

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  template: 'application_received' | 'application_approved' | 'commission_earned';
  data: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { to, template, data } = await req.json() as EmailRequest;

    // Email templates
    const templates = {
      application_received: {
        subject: '🎉 Your SISO Partnership Application Has Been Received!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ff6b35;">Thank You, ${data.name}!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Your partnership application has been received</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-top: 0;">What happens next?</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ff6b35; margin-top: 0;">⏰ Review Process (24-48 hours)</h3>
                <p>Our partnership team will carefully review your application and network description.</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ff6b35; margin-top: 0;">📧 Decision Notification</h3>
                <p>You'll receive an email with our decision and next steps if approved.</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #ff6b35; margin-top: 0;">🚀 Getting Started</h3>
                <p>If approved, you'll get access to your partner dashboard and onboarding materials.</p>
              </div>
              
              <div style="background: #ff6b35; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h3 style="margin-top: 0;">💰 Earn 20% Commission</h3>
                <p style="margin-bottom: 0;">On every successful project (£249 - £2,490 range)</p>
              </div>
            </div>
            
            <div style="background: #1a1a1a; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #ccc;">Questions? Reply to this email or contact us at partnership@sisoagency.com</p>
            </div>
          </div>
        `
      },
      
      application_approved: {
        subject: '🎉 Welcome to the SISO Partnership Program!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">Congratulations, ${data.name}!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">You're now a SISO Partner</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-top: 0;">Your partnership benefits:</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">💰 20% Commission Rate</h3>
                <p>Earn £50-£500 per successful project</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">🎯 Zero-Risk MVP Approach</h3>
                <p>We build free MVPs first - clients only pay if they love it</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                <h3 style="color: #ff6b35; margin-top: 0;">📊 Real-Time Dashboard</h3>
                <p>Track your leads, commissions, and performance</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get('SITE_URL')}/partnership/dashboard" 
                   style="background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Access Your Dashboard
                </a>
              </div>
            </div>
            
            <div style="background: #1a1a1a; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #ccc;">Ready to start earning? Log into your dashboard and add your first lead!</p>
            </div>
          </div>
        `
      },
      
      commission_earned: {
        subject: '💰 You\'ve Earned a New Commission!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #34ce57 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0;">🎉 Commission Earned!</h1>
              <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: bold;">£${data.commissionAmount}</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-top: 0;">Project Details:</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <p><strong>Client:</strong> ${data.clientName}</p>
                <p><strong>Project Value:</strong> £${data.projectValue}</p>
                <p><strong>Commission Rate:</strong> ${data.commissionRate}%</p>
                <p><strong>Your Earnings:</strong> £${data.commissionAmount}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${Deno.env.get('SITE_URL')}/partnership/dashboard" 
                   style="background: #ff6b35; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View Dashboard
                </a>
              </div>
            </div>
            
            <div style="background: #1a1a1a; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #ccc;">Keep up the great work! More leads = more commissions.</p>
            </div>
          </div>
        `
      }
    };

    const selectedTemplate = templates[template];
    if (!selectedTemplate) {
      throw new Error(`Unknown email template: ${template}`);
    }

    // Here you would integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll log the email content
    console.log('Sending email:', {
      to,
      subject: selectedTemplate.subject,
      html: selectedTemplate.html
    });

    // TODO: Replace with actual email service integration
    // Example with Resend:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     from: 'SISO Partnership <partnership@sisoagency.com>',
    //     to: [to],
    //     subject: selectedTemplate.subject,
    //     html: selectedTemplate.html
    //   })
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notification sent successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error sending email notification:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});