import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, GhostPost } from '../api/ghost';

export const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        const fetchedPost = await getPostBySlug(slug);
        if (fetchedPost) {
            setPost(fetchedPost);
        } else {
            setError("Article not found");
        }
      } catch (err) {
        setError('Failed to load article.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-gray-600">{error || "Article not found."}</p>
        <Link to="/articles" className="mt-6 text-red-800 hover:underline">
            &larr; Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md overflow-hidden">
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
            <Link to="/articles" className="text-sm text-gray-500 hover:text-red-800 transition-colors mb-4 inline-block">
                &larr; Back to all articles
            </Link>
            <h1 className="text-3xl md:text-5xl font-black mb-4" style={{ color: '#8B0000' }}>
                {post.title}
            </h1>
            <div className="text-gray-500 text-sm flex items-center space-x-4">
                <span>Published {new Date(post.published_at).toLocaleDateString()}</span>
            </div>
        </div>

        {/* Content */}
        {/* We use dangerouslySetInnerHTML because Ghost returns pre-rendered HTML */}
        <div 
          className="prose prose-lg max-w-none text-gray-800 
            prose-headings:text-[#8B0000] prose-headings:font-bold 
            prose-a:text-red-600 hover:prose-a:text-red-800 
            prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: post.html }} 
        />
      </div>
    </div>
  );
};
