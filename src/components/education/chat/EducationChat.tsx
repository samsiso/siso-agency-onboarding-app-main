
import React from 'react';

export const EducationChat = () => {
  return (
    <div className="p-4 border border-siso-text/10 rounded-lg">
      <h2 className="text-lg font-semibold text-siso-text-bold mb-4">Education Assistant</h2>
      <div className="bg-black/20 p-4 rounded-lg mb-4 h-60 overflow-y-auto">
        <div className="text-siso-text/70">Chat messages will appear here</div>
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Ask a question..." 
          className="flex-1 px-3 py-2 bg-black/20 border border-siso-text/10 rounded-md text-siso-text focus:outline-none focus:ring-1 focus:ring-siso-orange"
        />
        <button className="px-4 py-2 bg-siso-orange text-white rounded-md">Send</button>
      </div>
    </div>
  );
};

export default EducationChat;
