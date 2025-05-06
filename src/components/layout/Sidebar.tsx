import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Settings,
  Users,
  ChevronRight,
  Menu,
  X,
  LogOut,
  PlayCircle,
  Calculator,
  IndianRupee
} from 'lucide-react';
import { SidebarSchemeList } from './SidebarSchemeList';
import { SidebarHeader } from './SidebarHeader';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { PaymentCounter } from '../payments/PaymentCounter.tsx';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPaymentCounter, setShowPaymentCounter] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'fixed top-4 z-50 rounded-lg p-2 bg-[#1e3a8a] text-white transition-all duration-300',
          isCollapsed ? 'left-[5.2rem]' : 'left-[15rem]'
        )}
      >
        {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-[#1e3a8a] dark:bg-gray-800 text-white transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarHeader isCollapsed={isCollapsed} />

        <nav className="p-4 space-y-6">
          <div className="space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                  isActive ? 'bg-blue-700 dark:bg-blue-600' : 'hover:bg-blue-700/50 dark:hover:bg-gray-700/50',
                  isCollapsed && 'justify-center'
                )
              }
            >
              <LayoutDashboard className="h-5 w-5" />
              {!isCollapsed && <span>{t('dashboard')}</span>}
            </NavLink>

            <NavLink
              to="/schemes-1"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                  isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50',
                  isCollapsed && 'justify-center'
                )
              }
            >
              <Building2 className="h-5 w-5" />
              {!isCollapsed && <span>{t('allSchemes')}</span>}
            </NavLink>

            <NavLink
              to="/payment-dashboard"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                  isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50',
                  isCollapsed && 'justify-center'
                )
              }
            >
              <IndianRupee className="h-5 w-5" />
              {!isCollapsed && <span>Payment Dashboard</span>}
            </NavLink>
          </div>
          

          <NavLink
            to="/payment-counter"
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50',
                isCollapsed && 'justify-center'
              )
            }
          >
          <Calculator className="h-5 w-5" />
          {!isCollapsed && <span>Payment Counter</span>
            }
          </NavLink>

          <SidebarSchemeList isCollapsed={isCollapsed} />

          <div className="pt-4 border-t border-blue-700">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                  isActive ? 'bg-blue-700' : 'hover:bg-blue-700/50',
                  isCollapsed && 'justify-center'
                )
              }
            >
              <Users className="h-5 w-5" />
              {!isCollapsed && <span>{t('allUsers')}</span>}
            </NavLink>
          </div>
        </nav>

        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 space-y-2",
          isCollapsed ? "text-center" : ""
        )}>
       

          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center w-full p-3 rounded-lg text-white hover:bg-blue-700/50 transition-colors",
              isCollapsed ? "justify-center" : "space-x-3"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>{t('logout')}</span>}
          </button>
        </div>
        
        {/* Payment Counter Modal */}
        {showPaymentCounter && (
          <PaymentCounter onClose={() => setShowPaymentCounter(false)} />
        )}
      </aside>
    </>
  );
}