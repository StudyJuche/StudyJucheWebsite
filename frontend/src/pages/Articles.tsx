import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, GhostPost } from '../api/ghost';

export const Articles = () => {
  const [posts, setPosts] = useState<GhostPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        setError('Failed to load articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No Articles Found</h2>
          <p className="text-gray-600">There are no articles available at the moment. Please check back soon.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link 
            to={`/articles/${post.slug}`} 
            key={post.id}
            className="group block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="relative">
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
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all"></div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors">
                {post.title}
              </h2>
              {post.excerpt && (
                  <p className="text-gray-700 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
              )}
              <div className="text-sm text-gray-500">
                  Published on {new Date(post.published_at).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-site-tile bg-repeat bg-auto"> {/* Add background class */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 
            className="text-5xl font-serif font-bold uppercase tracking-wider"
            style={{
              color: '#8B0000',
              WebkitTextStroke: '1px #B8860B',
            }}
          >
            Articles
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Insights and analysis on the Juche idea and contemporary issues.
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
