// src/App.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import UploadSection from './components/UploadSection';
import AIAssistant from './components/AIAssistant';
import ProfilePage from './components/profile/ProfilePage';
import AuthModal from './components/auth/AuthModal';
import Footer from './components/Footer';

// Import new page components
import Features from './pages/Features';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

// Updated ViewType to include new pages
type ViewType = 'home' | 'dashboard' | 'upload' | 'assistant' | 'profile' | 'features' | 'about' | 'contact';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { user, loading } = useAuth();

  // Fix: Properly type the view parameter
  const handleViewChange = (view: ViewType | string) => {
    const validView = view as ViewType;
    
    // Require authentication for certain views
    if (['dashboard', 'profile', 'assistant'].includes(validView) && !user) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    setCurrentView(validView);
  };

  // Fix: Type the profile parameter properly
  const handleProfileUpload = (profile: any) => {
    setUserProfile(profile);
    setCurrentView('dashboard');
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentView('upload');
    } else {
      setAuthModalMode('register');
      setShowAuthModal(true);
    }
  };

  const handleAuthRequired = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
    setCurrentView('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <Header 
        currentView={currentView} 
        onViewChange={handleViewChange}
        user={user}
        onAuthClick={(mode: 'login' | 'register') => {
          setAuthModalMode(mode);
          setShowAuthModal(true);
        }}
      />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pt-20"
        >
          {currentView === 'home' && <Hero onGetStarted={handleGetStarted} />}
          {currentView === 'upload' && <UploadSection onUploadSuccess={handleProfileUpload} />}
          {currentView === 'dashboard' && (
            <Dashboard 
              userProfile={userProfile} 
              onAuthRequired={handleAuthRequired}
            />
          )}
          {currentView === 'assistant' && <AIAssistant />}
          {currentView === 'profile' && <ProfilePage />}
          
          {/* New page views */}
          {currentView === 'features' && <Features />}
          {currentView === 'about' && <AboutUs />}
          {currentView === 'contact' && <Contact />}
        </motion.main>
      </AnimatePresence>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
      
      <Footer onViewChange={handleViewChange} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
