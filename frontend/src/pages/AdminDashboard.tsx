import React, { useState, useEffect, useRef } from 'react';
import { getCourses, createCourse, addLessonToCourse, deleteCourse, deleteLesson, Course } from '../api/courses';
import { getGhostPosts } from '../api/ghost';
import { Notification } from '../components/Notification';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { useAuth } from '../context/AuthContext';

// Define the User type directly in the file
export interface User {
  id: number;
  username: string;
  email: string;
  is_verified: boolean;
  role: 'admin' | 'moderator' | 'student';
}

const CourseManager = ({ course, ghostPosts, onDataChange, setNotification, token }: { course: Course, ghostPosts: any[], onDataChange: () => void, setNotification: (notification: { message: string, type: 'success' | 'error' } | null) => void, token: string }) => {
  const [selectedGhostPostSlug, setSelectedGhostPostSlug] = useState('');
  const [newLessonOrder, setNewLessonOrder] = useState('');
  const [addingLesson, setAddingLesson] = useState(false);
  const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGhostPostSlug || !newLessonOrder) {
      setNotification({ message: 'Please select a Ghost post and provide an order.', type: 'error' });
      return;
    }
    setAddingLesson(true);
    try {
      await addLessonToCourse(course.id, { ghost_post_slug: selectedGhostPostSlug, order: parseInt(newLessonOrder) }, token);
      setSelectedGhostPostSlug('');
      setNewLessonOrder('');
      onDataChange();
      setNotification({ message: 'Lesson added successfully!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Failed to add lesson.', type: 'error' });
    } finally {
      setAddingLesson(false);
    }
  };

  const requestDeleteLesson = (lessonId: number) => {
    setConfirmation({
      title: 'Delete Lesson',
      message: 'Are you sure you want to delete this lesson?',
      onConfirm: () => handleDeleteLesson(lessonId),
    });
  };

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await deleteLesson(lessonId, token);
      onDataChange();
      setNotification({ message: 'Lesson deleted successfully!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Failed to delete lesson.', type: 'error' });
    } finally {
      setConfirmation(null);
    }
  };

  const requestDeleteCourse = () => {
    setConfirmation({
      title: 'Delete Course',
      message: 'Are you sure you want to delete this course and all its lessons? This action cannot be undone.',
      onConfirm: handleDeleteCourse,
    });
  };

  const handleDeleteCourse = async () => {
    try {
      await deleteCourse(course.id, token);
      onDataChange();
      setNotification({ message: 'Course deleted successfully!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Failed to delete course.', type: 'error' });
    } finally {
      setConfirmation(null);
    }
  };

  return (
    <>
      {confirmation && (
        <ConfirmationDialog
          show={!!confirmation}
          title={confirmation.title}
          message={confirmation.message}
          onConfirm={confirmation.onConfirm}
          onCancel={() => setConfirmation(null)}
        />
      )}
      <details className="group border rounded-lg overflow-hidden mb-4 bg-white shadow">
        <summary className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div>
            <h3 className="text-xl font-bold text-red-800">{course.title}</h3>
            <p className="text-sm text-gray-600">{course.description}</p>
          </div>
          <span className="transform transition-transform duration-200 group-open:rotate-90">&#9656;</span>
        </summary>
        <div className="p-6 border-t">
          <h4 className="text-lg font-semibold mb-4">Lessons</h4>
          <ul className="space-y-2 mb-6">
            {course.lessons.sort((a, b) => a.order - b.order).map(lesson => (
              <li key={lesson.id} className="flex justify-between items-center p-2 rounded-md bg-gray-100">
                <span>Order {lesson.order}: {lesson.ghost_post_slug}</span>
                <button onClick={() => requestDeleteLesson(lesson.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">DELETE</button>
              </li>
            ))}
            {course.lessons.length === 0 && <p className="text-gray-500 italic">No lessons yet.</p>}
          </ul>
          <form onSubmit={handleAddLesson} className="space-y-3 border-t pt-4">
            <h5 className="font-semibold">Add New Lesson</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor={`select-ghost-post-${course.id}`} className="block text-sm font-medium text-gray-700">Select Ghost Post</label>
                  <a href={`${import.meta.env.VITE_GHOST_URL || "https://ghost.study-juche.com"}/ghost/posts`} target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 hover:underline">
                    Create New?
                  </a>
                </div>
                <select id={`select-ghost-post-${course.id}`} value={selectedGhostPostSlug} onChange={e => setSelectedGhostPostSlug(e.target.value)} className="w-full p-2 border rounded-md" required>
                  <option value="">-- Select a Lesson --</option>
                  {ghostPosts.map(post => (
                    <option key={post.id} value={post.slug}>
                      {post.title} ({post.slug})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`lesson-order-${course.id}`} className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input id={`lesson-order-${course.id}`} type="number" value={newLessonOrder} onChange={e => setNewLessonOrder(e.target.value)} placeholder="Order" className="w-full p-2 border rounded-md" required />
              </div>
              <div className="self-end">
                <button type="submit" disabled={addingLesson} className="w-full bg-red-800 text-white p-2 rounded-md hover:bg-red-900 disabled:bg-gray-400">
                  {addingLesson ? 'Adding...' : 'Add Lesson'}
                </button>
              </div>
            </div>
          </form>
          <div className="mt-6 border-t pt-4 text-right">
             <button onClick={requestDeleteCourse} className="bg-red-700 text-white font-semibold text-sm py-2 px-4 rounded-md hover:bg-red-800">
                Delete This Course
             </button>
          </div>
        </div>
      </details>
    </>
  );
};

export const AdminDashboard = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [ghostPosts, setGhostPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseSlug, setNewCourseSlug] = useState('');
  const [newCourseFile, setNewCourseFile] = useState<File | null>(null);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAllData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [fetchedCourses, fetchedGhostPosts] = await Promise.all([
        getCourses(),
        getGhostPosts(token)
      ]);
      setCourses(fetchedCourses);
      setGhostPosts(fetchedGhostPosts);
    } catch (err) {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCourseFile(e.target.files[0]);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newCourseFile) {
      setNotification({ message: 'Please fill out all fields and select an image.', type: 'error' });
      return;
    }

    setCreatingCourse(true);
    const formData = new FormData();
    formData.append('title', newCourseTitle);
    formData.append('description', newCourseDescription);
    formData.append('slug', newCourseSlug);
    formData.append('file', newCourseFile);

    try {
      await createCourse(formData, token);
      
      setNewCourseTitle('');
      setNewCourseDescription('');
      setNewCourseSlug('');
      setNewCourseFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";

      fetchAllData();
      setNotification({ message: 'Course created successfully!', type: 'success' });
    } catch (err: any) {
      setNotification({ message: err.message || 'Failed to create course.', type: 'error' });
    } finally {
      setCreatingCourse(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: '#8B0000' }}>Admin Dashboard</h1>
      
      <div className="mb-12 p-6 border rounded-lg bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <input type="text" value={newCourseTitle} onChange={e => setNewCourseTitle(e.target.value)} placeholder="Course Title" className="w-full p-2 border rounded-md" required />
          <textarea value={newCourseDescription} onChange={e => setNewCourseDescription(e.target.value)} placeholder="Course Description" className="w-full p-2 border rounded-md" required />
          <input type="text" value={newCourseSlug} onChange={e => setNewCourseSlug(e.target.value)} placeholder="Course Slug (e.g., my-new-course)" className="w-full p-2 border rounded-md" required />
          <div>
            <label htmlFor="course-image" className="block text-sm font-medium text-gray-700 mb-1">Feature Image</label>
            <input id="course-image" ref={fileInputRef} type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" required />
          </div>
          <button type="submit" disabled={creatingCourse} className="w-full bg-red-800 text-white p-3 rounded-md font-semibold hover:bg-red-900 disabled:bg-gray-400">
            {creatingCourse ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Manage Existing Courses</h2>
        {courses.map(course => (
          <CourseManager key={course.id} course={course} ghostPosts={ghostPosts} onDataChange={fetchAllData} setNotification={setNotification} token={token || ''} />
        ))}
      </div>
    </div>
  );
};
