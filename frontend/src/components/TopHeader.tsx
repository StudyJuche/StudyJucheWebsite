import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/studyjuche - logo - 250h.png';

export const TopHeader = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left section: Logo and Links */}
          <div className="flex items-center space-x-8 flex-1">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-16 w-auto object-contain"
                src={logo}
                alt="Study Juche Logo"
              />
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/courses" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">
                Courses
              </Link>
              <Link to="/articles" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">
                Articles
              </Link>
              <a 
                href="https://www.youtube.com/@StudyJuche"
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-700 hover:text-red-800 font-semibold transition-colors"
              >
                YouTube Channel
              </a>
            </nav>
          </div>

          {/* Center section: Site Title */}
          <div className="flex-shrink-0 flex justify-center flex-1">
            <Link to="/" className="flex items-center">
              <span 
                className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-wider"
                style={{
                  color: '#8B0000', // Dark Red
                  WebkitTextStroke: '1px #B8860B', // Dark Gold outline
                }}
              >
                Study.Juche
              </span>
            </Link>
          </div>

          {/* Right section: Links */}
          <div className="hidden md:flex items-center justify-end space-x-6 flex-1">
            <nav className="flex space-x-6 items-center">
              {isAuthenticated ? (
                <>
                  {hasRole('moderator') && (
                    <Link to="/admin" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">
                      Admin
                    </Link>
                  )}
                  <span className="text-gray-700">Welcome, {user?.username}</span>
                  <button onClick={logout} className="bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-800">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/about" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">
                    About
                  </Link>
                  <Link to="/community" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">
                    Community
                  </Link>
                  <Link to="/contact" className="text-gray-700 hover:text-red-800 font-semibold transition-colors">
                    Contact
                  </Link>
                  <Link to="/login" className="bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-800">
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          {/* Mobile menu button (optional placeholder for later) */}
          <div className="md:hidden flex items-center">
             <button className="text-gray-700 hover:text-red-800 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};
