import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/studyjuche - logo - 50h.png'; // Using a smaller logo for the footer

export const SiteFooter = () => {
  const currentYear = new Date().getFullYear();
  const moneroAddress = import.meta.env.VITE_MONERO_ADDRESS || '';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(moneroAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const truncatedAddress = moneroAddress ? `${moneroAddress.substring(0, 6)}...${moneroAddress.substring(moneroAddress.length - 4)}` : '';

  return (
    <footer className="bg-blue-900 text-white border-t-4 border-yellow-600">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Left Section: Logo and Socials */}
          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <Link to="/" className="flex-shrink-0">
              <img className="h-12 w-auto" src={logo} alt="Study Juche Logo" />
            </Link>
            <div className="flex space-x-4">
              {/* YouTube Icon */}
              <a href="https://www.youtube.com/@StudyJuche" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.615 3.184a.75.75 0 00-.563-.563C18.041 2.5 12 2.5 12 2.5s-6.041 0-7.052.121a.75.75 0 00-.563.563C3.266 4.195 2.5 8.128 2.5 12s.766 7.805 1.885 8.816a.75.75 0 00.563.563C5.959 21.5 12 21.5 12 21.5s6.041 0 7.052-.121a.75.75 0 00.563-.563C20.734 19.805 21.5 15.872 21.5 12s-.766-7.805-1.885-8.816zM10 15.562V8.438a.75.75 0 011.125-.649l5.25 3.563a.75.75 0 010 1.298l-5.25 3.563A.75.75 0 0110 15.562z" clipRule="evenodd" /></svg>
              </a>
              {/* Discord Icon */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v19.056c0 1.368-1.104 2.472-2.46 2.472H4.46C3.104 24 2 22.896 2 21.528V2.472C2 1.104 3.104 0 4.46 0h15.08zM9.5 12.25v-1.5h5v1.5H9.5zm-3 3.375v-1.5h11v1.5H6.5zm3-6.75v-1.5h5v1.5H9.5z"/></svg>
              </a>
            </div>
          </div>

          {/* Middle Section: Search and Copyright */}
          <div className="text-center">
            <div className="relative w-full max-w-sm mx-auto">
              <input type="search" placeholder="Search content..." className="w-full bg-blue-800 text-white placeholder-gray-400 border-2 border-blue-700 rounded-full py-2 px-4 focus:outline-none focus:border-yellow-600" />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3"><svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg></div>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Copyright &copy; {currentYear} Study.Juche
            </p>
            <div className="mt-2 text-xs text-gray-500 space-x-4">
                <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
                <span>&bull;</span>
                <Link to="/tos" className="hover:text-gray-300">Terms of Service</Link>
            </div>
          </div>

          {/* Right Section: Monero Donation */}
          {moneroAddress && (
            <div className="text-center md:text-right">
              <h3 className="font-semibold text-gray-200">Support Study.Juche</h3>
              <div className="mt-2 flex items-center justify-center md:justify-end group relative">
                <svg className="h-6 w-6 text-yellow-500 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm7 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-3.5 4c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
                <p className="text-sm font-mono text-gray-300">{truncatedAddress}</p>
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 break-all">
                  {moneroAddress}
                </div>
              </div>
              <button 
                onClick={handleCopy}
                className="mt-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-blue-900 font-bold py-1 px-3 rounded-full"
              >
                {copied ? 'Copied!' : 'Copy Address'}
              </button>
            </div>
          )}

        </div>
      </div>
    </footer>
  );
};
