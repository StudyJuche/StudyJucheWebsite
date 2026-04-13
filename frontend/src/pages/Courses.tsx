import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, Course } from '../api/courses';

export const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    if (courses.length === 0) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No Courses Found</h2>
          <p className="text-gray-600">No courses are currently available. Please check back soon.</p>
        </div>
      );
    }

    return (
      <div className="space-y-12">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img src={course.feature_image_url} alt={course.title} className="w-full h-48 md:h-full object-cover" />
            </div>
            <div className="md:w-2/3 p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h2>
              <p className="text-gray-700 text-lg mb-6">{course.description}</p>
              <div className="mt-auto">
                <Link 
                  to={`/courses/${course.slug}`} 
                  className="inline-block bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg text-md transition-colors"
                >
                  View Curriculum
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-site-tile bg-repeat bg-auto">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-serif font-bold uppercase tracking-wider"
            style={{
              color: '#8B0000',
              WebkitTextStroke: '1px #B8860B',
            }}
          >
            Available Courses
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Structured learning paths to master the Juche Idea.
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
