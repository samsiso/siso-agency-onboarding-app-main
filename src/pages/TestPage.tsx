import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Test Page</h1>
        <p className="mb-4">If you can see this page, the basic app rendering is working correctly.</p>
        <div className="p-4 bg-green-900/30 border border-green-500/20 rounded">
          <p className="text-green-400">
            This indicates that the routing system can render components properly.
          </p>
        </div>
      </div>
    </div>
  );
}
