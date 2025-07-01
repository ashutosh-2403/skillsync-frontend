import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: 'home' | 'dashboard' | 'upload' | 'assistant' | 'profile') => void;
  user: any;
  onAuthClick: (mode: 'login' | 'register') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, user, onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const { logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', view: 'home' as const },
    { id: 'upload', label: 'Upload Resume', view: 'upload' as const },
    { id: 'dashboard', label: 'Dashboard', view: 'dashboard' as const },
    { id: 'assistant', label: 'AI Assistant', view: 'assistant' as const },
  ];

  const handleLogout = () => {
    logout();
    onViewChange('home');
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onViewChange('home')}
          >
            <div className="relative">
              <Brain className="w-8 h-8 text-primary-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              SkillSync
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.view)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  currentView === item.view
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-primary-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {currentView === item.view && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {user.firstName}
                  </span>
                </button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-2"
                  >
                    <button
                      onClick={() => {
                        onViewChange('profile');
                        setShowUserMenu(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onAuthClick('login')}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthClick('register')}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200 py-4"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.view);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  currentView === item.view
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {user ? (
              <div className="border-t border-neutral-200 mt-4 pt-4">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onViewChange('profile');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-neutral-600 hover:text-primary-600 hover:bg-neutral-50"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-sm text-neutral-600 hover:text-primary-600 hover:bg-neutral-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-neutral-200 mt-4 pt-4 space-y-2 px-4">
                <button
                  onClick={() => {
                    onAuthClick('login');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-sm font-medium text-neutral-700 hover:text-primary-600"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onAuthClick('register');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm font-medium py-2 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;