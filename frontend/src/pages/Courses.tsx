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

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
     return (
        <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Courses</h1>
            <p className="text-gray-600">No courses are currently available. Check back soon!</p>
        </div>
     );
  }

  return (
    <div className="p-8 flex flex-col max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#8B0000' }}>Courses</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <Link 
            to={`/courses/${course.slug}`} 
            key={course.id}
            className="group block border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-red-800"
          >
            <h2 className="text-2xl font-bold mb-2 group-hover:text-red-800 transition-colors">
              {course.title}
            </h2>
            <p className="text-gray-600">
              {course.description}
            </p>
            <div className="mt-4 text-sm font-semibold text-red-800 flex items-center">
                View Curriculum &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
