import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { MessageSquare } from 'lucide-react';

const SisoAI = () => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-8 h-8 text-siso-red" />
              <h1 className="text-3xl font-bold text-siso-text-bold">SISO AI Assistant</h1>
            </div>
            
            {/* Chat container */}
            <div className="bg-black/20 rounded-lg border border-siso-text/10 h-[600px] flex flex-col">
              {/* Chat messages area */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-siso-red flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-siso-text-bold mb-1">SISO AI</p>
                      <div className="bg-siso-text/5 rounded-lg p-3 text-siso-text">
                        Hello! I'm your SISO AI assistant. How can I help you today?
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Input area */}
              <div className="border-t border-siso-text/10 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-black/20 border border-siso-text/10 rounded-lg px-4 py-2 text-siso-text focus:outline-none focus:ring-2 focus:ring-siso-red/50"
                  />
                  <button className="bg-gradient-to-r from-siso-red to-siso-orange text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SisoAI;