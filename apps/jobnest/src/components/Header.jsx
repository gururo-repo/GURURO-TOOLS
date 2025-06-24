import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AuthStatus from './AuthStatus';
import logo from '../assets/logo.png';

function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get user from localStorage to check if logged in
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <header className='fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-black/60 glass-card-modern'>
      <nav className="mobile-container h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="touch-target">
            <img
              src={logo}
              alt="gururo"
              className='h-8 sm:h-10 lg:h-12 w-auto'
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <AuthStatus />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden touch-target p-2 text-cyan-100 hover:text-cyan-300 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md glass-card-modern">
          <div className="mobile-container py-4 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/industry-insights"
                  className="mobile-nav-item text-cyan-100 hover:text-cyan-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Industry Insights
                </Link>
                <Link
                  to="/resume-generator"
                  className="mobile-nav-item text-cyan-100 hover:text-cyan-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Resume Generator
                </Link>
                <Link
                  to="/competency-test"
                  className="mobile-nav-item text-cyan-100 hover:text-cyan-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Competency Test
                </Link>
                <Link
                  to="/profile/edit"
                  className="mobile-nav-item text-cyan-100 hover:text-cyan-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="mobile-nav-item text-left w-full text-red-400 hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="mobile-nav-item text-cyan-100 hover:text-cyan-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;