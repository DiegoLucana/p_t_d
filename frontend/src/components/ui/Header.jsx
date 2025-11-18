import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { getCurrentUser } from '../../services/auth';


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem('user_email') || 'admin@busflow.com'
  );
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/real-time-monitoring-dashboard',
      icon: 'Monitor',
      tooltip: 'Real-time fleet monitoring and capacity tracking'
    },
    {
      label: 'Validation',
      path: '/validation-laboratory',
      icon: 'Video',
      tooltip: 'Quality assurance and video analysis tools'
    },
    {
      label: 'Video Analysis',
      path: '/video-analysis-playback',
      icon: 'Play',
      tooltip: 'Detailed video playback and frame analysis'
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    let isSubscribed = true;

    const loadUser = async () => {
      try {
        const data = await getCurrentUser();
        const email = data?.email;

        if (isSubscribed && email) {
          setUserEmail(email);
          localStorage.setItem('user_email', email);
        }
      } catch (error) {
        console.error('No se pudo obtener el usuario actual', error);
      }
    };

    loadUser();

    return () => {
      isSubscribed = false;
    };
  }, []);


  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    window.location.href = '/login';
    setIsUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-card">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Bus" size={20} color="white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              Cpatbus
            </h1>
            <span className="text-xs text-muted-foreground font-mono">
              Análisis de Transporte
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <div key={item?.path} className="relative group">
              <Button
                variant={isActiveRoute(item?.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                className="transition-all duration-200 hover:shadow-sm"
              >
                {item?.label}
              </Button>
              
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-elevated opacity-0 group-hover:opacity-100 transition-opacity duration-150 delay-150 pointer-events-none whitespace-nowrap z-10">
                {item?.tooltip}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover rotate-45"></div>
              </div>
            </div>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-status"></div>
            <span className="text-sm font-medium text-success">System Online</span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUserMenu}
              iconName="User"
              iconPosition="left"
              iconSize={16}
              className="transition-all duration-200"
            >
              <span className="hidden sm:inline">Admin</span>
            </Button>

            {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-elevated z-20 animate-slide-in-from-top">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-medium text-popover-foreground">System Administrator</p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                    <div className="py-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      // Handle settings navigation
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Icon name="Settings" size={14} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      // Handle help navigation
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Icon name="HelpCircle" size={14} />
                    <span>Help & Support</span>
                  </button>
                  <hr className="my-1 border-border" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={20}
            className="md:hidden transition-all duration-200"
          />
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-elevated animate-slide-in-from-top">
          <nav className="px-4 py-3 space-y-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-left transition-all duration-200 ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <div className="flex-1">
                  <div className="font-medium">{item?.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{item?.tooltip}</div>
                </div>
              </button>
            ))}
          </nav>
          
          {/* Mobile Status */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-status"></div>
              <span className="text-sm font-medium text-success">System Online</span>
            </div>
          </div>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Overlay for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;