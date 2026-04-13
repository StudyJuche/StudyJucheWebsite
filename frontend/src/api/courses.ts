export interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: number;
  course_id: number;
  ghost_post_slug: string;
  order: number;
}

export interface CourseLessonCreate {
  ghost_post_slug: string;
  order: number;
}

export interface CourseProgress {
  total_lessons: number;
  completed_lessons: number;
  percent_complete: number;
  lesson_progress: {
    lesson_id: number;
    ghost_post_slug: string;
    is_completed: boolean;
    order: number;
  }[];
}

const API_BASE_URL = '/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Public - No Auth Needed
export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${API_BASE_URL}/courses`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
};

// Public - No Auth Needed
export const getCourseDetails = async (slug: string): Promise<{ course: Course; lessons: CourseLesson[] }> => {
  const res = await fetch(`${API_BASE_URL}/courses/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch course details");
  return res.json();
};

// --- Authenticated Functions ---

export const createCourse = async (courseData: { title: string; description: string; slug: string }, token: string): Promise<Course> => {
  const res = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(courseData),
  });
  if (!res.ok) throw new Error("Failed to create course");
  return res.json();
};

export const deleteCourse = async (courseId: number, token: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete course");
};

export const addLessonToCourse = async (courseId: number, lessonData: CourseLessonCreate, token: string): Promise<CourseLesson> => {
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(lessonData),
  });
  if (!res.ok) throw new Error("Failed to add lesson to course");
  return res.json();
};

export const deleteLesson = async (lessonId: number, token: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to delete lesson");
};

export const getCourseProgress = async (courseId: number, token: string): Promise<CourseProgress> => {
  const res = await fetch(`${API_BASE_URL}/progress/course/${courseId}`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch course progress");
  return res.json();
};

export const markLessonComplete = async (ghostPostSlug: string, token: string): Promise<{ is_completed: boolean }> => {
  const res = await fetch(`${API_BASE_URL}/progress/lesson/${ghostPostSlug}/complete`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to mark lesson complete");
  return res.json();
};
