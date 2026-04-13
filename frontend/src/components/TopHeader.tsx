import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/studyjuche - logo - 250h.png';

const UserMenu = () => {
  const { user, logout, hasRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
        <span className="text-gray-700 font-semibold">Welcome, {user?.username}</span>
        <svg className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
          {hasRole('moderator') && (
            <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Panel</Link>
          )}
          <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link> {/* Added Settings link */}
          <div className="border-t my-1"></div>
          <Link to="/courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Courses</Link>
          <Link to="/articles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Articles</Link>
          <div className="border-t my-1"></div>
          <Link to="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">About</Link>
          <Link to="/community" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Community</Link>
          <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Contact</Link>
          <div className="border-t my-1"></div>
          <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-700 hover:bg-red-50">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export const TopHeader = () => {
  const { isAuthenticated, logout, hasRole } = useAuth(); // Added hasRole here for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50" ref={headerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-20">
          {/* Left section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-16 w-auto object-contain" src={logo} alt="Study Juche Logo" />
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/courses" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">Courses</Link>
              <Link to="/articles" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">Articles</Link>
              <a href="https://www.youtube.com/@StudyJuche" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">YouTube Channel</a>
            </nav>
          </div>

          {/* Center section - Absolutely Positioned */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
            <Link to="/" className="flex items-center">
              <span className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-wider" style={{ color: '#8B0000', WebkitTextStroke: '1px #B8860B' }}>
                Study Juche
              </span>
            </Link>
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center justify-end">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <nav className="flex space-x-6 items-center">
                <Link to="/about" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">About</Link>
                <Link to="/community" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">Community</Link>
                <Link to="/contact" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">Contact</Link>
                <Link to="/login" className="bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-800">Login</Link>
              </nav>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 hover:text-red-800 focus:outline-none">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/courses" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">Courses</Link>
            <Link to="/articles" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">Articles</Link>
            <a href="https://www.youtube.com/@StudyJuche" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">YouTube</a>
            <div className="border-t my-2"></div>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">Dashboard</Link>
                {hasRole('moderator') && ( // Added admin panel to mobile menu
                  <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">Admin Panel</Link>
                )}
                <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">Settings</Link> {/* Added Settings link to mobile menu */}
                <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">About</Link>
                <Link to="/community" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">Community</Link>
                <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">Contact</Link>
                <div className="border-t my-2"></div>
                <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <>
                <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">About</Link>
                <Link to="/community" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">Community</Link>
                <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-800 hover:bg-gray-50">Contact</Link>
                <div className="border-t my-2"></div>
                <Link to="/login" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-700 hover:bg-red-50">Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
