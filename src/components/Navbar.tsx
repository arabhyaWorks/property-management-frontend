import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Menu } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-[#1e3a8a]" />
            <div>
              <h1 className="text-xl font-bold text-[#1e3a8a]">BIDA</h1>
              <p className="text-xs text-gray-600">Property Management System</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-[#1e3a8a]">Home</a>
            <a href="#features" className="text-gray-700 hover:text-[#1e3a8a]">Features</a>
            <a href="#schemes" className="text-gray-700 hover:text-[#1e3a8a]">Schemes</a>
            <a href="#faq" className="text-gray-700 hover:text-[#1e3a8a]">FAQ</a>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#1e3a8a] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#1e3a8a]"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-700 hover:text-[#1e3a8a]">Home</a>
              <a href="#features" className="text-gray-700 hover:text-[#1e3a8a]">Features</a>
              <a href="#schemes" className="text-gray-700 hover:text-[#1e3a8a]">Schemes</a>
              <a href="#faq" className="text-gray-700 hover:text-[#1e3a8a]">FAQ</a>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#1e3a8a] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 w-full"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}