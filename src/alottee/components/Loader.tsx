import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-red-600 animate-spin"></div>
        <div className="mt-4 text-center">
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;