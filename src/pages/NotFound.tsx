import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold text-siso-text mb-4">404</h1>
      <p className="text-xl text-siso-text/80 mb-8">Page not found</p>
      <Link 
        to="/" 
        className="text-siso-text hover:text-siso-text-bold underline"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;