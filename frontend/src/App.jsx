import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import StaticFilesPage from './pages/StaticFilesPage';
import ComponentShowcase from './pages/ComponentShowcase';
import PricingPage from './pages/PricingPage';
import './styles/pages.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'files':
        return <StaticFilesPage />;
      case 'showcase':
        return <ComponentShowcase />;
      case 'pricing':
        return <PricingPage />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="app-nav">
        <div className="nav-content">
          <h2 className="nav-logo">AI Red Team</h2>
          <div className="nav-links">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentPage('files')}
              className={`nav-link ${currentPage === 'files' ? 'active' : ''}`}
            >
              Project Files
            </button>
            <button 
              onClick={() => setCurrentPage('showcase')}
              className={`nav-link ${currentPage === 'showcase' ? 'active' : ''}`}
            >
              Deliverable
            </button>
            <button 
              onClick={() => setCurrentPage('pricing')}
              className={`nav-link ${currentPage === 'pricing' ? 'active' : ''}`}
            >
              Pricing Plans
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
