import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Heart, Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle smooth scrolling for hash links on the homepage
  const handleScroll = (e, hash) => {
    if (location.pathname !== '/') {
      // If not on homepage, let the link navigate normally
      return;
    }
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Change navbar style on scroll
  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY >= 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', changeBackground);
    return () => window.removeEventListener('scroll', changeBackground);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/', hash: 'home' },
    { label: 'Features', href: '/#features', hash: 'features' },
    { label: 'About', href: '/#about', hash: 'about' },
    { label: 'Contact', href: '/#contact', hash: 'contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b`}
      style={{ 
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-app)' }}>
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>NPVRS</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <a 
                key={link.label}
                href={link.href} 
                onClick={(e) => handleScroll(e, link.hash)}
                className="font-medium transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/signin" 
              className="font-medium transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 font-semibold flex items-center gap-2 transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--color-primary)', 
                borderRadius: 'var(--radius-app)', 
                color: 'white',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            >
              Register <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="focus:outline-none transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <a 
                key={link.label}
                href={link.href} 
                onClick={(e) => handleScroll(e, link.hash)}
                className="block px-3 py-2 text-base font-medium transition-colors"
                style={{ color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-app)' }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-primary)';
                  e.target.style.backgroundColor = 'var(--color-background)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--color-text-secondary)';
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {link.label}
              </a>
            ))}
            <div className="border-t my-2" style={{ borderColor: 'var(--color-border)' }}></div>
            <Link 
              to="/signin" 
              onClick={() => setIsOpen(false)} 
              className="block px-3 py-2 text-base font-medium transition-colors"
              style={{ color: 'var(--color-text-secondary)', borderRadius: 'var(--radius-app)' }}
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--color-primary)';
                e.target.style.backgroundColor = 'var(--color-background)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--color-text-secondary)';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              onClick={() => setIsOpen(false)} 
              className="block w-full text-left px-3 py-2 text-base font-medium transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--color-primary)', 
                borderRadius: 'var(--radius-app)', 
                color: 'white',
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;