import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Upload, Search, LogOut } from 'lucide-react';
import logo from '../assets/sakuraPanjang.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', testId: 'sidebar-dashboard' },
    { icon: Upload, label: 'Upload Document', path: '/upload', testId: 'sidebar-upload' },
    { icon: Search, label: 'Search Documents', path: '/search', testId: 'sidebar-search' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-green-900 text-white min-h-screen flex flex-col">

      {/* LOGO SECTION */}
      <div className="p-6 border-b border-green-800 flex justify-center">
        <div className="bg-white rounded-lg px-4 py-3 w-full flex justify-center">
          <img
            src={logo}
            alt="Company Logo"
            className="h-14 object-contain"
          />
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              data-testid={item.testId}
              onClick={() => navigate(item.path)}
              className={`sidebar-link w-full flex items-center space-x-3 px-6 py-3 text-left ${
                isActive ? 'active' : ''
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-6 border-t border-green-800">
        <button
          data-testid="sidebar-logout"
          onClick={handleLogout}
          className="sidebar-link w-full flex items-center space-x-3 px-6 py-3 text-left rounded-lg"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;