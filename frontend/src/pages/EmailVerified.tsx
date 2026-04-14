import { Link } from 'react-router-dom';
import logo from '../assets/images/studyjuche - logo - 250h.png';

export const EmailVerified = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-24 w-auto" src={logo} alt="Study Juche Logo" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verified!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your email address has been successfully verified.
        </p>
        <div className="mt-8">
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Proceed to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
