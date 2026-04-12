import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug, GhostPost } from '../api/ghost';
import { UnknownPage } from './UnknownPage';

export const Page = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      setPage(null);

      try {
        const fetchedPage = await getPageBySlug(slug);
        if (fetchedPage) {
            setPage(fetchedPage);
        } else {
            setError("Page not found"); 
        }
      } catch (err) {
        setError('Failed to load page content.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20"> {/* Add padding for sticky header */}
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-800 mx-auto mt-20"></div>
      </div>
    );
  }

  if (error || !page) {
    return <UnknownPage />;
  }

  return (
    <div className="pt-20"> {/* Add padding for sticky header */}
      {page.feature_image && (
        <div 
          className="h-96 bg-cover bg-center" 
          style={{ backgroundImage: `url(${page.feature_image})` }}
        >
          <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
            <h1 
              className="text-5xl font-serif font-bold uppercase tracking-wider text-white text-center"
              style={{
                WebkitTextStroke: '1px #B8860B',
                textShadow: '3px 3px 6px rgba(0,0,0,0.7)'
              }}
            >
              {page.title}
            </h1>
          </div>
        </div>
      )}

      <div className={`max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden ${page.feature_image ? '-mt-16' : 'mt-12'}`}>
        <div className="p-8 md:p-12">
          {!page.feature_image && (
            <div className="text-center mb-12">
              <h1 
                className="text-5xl font-serif font-bold uppercase tracking-wider"
                style={{
                  color: '#8B0000',
                  WebkitTextStroke: '1px #B8860B',
                }}
              >
                {page.title}
              </h1>
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none text-gray-800 
              prose-headings:font-serif prose-headings:text-gray-900 prose-headings:font-bold
              prose-a:text-red-600 hover:prose-a:text-red-800 
              prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: page.html || '' }} 
          />
        </div>
      </div>
    </div>
  );
};
