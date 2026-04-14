export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  html?: string; // Make optional as it's not always fetched
  feature_image?: string;
  excerpt?: string;
  published_at?: string; // Make optional as it's not always fetched
}

const GHOST_URL = import.meta.env.VITE_GHOST_URL || "https://ghost.study-juche.com";
const GHOST_CONTENT_KEY = import.meta.env.VITE_GHOST_CONTENT_KEY || "";

// Public API to fetch non-lesson posts
export const getPosts = async (): Promise<GhostPost[]> => {
  if (!GHOST_CONTENT_KEY) return [];
  try {
    const filter = "tag:-hash-lesson";
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_CONTENT_KEY}&include=tags,authors&filter=${filter}`
    );
    if (!res.ok) throw new Error("Failed to fetch posts");
    return (await res.json()).posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// Public API to fetch a single post or page
export const getPostBySlug = async (slug: string): Promise<GhostPost | null> => {
  if (!GHOST_CONTENT_KEY) return null;
  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/slug/${slug}/?key=${GHOST_CONTENT_KEY}&include=tags,authors`
    );
    if (!res.ok) throw new Error("Failed to fetch post");
    return (await res.json()).posts[0] || null;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
};

export const getPageBySlug = async (slug: string): Promise<GhostPost | null> => {
  if (!GHOST_CONTENT_KEY) return null;
  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/pages/slug/${slug}/?key=${GHOST_CONTENT_KEY}&include=tags,authors`
    );
    if (!res.ok) throw new Error("Failed to fetch page");
    return (await res.json()).pages[0] || null;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
};

// Authenticated API to fetch lesson-tagged posts from our backend proxy
export const getGhostPosts = async (token: string): Promise<GhostPost[]> => {
  const API_BASE_URL = '/api';
  try {
    const res = await fetch(`${API_BASE_URL}/ghost/posts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch Ghost posts from backend proxy");
    return await res.json();
  } catch (error) {
    console.error("Error fetching Ghost posts for admin:", error);
    return [];
  }
};
