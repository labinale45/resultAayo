'use client'
import React from 'react';

const NotFound = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 animate-fadeIn">
      <div className="text-center animate-slideIn">
        <h1 className="text-9xl text-red-500">404</h1>
        <p className="text-xl text-gray-800">Oops! Page not found.</p>
        <div className="flex gap-4 justify-center mt-5">
          <button 
            onClick={goBack} 
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
          >
            Go Back
          </button>
          <a 
            href="/" 
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
