// src/App.tsx
import React, { useState } from 'react';
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

type ViewType = 'home' | 'dashboard' | 'upload' | 'assistant' | 'profile';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [userProfile, setUserProfile] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { user, loading } = useAuth();

  const handleViewChange = (view: ViewType) => {
    // Require authentication for certain views
    if (['dashboard', 'profile', 'assistant'].includes(view) && !user) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }
    setCurrentView(view);
  };

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
        onAuthClick={(mode) => {
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
        </motion.main>
      </AnimatePresence>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />
      
      <Footer />
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
