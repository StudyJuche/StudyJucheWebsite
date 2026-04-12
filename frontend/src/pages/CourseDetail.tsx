import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetails, getCourseProgress, Course, CourseLesson, CourseProgress } from '../api/courses';
import { getPostBySlug, GhostPost } from '../api/ghost';

interface EnrichedLesson extends CourseLesson {
  ghostPost?: GhostPost;
  is_completed?: boolean;
}

export const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<EnrichedLesson[]>([]);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        // 1. Fetch course details and raw lesson list from our backend
        const data = await getCourseDetails(slug);
        setCourse(data.course);
        
        // 2. Fetch user progress for this course
        const progressData = await getCourseProgress(data.course.id);
        setProgress(progressData);

        // 3. Map progress data for easy lookup
        const progressMap = new Map(
            progressData.lesson_progress.map(p => [p.ghost_post_slug, p.is_completed])
        );

        // 4. Fetch Ghost content for each lesson slug
        const enrichedLessons = await Promise.all(
          data.lessons.map(async (lesson) => {
            const ghostPost = await getPostBySlug(lesson.ghost_post_slug);
            return {
              ...lesson,
              ghostPost: ghostPost || undefined,
              is_completed: progressMap.get(lesson.ghost_post_slug) || false
            };
          })
        );
        
        setLessons(enrichedLessons);
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600">{error || "Course not found."}</p>
        <Link to="/courses" className="mt-6 text-red-800 hover:underline">
            &larr; Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 md:p-12 bg-white rounded-lg shadow-md">
        <div className="mb-10 pb-8 border-b border-gray-200">
            <Link to="/courses" className="text-sm text-gray-500 hover:text-red-800 transition-colors mb-4 inline-block">
                &larr; Back to all courses
            </Link>
            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: '#8B0000' }}>
                {course.title}
            </h1>
            <p className="text-xl text-gray-600">
                {course.description}
            </p>
            
            {progress && progress.total_lessons > 0 && (
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
                        to={`/courses/${course.slug}/${lesson.ghost_post_slug}`}
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
                                    {lesson.ghostPost && lesson.ghostPost.excerpt && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                            {lesson.ghostPost.excerpt}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-shrink-0 ml-4">
                                {lesson.is_completed ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        <svg className="-ml-1 mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
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
  );
};
