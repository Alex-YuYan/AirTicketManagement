import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Airport Not Found</h1>
        <p className="text-gray-600 mb-6">
          You've flown to a URL that does not exist. Please land on a valid URL.
        </p>
        <button
          onClick={goBack}
          className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Go around
        </button>
      </div>
    </div>
  );
};

export default NotFound;
