import { AppRoutes } from './Routes';
import { HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader.tsx';
import { TopHeader } from './components/TopHeader.tsx';
import { SiteFooter } from './components/SiteFooter.tsx';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
      <HelmetProvider>
        <SiteHeader
            title="Study Juche"
            description="Study Juche"
        />
        <div className="min-h-screen flex flex-col bg-site-tile bg-repeat bg-auto">
          <TopHeader />
          <main className={`flex-1 w-full ${isHomePage ? '' : 'mb-16'}`}>
            <AppRoutes />
          </main>
          <SiteFooter />
        </div>
      </HelmetProvider>
  );
}

export default App;
