import React from 'react';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1e3a8a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="h-8 w-8" />
              <div>
                <h3 className="font-bold text-lg">BIDA</h3>
                <p className="text-sm text-blue-200">Property Management System</p>
              </div>
            </div>
            <p className="text-blue-200">
              Streamlining property management for Bhadohi Industrial Development Authority
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-blue-200 hover:text-white">Features</a></li>
              <li><a href="#schemes" className="text-blue-200 hover:text-white">Schemes</a></li>
              <li><a href="#faq" className="text-blue-200 hover:text-white">FAQ</a></li>
              <li><a href="/login" className="text-blue-200 hover:text-white">Login</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-200" />
                <span className="text-blue-200">+91 542 236 7568</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-200" />
                <span className="text-blue-200">contact@bidabhadohi.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-200" />
                <span className="text-blue-200">Bhadohi, UP 221401</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Office Hours</h3>
            <p className="text-blue-200">Monday - Saturday</p>
            <p className="text-blue-200">9:00 AM - 5:00 PM</p>
            <p className="text-blue-200 mt-2">Closed on Sundays and Government Holidays</p>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
          <p>© 2024 Bhadohi Industrial Development Authority. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}