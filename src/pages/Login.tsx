import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


export function Login() {
  // const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(email, password);
      await login(email, password); 
      navigate('/dashboard');
    } catch (error) {
      console.error('loginPage Login failed:', error);
      alert('loginPage Invalid credentials or server error');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Building2 className="h-16 w-16 text-[#1e3a8a] mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              BIDA Property Management System
            </h2>
            <p className="text-gray-600 mt-2 text-center">
              Welcome back! Please login to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {setEmail(e.target.value) 
                    console.log(e.target.value);
                  }}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {setPassword(e.target.value)
                    console.log(e.target.value);
                    
                  }}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-[#1e3a8a] hover:text-blue-700">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1e3a8a] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Right Section - Decorative */}
      <div className="hidden lg:block lg:w-1/2 bg-[#1e1e2d] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffa500] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-md text-center">
            <blockquote className="text-2xl font-light mb-4">
              "The beauty of e-governance is that a few keystrokes can bring smiles on a million faces."
            </blockquote>
            <cite className="text-lg">- Narendra Modi</cite>
          </div>
        </div>
      </div>
    </div>
  );
}