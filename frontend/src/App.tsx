import { AppRoutes } from './Routes';
import { HelmetProvider } from 'react-helmet-async';
import SiteHeader from './components/SiteHeader.tsx';
import { TopHeader } from './components/TopHeader.tsx';

function App() {
  return (
      <HelmetProvider>
        <SiteHeader
            title="Study Juche"
            description="Study Juche"
        />
        <div className="min-h-screen bg-site-tile bg-repeat bg-auto flex flex-col">
          <TopHeader />
          <main className="flex-1 w-full">
            <AppRoutes />
          </main>
        </div>
      </HelmetProvider>
  );
}

export default App;
