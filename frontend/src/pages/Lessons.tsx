import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, GhostPost } from '../api/ghost';

export const Lessons = () => {
  const [posts, setPosts] = useState<GhostPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError('Failed to load lessons.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
     return (
        <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Lessons</h1>
            <p className="text-gray-600">No lessons are currently available. Check back soon!</p>
        </div>
     );
  }

  return (
    <div className="p-8 flex flex-col max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: '#8B0000' }}>Lessons</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link 
            to={`/lessons/${post.slug}`} 
            key={post.id}
            className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {post.feature_image ? (
                <img 
                  src={post.feature_image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2 group-hover:text-red-800 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                  <p className="text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
              )}
              <div className="mt-4 text-sm text-gray-500">
                  {new Date(post.published_at).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
