import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem('cookie_consent');
    if (!hasConsented) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    // Store consent in localStorage and hide the banner
    localStorage.setItem('cookie_consent', 'true');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm mb-4 sm:mb-0">
          We use cookies and session storage to improve your experience, including for authentication and remembering your progress. By continuing to use this site, you agree to our use of these technologies. Please review our{' '}
          <Link to="/privacy" className="font-bold underline hover:text-yellow-300">Privacy Policy</Link> and{' '}
          <Link to="/tos" className="font-bold underline hover:text-yellow-300">Terms of Service</Link>.
        </p>
        <button
          onClick={handleAccept}
          className="bg-yellow-600 hover:bg-yellow-700 text-blue-900 font-bold py-2 px-6 rounded-lg flex-shrink-0"
        >
          Accept
        </button>
      </div>
    </div>
  );
};
