  import React from 'react';

  const NotFound = () => {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 animate-fadeIn">
        <div className="text-center animate-slideIn">
          <h1 className="text-9xl text-red-500">404</h1>
          <p className="text-xl text-gray-800">Oops! Page not found.</p>
          <a href="/" className="mt-5 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition">
            Go back to Home
          </a>
        </div>
      </div>
    );
  };

  export default NotFound;
