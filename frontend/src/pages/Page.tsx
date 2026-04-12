import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPageBySlug, GhostPost } from '../api/ghost';

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
        // Use the new getPageBySlug function
        const fetchedPage = await getPageBySlug(slug);
        if (fetchedPage) {
            setPage(fetchedPage);
        } else {
            // This will allow the catch-all route to render the 404 page
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
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
      </div>
    );
  }

  if (error || !page) {
    // We render a minimal error here, but the idea is the main router will catch this
    // and could redirect to a proper 404 page if the slug truly doesn't exist.
    return (
      <div className="p-8 flex flex-col items-center justify-center max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-red-600">404 - Not Found</h1>
        <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 text-red-800 hover:underline">
            &larr; Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md overflow-hidden">
      {page.feature_image && (
        <div className="w-full h-64 md:h-96 relative">
          <img 
            src={page.feature_image} 
            alt={page.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-8 md:p-12">
        <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-black mb-4" style={{ color: '#8B0000' }}>
                {page.title}
            </h1>
        </div>

        <div 
          className="prose prose-lg max-w-none text-gray-800 
            prose-headings:text-[#8B0000] prose-headings:font-bold 
            prose-a:text-red-600 hover:prose-a:text-red-800 
            prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: page.html || '' }} 
        />
      </div>
    </div>
  );
};
