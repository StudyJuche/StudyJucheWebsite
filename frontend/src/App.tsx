import { AppRoutes } from './Routes';
import { HelmetProvider } from 'react-helmet-async';
import SiteHeader from './components/SiteHeader.tsx';
function App() {
  return (
      <HelmetProvider>
        <SiteHeader
            title="Study Juche"
            description="Study Juche"
        />
        <div className="min-h-screen bg-gray-100">

          <AppRoutes />
        </div>
      </HelmetProvider>
  );
}

export default App;
