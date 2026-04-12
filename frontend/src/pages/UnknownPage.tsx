import { Link } from 'react-router-dom';
import logo from '../assets/images/studyjuche - logo - 250h.png';

export const UnknownPage = () => (
  <div className="min-h-screen flex flex-col justify-center items-center text-center py-12 px-4 sm:px-6 lg:px-8">
    <img src={logo} alt="Study Juche Logo" className="h-32 w-auto opacity-50 mb-8" />
    <h1 
      className="text-6xl font-extrabold text-red-700"
      style={{ WebkitTextStroke: '1px #B8860B' }}
    >
      404
    </h1>
    <h2 className="mt-2 text-3xl font-bold text-gray-800">Page Not Found</h2>
    <p className="mt-4 text-lg text-gray-600">
      The page you are looking for does not exist or has been moved.
    </p>
    <div className="mt-8">
      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-700 hover:bg-red-800"
      >
        Go back home
      </Link>
    </div>
  </div>
);
