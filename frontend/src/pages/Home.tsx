import { Link } from 'react-router-dom';
import logo from '../assets/images/studyjuche - logo - 500h.png'; // Using a larger logo for the banner

const HeroBanner = () => (
  <div className="relative bg-gray-800 text-white py-20 px-4 text-center overflow-hidden">
    {/* Subtle background image can be added here */}
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="relative z-10 flex flex-col items-center">
      <img src={logo} alt="Study Juche Logo" className="h-48 md:h-64 w-auto object-contain mb-6" />
      <h1 
        className="text-4xl md:text-6xl font-serif font-bold uppercase tracking-wider mb-2"
        style={{
          color: '#FFFFFF',
          WebkitTextStroke: '1.5px #8B0000',
          textShadow: '3px 3px 6px rgba(0,0,0,0.5)'
        }}
      >
        Welcome to Study.Juche
      </h1>
      <p className="text-xl md:text-2xl font-light text-gray-300 mb-8">Learn from the Source</p>
      <Link
        to="/register"
        className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
      >
        Start Your Lessons
      </Link>
    </div>
  </div>
);

const CoreCourses = () => (
  <div className="py-16 bg-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Core Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course 1 */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-4 border-red-600">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Core Principles</h3>
          <p className="text-gray-600 mb-6">A deep dive in the philosophy of Juche.</p>
          <Link to="#" className="font-semibold text-red-600 hover:text-red-800">Learn More &rarr;</Link>
        </div>
        {/* Course 2 */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-4 border-blue-600">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Political Independence</h3>
          <p className="text-gray-600 mb-6">Exploring the theory of sovereign socialism.</p>
          <Link to="#" className="font-semibold text-blue-600 hover:text-blue-800">Learn More &rarr;</Link>
        </div>
        {/* Course 3 */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-4 border-red-600">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Economic Self-Reliance</h3>
          <p className="text-gray-600 mb-6">The model for independent self-sustaining economics.</p>
          <Link to="#" className="font-semibold text-red-600 hover:text-red-800">Learn More &rarr;</Link>
        </div>
      </div>
    </div>
  </div>
);

const FeaturedContent = () => (
  <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* About Section */}
      <div className="bg-blue-700 text-white p-8 rounded-lg shadow-lg">
        <h3 className="text-3xl font-bold mb-4">About Study Juche</h3>
        <p className="mb-6">
          Study Juche is a dedicated platform for providing high-quality, accessible educational materials on the Juche Idea. Our courses and articles are sourced from original texts and authoritative analyses to ensure authenticity and depth.
        </p>
        <Link to="/about" className="font-bold bg-white text-blue-700 py-2 px-4 rounded-md hover:bg-gray-200">
          Read More
        </Link>
      </div>
      {/* YouTube Section */}
      <div className="bg-red-700 text-white p-8 rounded-lg shadow-lg">
        <h3 className="text-3xl font-bold mb-4">StudyJuche on YouTube</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Placeholder Videos */}
          <div className="bg-gray-900 aspect-video rounded-md flex items-center justify-center"><span className="text-gray-400">Video 1</span></div>
          <div className="bg-gray-900 aspect-video rounded-md flex items-center justify-center"><span className="text-gray-400">Video 2</span></div>
          <div className="bg-gray-900 aspect-video rounded-md flex items-center justify-center"><span className="text-gray-400">Video 3</span></div>
          <div className="bg-gray-900 aspect-video rounded-md flex items-center justify-center"><span className="text-gray-400">Video 4</span></div>
        </div>
      </div>
    </div>
  </div>
);

const ExplanatoryText = () => (
  <div className="py-16 bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Study Juche?</h2>
      <p className="mb-4 text-lg">
        In an era of increasing global complexity and imperialist pressure, the Juche Idea offers a powerful framework for understanding and achieving genuine national sovereignty and socialist construction. Developed by President Kim Il Sung and further elaborated by Chairman Kim Jong Il, Juche provides a people-centric philosophical worldview that places the masses at the center of history and revolution.
      </p>
      <p className="text-lg">
        For modern socialists, studying Juche is not merely an academic exercise. It is a vital tool for developing revolutionary optimism, fostering self-reliance, and building a powerful, independent movement capable of navigating the challenges of the 21st century. Our courses break down these principles, providing a clear path from theory to practice.
      </p>
    </div>
  </div>
);

export const Home = () => (
  <div>
    <HeroBanner />
    <CoreCourses />
    <FeaturedContent />
    <ExplanatoryText />
  </div>
);
