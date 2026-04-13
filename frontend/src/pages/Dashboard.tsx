import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOverallProgress, OverallProgress } from '../api/user';
import { getAllCoursesWithProgress, Course } from '../api/courses';

const OverallProgressCircle = ({ percentage }: { percentage: number }) => {
  const sqSize = 160;
  const strokeWidth = 12;
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg width={sqSize} height={sqSize} viewBox={viewBox}>
        <circle className="text-gray-200" strokeWidth={strokeWidth} stroke="currentColor" fill="none" cx={sqSize / 2} cy={sqSize / 2} r={radius} />
        <circle
          className="text-red-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="none"
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeLinecap="round"
          style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{Math.round(percentage)}%</span>
        <span className="text-sm text-gray-500">Complete</span>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [overallProgress, setOverallProgress] = useState<OverallProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const [coursesData, progressData] = await Promise.all([
          getAllCoursesWithProgress(token),
          getOverallProgress(token)
        ]);
        setCourses(coursesData);
        setOverallProgress(progressData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  const inProgressCourses = courses.filter(c => c.progress && c.progress.percent_complete > 0 && c.progress.percent_complete < 100);
  const completedCourses = courses.filter(c => c.progress && c.progress.percent_complete === 100);

  if (loading) {
    return <div className="p-8 text-center pt-20">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
          <Link to="/courses" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 mt-3 sm:mt-0">
            Browse All Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Learning</h2>
              {inProgressCourses.length > 0 ? (
                inProgressCourses.map(course => (
                  <div key={course.id} className="bg-gray-50 rounded-lg shadow overflow-hidden flex flex-col md:flex-row">
                    <img src={course.feature_image_url} alt={course.title} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
                    <div className="p-6 flex flex-col justify-center">
                      <h3 className="font-bold text-xl mb-2">{course.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      <Link to={`/courses/${course.slug}`} className="inline-block mt-2 bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-md hover:bg-red-200 self-start">
                        Jump Back In
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600">You haven't started any courses yet. Why not start one now?</p>
                </div>
              )}
            </div>
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Completed Courses</h2>
              {completedCourses.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {completedCourses.map(course => (
                      <Link to={`/courses/${course.slug}`} key={course.id} className="bg-green-50 border-2 border-green-600 p-4 rounded-lg flex items-center space-x-4 hover:shadow-md">
                        <img src={course.feature_image_url} alt="" className="w-16 h-16 rounded-md object-cover"/>
                        <div>
                          <h3 className="font-bold text-green-800">{course.title}</h3>
                          <p className="text-sm text-green-700">Revise Curriculum</p>
                        </div>
                      </Link>
                    ))}
                 </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg shadow text-center">
                  <p className="text-gray-600">You haven't completed any courses yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg flex flex-col items-center">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Overall Progress</h2>
              {overallProgress && (
                <>
                  <OverallProgressCircle percentage={overallProgress.percentage} />
                  <p className="mt-4 text-center text-gray-600">You've completed {overallProgress.completed} of {overallProgress.total} total lessons.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
