import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCourses, getAllCoursesWithProgress, Course } from '../api/courses';
import { useAuth } from '../context/AuthContext';

export const Courses = () => {
  const { isAuthenticated, token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let fetchedCourses;
        if (isAuthenticated && token) {
          fetchedCourses = await getAllCoursesWithProgress(token);
        } else {
          fetchedCourses = await getCourses();
        }
        setCourses(fetchedCourses);
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isAuthenticated, token]);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div></div>;
    }
    if (error) {
      return <div className="text-center py-20 text-red-600"><h2>Error</h2><p>{error}</p></div>;
    }
    if (courses.length === 0) {
      return <div className="text-center py-20"><h2>No Courses Found</h2><p>No courses are currently available. Please check back soon.</p></div>;
    }

    return (
      <div className="space-y-12">
        {courses.map((course) => {
          const isCompleted = course.progress?.is_completed; // Use the new is_completed flag
          return (
            <div 
              key={course.id} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row relative ${isCompleted ? 'border-2 border-green-500' : ''}`}
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 mt-4 mr-4 bg-green-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                  Completed
                </div>
              )}
              <div className="md:w-1/3">
                <img src={course.feature_image_url} alt={course.title} className="w-full h-48 md:h-full object-cover" />
              </div>
              <div className="md:w-2/3 p-8 flex flex-col">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h2>
                <p className="text-gray-700 text-lg mb-6">{course.description}</p>
                
                {course.progress && course.progress.total_lessons > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Your Progress</span>
                      <span className="text-sm font-medium text-red-800">{Math.round(course.progress.percent_complete)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-700 h-2.5 rounded-full" style={{ width: `${course.progress.percent_complete}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="mt-auto">
                  <Link 
                    to={`/courses/${course.slug}`} 
                    className={`inline-block font-bold py-3 px-6 rounded-lg text-md transition-colors ${
                      isCompleted 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-red-700 hover:bg-red-800 text-white'
                    }`}
                  >
                    {isCompleted ? 'Revise Curriculum' : 'View Curriculum'}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-site-tile bg-repeat bg-auto">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-bold uppercase tracking-wider" style={{ color: '#8B0000', WebkitTextStroke: '1px #B8860B' }}>
            Available Courses
          </h1>
          <p className="mt-4 text-xl text-gray-600">Structured learning paths to master the Juche Idea.</p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
