export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  html: string;
  feature_image?: string;
  excerpt?: string;
  published_at: string;
}

// These values will be filled in later once Ghost is set up
const GHOST_URL = import.meta.env.VITE_GHOST_URL || "http://localhost:2368";
const GHOST_CONTENT_KEY = import.meta.env.VITE_GHOST_CONTENT_KEY || "";

export const getPosts = async (): Promise<GhostPost[]> => {
  if (!GHOST_CONTENT_KEY) {
      console.warn("Ghost Content API Key is missing.");
      return [];
  }
  
  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_CONTENT_KEY}&include=tags,authors`
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
