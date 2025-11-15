import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import StaticFilesPage from './pages/StaticFilesPage';
import DeliverablesPage from './pages/DeliverablesPage';
import ComponentShowcase from './pages/ComponentShowcase';
import './styles/pages.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'files':
        return <StaticFilesPage />;
      case 'deliverables':
        return <DeliverablesPage />;
      case 'showcase':
        return <ComponentShowcase />;
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
          <h2 className="nav-logo">🛡️ AI Red Team</h2>
          <div className="nav-links">
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            >
              📊 Dashboard
            </button>
            <button 
              onClick={() => setCurrentPage('files')}
              className={`nav-link ${currentPage === 'files' ? 'active' : ''}`}
            >
              📁 Project Files
            </button>
            <button 
              onClick={() => setCurrentPage('deliverables')}
              className={`nav-link ${currentPage === 'deliverables' ? 'active' : ''}`}
            >
              📦 Deliverables
            </button>
            <button 
              onClick={() => setCurrentPage('showcase')}
              className={`nav-link ${currentPage === 'showcase' ? 'active' : ''}`}
            >
              ✨ AI Showcase
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
