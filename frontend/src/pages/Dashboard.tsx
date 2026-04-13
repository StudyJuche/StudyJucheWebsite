import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourses, getCourseProgress, Course, CourseProgress } from '../api/courses';

interface CourseWithProgress extends Course {
  progress?: CourseProgress;
}

export const Dashboard = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const fetchedCourses = await getCourses();
        
        const coursesWithProgress = await Promise.all(
          fetchedCourses.map(async (course) => {
            try {
              const progress = await getCourseProgress(course.id, token);
              return { ...course, progress };
            } catch (e) {
              return { ...course, progress: undefined };
            }
          })
        );
        
        setCourses(coursesWithProgress);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const totalLessonsCompleted = courses.reduce((acc, course) => acc + (course.progress?.completed_lessons || 0), 0);
  const totalCoursesStarted = courses.filter(c => c.progress && c.progress.completed_lessons > 0).length;
  const totalCoursesCompleted = courses.filter(c => c.progress && c.progress.percent_complete === 100).length;

  if (loading) {
    return <div className="p-8 text-center pt-20">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800"
            >
              Browse All Courses
            </Link>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Progress Summary</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Courses Started</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalCoursesStarted}</dd>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Lessons Completed</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalLessonsCompleted}</dd>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Courses Completed</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalCoursesCompleted}</dd>
              </div>
            </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Learning</h2>
            <div className="space-y-6">
              {courses.filter(c => c.progress && c.progress.percent_complete < 100 && c.progress.completed_lessons > 0).length > 0 ? (
                courses.filter(c => c.progress && c.progress.percent_complete < 100 && c.progress.completed_lessons > 0).map(course => (
                  <div key={course.id} className="bg-gray-50 p-6 rounded-lg shadow">
                    <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-red-700 h-2.5 rounded-full" style={{ width: `${course.progress?.percent_complete || 0}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{course.progress?.completed_lessons} of {course.progress?.total_lessons} lessons</span>
                      <span>{Math.round(course.progress?.percent_complete || 0)}%</span>
                    </div>
                    <Link to={`/courses/${course.slug}`} className="inline-block mt-4 bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-md hover:bg-red-200">
                      Continue Course
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600">You haven't started any courses yet. Why not start one now?</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
