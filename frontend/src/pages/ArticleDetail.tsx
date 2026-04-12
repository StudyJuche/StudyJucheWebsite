import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, GhostPost } from '../api/ghost';
import { UnknownPage } from './UnknownPage';

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
      <div className="pt-20 bg-site-tile bg-repeat bg-auto min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-800 mx-auto mt-20"></div>
      </div>
    );
  }

  if (error || !post) {
    return <UnknownPage />;
  }

  return (
    <div className="pt-20 bg-site-tile bg-repeat bg-auto min-h-screen">
      {post.feature_image && (
        <div 
          className="h-96 bg-cover bg-center" 
          style={{ backgroundImage: `url(${post.feature_image})` }}
        >
          <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="max-w-4xl text-center px-4">
              <Link to="/articles" className="text-white opacity-80 hover:opacity-100 text-sm font-bold uppercase tracking-wider">
                &larr; Back to Articles
              </Link>
              <h1 
                className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-wider text-white mt-4"
                style={{
                  WebkitTextStroke: '1px #B8860B',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.7)'
                }}
              >
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      )}
      
      <div className={`max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden ${post.feature_image ? '-mt-16' : 'mt-12'}`}>
        <div className="p-8 md:p-12">
          {!post.feature_image && (
            <div className="text-center mb-12">
              <Link to="/articles" className="text-gray-500 hover:text-red-800 text-sm font-bold uppercase tracking-wider">
                &larr; Back to Articles
              </Link>
              <h1 
                className="text-5xl font-serif font-bold uppercase tracking-wider mt-4"
                style={{
                  color: '#8B0000',
                  WebkitTextStroke: '1px #B8860B',
                }}
              >
                {post.title}
              </h1>
            </div>
          )}

          <div className="text-center text-gray-500 text-sm mb-8">
            Published on {new Date(post.published_at).toLocaleDateString()}
          </div>

          <div 
            className="prose prose-lg max-w-none text-gray-800 
              prose-headings:font-serif prose-headings:text-gray-900 prose-headings:font-bold 
              prose-a:text-red-600 hover:prose-a:text-red-800 
              prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.html || '' }} 
          />
        </div>
      </div>
    </div>
  );
};
