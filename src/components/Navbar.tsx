import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Heart, Film, Home, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="bg-gray-900 bg-opacity-95 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-amber-500" />
              <span className="text-xl font-bold">MovieExplorer</span>
            </Link>
            
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" icon={<Home className="h-4 w-4" />} label="Home" active={location.pathname === '/'} />
              <NavLink to="/favorites" icon={<Heart className="h-4 w-4" />} label="Favorites" active={location.pathname === '/favorites'} />
              <NavLink to="/search" icon={<Search className="h-4 w-4" />} label="Search" active={location.pathname === '/search'} />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? 
                <Sun className="h-5 w-5 text-yellow-300" /> : 
                <Moon className="h-5 w-5 text-blue-300" />
              }
            </button>
            
            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium hidden sm:block">
                  {user.username}
                </span>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, icon, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-700 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Navbar;