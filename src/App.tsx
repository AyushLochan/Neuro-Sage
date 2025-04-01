import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BrainCircuit, Home, AlertCircle, Users, MessageSquareMore, Menu, X } from 'lucide-react';
import HomePage from './pages/HomePage';
import PredictionPage from './pages/PredictionPage';
import ChatbotPage from './pages/ChatbotPage';
import TeamPage from './pages/TeamPage';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-500 text-white' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors w-full ${
        isActive 
          ? 'bg-blue-500 text-white' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="border-b border-gray-800 sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://img.freepik.com/free-vector/alzheimer-disease-composition-with-senior-man_1284-64661.jpg?w=360&t=st=1701487425~exp=1701488025~hmac=2cb12c9242a61401bf9614302808f4b79773283851cb9d4694425d56b6b0d10b" 
                alt="NeuraScan AI Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              />
              <h1 className="text-xl sm:text-2xl font-bold">NeuraScan AI</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/">
                <Home className="w-4 h-4" />
                Home
              </NavLink>
              <NavLink to="/predict">
                <BrainCircuit className="w-4 h-4" />
                Predict
              </NavLink>
              <NavLink to="/chat">
                <MessageSquareMore className="w-4 h-4" />
                Chat
              </NavLink>
              <NavLink to="/team">
                <Users className="w-4 h-4" />
                Team
              </NavLink>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden flex items-center p-2 text-gray-400 hover:text-white"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 animate-fade-in">
            <div className="px-4 py-2 space-y-1">
              <MobileNavLink to="/" onClick={closeMobileMenu}>
                <Home className="w-4 h-4" />
                Home
              </MobileNavLink>
              <MobileNavLink to="/predict" onClick={closeMobileMenu}>
                <BrainCircuit className="w-4 h-4" />
                Predict
              </MobileNavLink>
              <MobileNavLink to="/chat" onClick={closeMobileMenu}>
                <MessageSquareMore className="w-4 h-4" />
                Chat
              </MobileNavLink>
              <MobileNavLink to="/team" onClick={closeMobileMenu}>
                <Users className="w-4 h-4" />
                Team
              </MobileNavLink>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-red-500/10 backdrop-blur-sm border-t border-red-500/20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center gap-2 text-xs sm:text-sm text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>
            Disclaimer: The predictions provided by this system are for informational purposes only. 
            Consult a healthcare professional for accurate diagnosis and advice.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/predict" element={<PredictionPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
          <Route path="/team" element={<TeamPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;