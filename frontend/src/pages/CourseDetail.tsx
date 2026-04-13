import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetails, getCourseProgress, Course, CourseLesson, CourseProgress } from '../api/courses';
import { getPostBySlug, GhostPost } from '../api/ghost';
import { useAuth } from '../context/AuthContext';
import { UnknownPage } from './UnknownPage';

interface EnrichedLesson extends CourseLesson {
  ghostPost?: GhostPost;
  is_completed?: boolean;
}

export const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { token, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<EnrichedLesson[]>([]);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effect 1: Fetch the public course and lesson data
  useEffect(() => {
    const fetchBaseCourseData = async () => {
      if (!slug) {
        setError("Course slug not found in URL.");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getCourseDetails(slug);
        if (!data || !data.course) {
          throw new Error("Course not found from API.");
        }
        setCourse(data.course);

        const enrichedLessons = await Promise.all(
          data.lessons.map(async (lesson) => {
            const ghostPost = await getPostBySlug(lesson.ghost_post_slug);
            return {
              ...lesson,
              ghostPost: ghostPost || undefined,
              is_completed: false, // Default to false
            };
          })
        );
        setLessons(enrichedLessons);

      } catch (err: any) {
        console.error("Error fetching base course data:", err);
        setError(err.message || 'Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBaseCourseData();
  }, [slug]);

  // Effect 2: Fetch user-specific progress once the course and user are known
  useEffect(() => {
    const fetchProgress = async () => {
      if (isAuthenticated && token && course) {
        try {
          const progressData = await getCourseProgress(course.id, token);
          
          if (progressData && progressData.lesson_progress) {
            setProgress(progressData);
            const progressMap = new Map(progressData.lesson_progress.map(p => [p.ghost_post_slug, p.is_completed]));
            setLessons(currentLessons => 
              currentLessons.map(lesson => ({
                ...lesson,
                is_completed: progressMap.get(lesson.ghost_post_slug) || false,
              }))
            );
          }

        } catch (err) {
          console.error("Failed to fetch user progress:", err);
        }
      }
    };

    fetchProgress();
  }, [course, token, isAuthenticated]);

  if (loading) {
    return (
      <div className="pt-20 bg-site-tile bg-repeat bg-auto min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-800 mx-auto mt-20"></div>
      </div>
    );
  }

  if (error || !course) {
    return <UnknownPage />;
  }

  return (
    <div className="min-h-screen pt-20 bg-site-tile bg-repeat bg-auto">
      <div className="max-w-4xl mx-auto mt-12 p-8 md:p-12 bg-white rounded-lg shadow-lg">
          <div className="mb-10 pb-8 border-b border-gray-200">
              <Link to="/courses" className="text-sm text-gray-500 hover:text-red-800 transition-colors mb-4 inline-block">
                  &larr; Back to all courses
              </Link>
              <h1 
                className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-wider"
                style={{ color: '#8B0000', WebkitTextStroke: '1px #B8860B' }}
              >
                  {course.title}
              </h1>
              <p className="text-xl text-gray-600 mt-4">
                  {course.description}
              </p>
              
              {isAuthenticated && progress && progress.total_lessons > 0 && (
                  <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-700">Course Progress</span>
                          <span className="text-red-800 font-bold">{Math.round(progress.percent_complete)}%</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                          <div 
                              className="bg-red-800 h-3 rounded-full transition-all duration-500 ease-out" 
                              style={{ width: `${progress.percent_complete}%` }}
                          ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                          {progress.completed_lessons} of {progress.total_lessons} lessons completed
                      </div>
                  </div>
              )}
          </div>

          <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Syllabus</h2>
              <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                      <Link 
                          to={`/courses/${slug}/${lesson.ghost_post_slug}`}
                          key={lesson.id}
                          className={`block p-6 border rounded-lg hover:shadow-md transition-shadow duration-200
                              ${lesson.is_completed ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-red-300'}
                          `}
                      >
                          <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold
                                      ${lesson.is_completed ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}
                                  `}>
                                      {index + 1}
                                  </div>
                                  <div>
                                      <h3 className={`text-lg font-semibold ${lesson.is_completed ? 'text-green-900' : 'text-gray-900'}`}>
                                          {lesson.ghostPost ? lesson.ghostPost.title : "Loading lesson title..."}
                                      </h3>
                                  </div>
                              </div>
                              
                              <div className="flex-shrink-0 ml-4">
                                  {lesson.is_completed ? (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                          <svg className="-ml-1 mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                          Completed
                                      </span>
                                  ) : (
                                      <span className="text-red-800 text-sm font-medium">Start &rarr;</span>
                                  )}
                              </div>
                          </div>
                      </Link>
                  ))}
                  
                  {lessons.length === 0 && (
                      <p className="text-gray-500 italic">No lessons have been added to this course yet.</p>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};
