import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-siso-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-siso-text-bold">Thank You for Logging In!</h1>
            <p className="text-xl text-siso-text">Welcome to the SISO Resource Hub. We're excited to have you here!</p>
          </div>
          
          <div className="glow-card">
            <h2 className="text-2xl font-semibold text-siso-text-bold mb-4">What's Next?</h2>
            <p className="text-siso-text mb-6">
              Explore our curated collection of resources, tools, and communities designed to help you succeed.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 transition-opacity"
            >
              Start Exploring
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;