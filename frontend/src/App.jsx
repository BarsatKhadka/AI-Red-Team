import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import StaticFilesPage from './pages/StaticFilesPage';
import DeliverablesPage from './pages/DeliverablesPage';
import './styles/pages.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'files':
        return <StaticFilesPage />;
      case 'deliverables':
        return <DeliverablesPage />;
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
              📁 Static Files
            </button>
            <button 
              onClick={() => setCurrentPage('deliverables')}
              className={`nav-link ${currentPage === 'deliverables' ? 'active' : ''}`}
            >
              📦 Deliverables
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
