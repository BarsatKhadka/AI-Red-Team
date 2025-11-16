import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import StaticFilesPage from './pages/StaticFilesPage';
import ComponentShowcase from './pages/ComponentShowcase';
import PricingPage from './pages/PricingPage';
import MemoryPage from './pages/MemoryPage';
import Logo from './components/Logo';
import './styles/pages.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActivePage = () => {
    const path = location.pathname;
    if (path === '/files' || path === '/project-files') return 'files';
    if (path === '/deliverable' || path === '/showcase') return 'showcase';
    if (path === '/pricing') return 'pricing';
    if (path === '/memory' || path === '/ai-memory') return 'memory';
    return 'dashboard';
  };

  const currentPage = getActivePage();

  const handleNavigation = (page) => {
    switch (page) {
      case 'dashboard':
        navigate('/');
        break;
      case 'files':
        navigate('/files');
        break;
      case 'showcase':
        navigate('/deliverable');
        break;
      case 'pricing':
        navigate('/pricing');
        break;
      case 'memory':
        navigate('/memory');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="app-nav">
        <div className="nav-content">
          <div 
            className="nav-logo" 
            onClick={() => handleNavigation('dashboard')} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <Logo size={32} />
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ProjectOps Studio
            </h2>
          </div>
          <div className="nav-links">
            <button 
              onClick={() => handleNavigation('dashboard')}
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => handleNavigation('files')}
              className={`nav-link ${currentPage === 'files' ? 'active' : ''}`}
            >
              Project Files
            </button>
            <button 
              onClick={() => handleNavigation('showcase')}
              className={`nav-link ${currentPage === 'showcase' ? 'active' : ''}`}
            >
              Deliverable
            </button>
            <button 
              onClick={() => handleNavigation('pricing')}
              className={`nav-link ${currentPage === 'pricing' ? 'active' : ''}`}
            >
              Pricing Plans
            </button>
            <button 
              onClick={() => handleNavigation('memory')}
              className={`nav-link ${currentPage === 'memory' ? 'active' : ''}`}
            >
              AI Memory
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/files" element={<StaticFilesPage />} />
          <Route path="/project-files" element={<StaticFilesPage />} />
          <Route path="/deliverable" element={<ComponentShowcase />} />
          <Route path="/showcase" element={<ComponentShowcase />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/ai-memory" element={<MemoryPage />} />
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
