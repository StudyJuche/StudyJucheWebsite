import { Course } from './courses';

export interface OverallProgress {
  total: number;
  completed: number;
  percentage: number;
}

const API_BASE_URL = '/api/users/me';

const getAuthHeaders = (token: string) => ({
  'Authorization': `Bearer ${token}`,
});

export const getContinueLearningCourse = async (token: string): Promise<Course | null> => {
  const res = await fetch(`${API_BASE_URL}/continue-learning`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    // It's okay if this fails (e.g., 404), it just means no course to continue
    if (res.status === 404) return null;
    throw new Error("Failed to fetch continue learning course");
  }
  // Handle cases where the backend returns an empty body for no-op
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const getOverallProgress = async (token: string): Promise<OverallProgress> => {
  const res = await fetch(`${API_BASE_URL}/overall-progress`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch overall progress");
  return res.json();
};
