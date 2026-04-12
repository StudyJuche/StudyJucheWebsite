export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  html?: string; // Make optional as it's not always fetched
  feature_image?: string;
  excerpt?: string;
  published_at?: string; // Make optional as it's not always fetched
}

// These values will be filled in later once Ghost is set up
const GHOST_URL = import.meta.env.VITE_GHOST_URL || "http://localhost:2368";
const GHOST_CONTENT_KEY = import.meta.env.VITE_GHOST_CONTENT_KEY || "";

// Frontend API to fetch posts directly from Ghost (for public-facing Articles page)
export const getPosts = async (): Promise<GhostPost[]> => {
  if (!GHOST_CONTENT_KEY) {
      console.warn("Ghost Content API Key is missing.");
      return [];
  }
  
  try {
    // Filter for posts that DO NOT have the internal #lesson tag
    const filter = "tag:-hash-lesson";
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_CONTENT_KEY}&include=tags,authors&filter=${filter}`
    );
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    return data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const getPostBySlug = async (slug: string): Promise<GhostPost | null> => {
  if (!GHOST_CONTENT_KEY) {
      console.warn("Ghost Content API Key is missing.");
      return null;
  }

  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/slug/${slug}/?key=${GHOST_CONTENT_KEY}&include=tags,authors`
    );
    if (!res.ok) throw new Error("Failed to fetch post");
    const data = await res.json();
    return data.posts[0] || null;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
};

export const getPageBySlug = async (slug: string): Promise<GhostPost | null> => {
  if (!GHOST_CONTENT_KEY) {
      console.warn("Ghost Content API Key is missing.");
      return null;
  }

  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/pages/slug/${slug}/?key=${GHOST_CONTENT_KEY}&include=tags,authors`
    );
    if (!res.ok) throw new Error("Failed to fetch page");
    const data = await res.json();
    return data.pages[0] || null;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
};

// Frontend API to fetch posts from our backend proxy (for Admin Dashboard)
export const getGhostPosts = async (): Promise<GhostPost[]> => {
  const API_BASE_URL = '/api'; // Use relative path, Caddy will proxy to backend
  try {
    const res = await fetch(`${API_BASE_URL}/ghost/posts`);
    if (!res.ok) throw new Error("Failed to fetch Ghost posts from backend proxy");
    const data = await res.json();
    return data; // Backend already returns the array of posts
  } catch (error) {
    console.error("Error fetching Ghost posts for admin:", error);
    return [];
  }
};
