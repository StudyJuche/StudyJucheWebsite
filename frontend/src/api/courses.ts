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

const API_BASE_URL = '/api'; // Use relative path, Caddy will proxy to backend

export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${API_BASE_URL}/courses`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
};

export const createCourse = async (courseData: { title: string; description: string; slug: string }): Promise<Course> => {
  const res = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(courseData),
  });
  if (!res.ok) throw new Error("Failed to create course");
  return res.json();
};

export const deleteCourse = async (courseId: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Failed to delete course");
};

export const getCourseDetails = async (slug: string): Promise<{ course: Course; lessons: CourseLesson[] }> => {
  const res = await fetch(`${API_BASE_URL}/courses/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch course details");
  return res.json();
};

export const addLessonToCourse = async (courseId: number, lessonData: CourseLessonCreate): Promise<CourseLesson> => {
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lessonData),
  });
  if (!res.ok) throw new Error("Failed to add lesson to course");
  return res.json();
};

export const deleteLesson = async (lessonId: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Failed to delete lesson");
};

export const getCourseProgress = async (courseId: number): Promise<CourseProgress> => {
  const res = await fetch(`${API_BASE_URL}/progress/course/${courseId}`);
  if (!res.ok) throw new Error("Failed to fetch course progress");
  return res.json();
};

export const markLessonComplete = async (ghostPostSlug: string): Promise<{ is_completed: boolean }> => {
  const res = await fetch(`${API_BASE_URL}/progress/lesson/${ghostPostSlug}/complete`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error("Failed to mark lesson complete");
  return res.json();
};
