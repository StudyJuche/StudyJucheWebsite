import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseDetails, markLessonComplete, Course, CourseLesson } from '../api/courses';
import { getPostBySlug, GhostPost } from '../api/ghost';

export const CourseLessonDetail = () => {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string, lessonSlug: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [post, setPost] = useState<GhostPost | null>(null);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingComplete, setMarkingComplete] = useState(false);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!courseSlug || !lessonSlug) return;
      
      try {
        setLoading(true);
        // Fetch course structure
        const courseData = await getCourseDetails(courseSlug);
        setCourse(courseData.course);
        setLessons(courseData.lessons);
        
        // Fetch specific lesson content
        const fetchedPost = await getPostBySlug(lessonSlug);
        if (fetchedPost) {
            setPost(fetchedPost);
        } else {
            setError("Lesson content not found");
        }
      } catch (err) {
        setError('Failed to load lesson.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [courseSlug, lessonSlug]);

  const handleMarkComplete = async () => {
      if (!lessonSlug) return;
      
      try {
          setMarkingComplete(true);
          await markLessonComplete(lessonSlug);
          
          // Find next lesson to navigate to
          const currentIndex = lessons.findIndex(l => l.ghost_post_slug === lessonSlug);
          if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
              const nextLesson = lessons[currentIndex + 1];
              navigate(`/courses/${courseSlug}/${nextLesson.ghost_post_slug}`);
          } else {
              // Last lesson, go back to course overview
              navigate(`/courses/${courseSlug}`);
          }
      } catch (err) {
          console.error("Failed to mark complete", err);
          alert("Failed to save progress. Please try again.");
      } finally {
          setMarkingComplete(false);
      }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error || !post || !course) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600">{error || "Lesson not found."}</p>
        <Link to={`/courses/${courseSlug}`} className="mt-6 text-red-800 hover:underline">
            &larr; Back to Course
        </Link>
      </div>
    );
  }

  // Calculate position in course
  const currentIndex = lessons.findIndex(l => l.ghost_post_slug === lessonSlug);
  const isLastLesson = currentIndex === lessons.length - 1;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md overflow-hidden mb-20">
      {/* Hero Image */}
      {post.feature_image && (
        <div className="w-full h-64 md:h-96 relative">
          <img 
            src={post.feature_image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Link to="/courses" className="hover:text-red-800 transition-colors">Courses</Link>
                <span>/</span>
                <Link to={`/courses/${course.slug}`} className="hover:text-red-800 transition-colors font-medium text-gray-700">{course.title}</Link>
                <span>/</span>
                <span>Lesson {currentIndex + 1}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black mb-4" style={{ color: '#8B0000' }}>
                {post.title}
            </h1>
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none text-gray-800 
            prose-headings:text-[#8B0000] prose-headings:font-bold 
            prose-a:text-red-600 hover:prose-a:text-red-800 
            prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.html }} 
        />
        
        {/* Completion Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
            <Link to={`/courses/${course.slug}`} className="text-gray-600 hover:text-red-800 font-medium mb-4 sm:mb-0">
                &larr; Back to Syllabus
            </Link>
            
            <button 
                onClick={handleMarkComplete}
                disabled={markingComplete}
                className={`px-8 py-3 rounded-lg font-bold text-white shadow-md transition-all
                    ${markingComplete ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'}
                `}
            >
                {markingComplete ? 'Saving...' : (isLastLesson ? 'Finish Course \u2713' : 'Mark Complete & Continue \u2192')}
            </button>
        </div>
      </div>
    </div>
  );
};
