import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[600px]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://www.bidabhadohi.com/assets/downloadmedia/HomePage/Header/638472244415399064.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl text-white">
          <h1 className="text-5xl font-bold mb-6">
            Bhadohi Industrial Development Authority
          </h1>
          <p className="text-xl mb-8">
            Streamlined Property Management System for efficient handling of housing schemes,
            commercial properties, and land development projects.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#1e3a8a] text-white px-6 py-3 rounded-md font-medium hover:bg-blue-800 text-lg"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}