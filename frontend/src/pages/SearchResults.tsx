import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

interface SearchResult {
  title: string;
  url: string;
  description: string;
}

interface SearchResultsData {
  courses: SearchResult[];
  articles: SearchResult[];
  pages: SearchResult[];
}

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState<SearchResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
        if (!res.ok) {
          throw new Error('Failed to fetch search results.');
        }
        const data = await res.json();
        setResults(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const ResultSection = ({ title, items }: { title: string, items: SearchResult[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">{title}</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <Link to={item.url} key={index} className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg">
              <h3 className="text-xl font-semibold text-red-700">{item.title}</h3>
              <p className="text-gray-600 line-clamp-2">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-20">Searching...</div>;
    }
    if (error) {
      return <div className="text-center py-20 text-red-600">Error: {error}</div>;
    }
    if (!results || (results.courses.length === 0 && results.articles.length === 0 && results.pages.length === 0)) {
      return <div className="text-center py-20">No results found for "{query}".</div>;
    }
    return (
      <>
        <ResultSection title="Courses" items={results.courses} />
        <ResultSection title="Articles" items={results.articles} />
        <ResultSection title="Pages" items={results.pages} />
      </>
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-site-tile bg-repeat bg-auto">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Search Results</h1>
          <p className="mt-2 text-lg text-gray-600">Showing results for: <span className="font-semibold">"{query}"</span></p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
