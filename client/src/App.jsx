import React, { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Members from './pages/Members.jsx';
import Gallery from './pages/Gallery.jsx';
import Rules from './pages/Rules.jsx';
import Contact from './pages/Contact.jsx';
import { Menu, X, MessageSquare, ShieldAlert, LogOut } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AuthModal from './components/AuthModal.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Monitor Firebase Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data());
          } else {
            setProfile({ email: firebaseUser.email, subscriptionTier: 'free' });
          }
        } catch (e) {
          console.error("Error reading user Firestore profile:", e);
          setProfile({ email: firebaseUser.email, subscriptionTier: 'free' });
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).catch(err => console.error("Error signing out:", err));
  };

  // Render correct page element
  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home navigate={setActiveTab} />;
      case 'about': return <About />;
      case 'members': return <Members />;
      case 'gallery': return <Gallery />;
      case 'rules': return <Rules />;
      case 'contact': return <Contact />;
      default: return <Home navigate={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'members', label: 'Members' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'rules', label: 'Rules' }
  ];

  return (
    <div className="min-height-screen bg-brand-white flex flex-col selection:bg-brand-green selection:text-white">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Logo link */}
          <button onClick={() => setActiveTab('home')} className="flex items-center gap-3.5 focus:outline-none group">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-bg border border-gray-100 flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="Masti Mongsters Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="font-display font-extrabold text-2xl md:text-3xl text-brand-dark tracking-tighter transition-colors duration-300">
              Masti <span className="text-brand-green group-hover:text-brand-dark transition-colors duration-300">Mongsters</span>
            </span>
          </button>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-display font-semibold text-sm transition-colors relative py-1 ${
                  activeTab === item.id ? 'text-brand-dark' : 'text-gray-400 hover:text-brand-dark'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-green shadow-glow rounded" />
                )}
              </button>
            ))}
            
            {/* Auth Action Widget */}
            {user ? (
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 pl-4 pr-1.5 py-1 rounded-full">
                <div className="flex flex-col items-end">
                  <span className="font-display font-bold text-xs text-brand-dark max-w-[120px] truncate">
                    {profile?.displayName || user.email.split('@')[0]}
                  </span>
                  <span className="font-display font-bold text-[8px] uppercase tracking-wider text-brand-pink">
                    {profile?.subscriptionTier || 'free'} Member
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-brand-dark hover:bg-brand-dark/90 text-white p-2 rounded-full transition-all shadow-sm flex items-center justify-center"
                  title="Sign Out"
                >
                  <LogOut size={12} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="font-display font-semibold text-sm text-gray-400 hover:text-brand-dark transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="bg-brand-pink hover:bg-brand-pink/90 text-white font-display font-semibold text-sm px-5 py-2 rounded-full transition-all shadow-sm hover:-translate-y-[2px]"
                >
                  Join Us
                </button>
              </>
            )}
          </nav>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-brand-dark hover:text-brand-green focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[73px] bottom-0 bg-white z-40 px-6 py-8 flex flex-col gap-6 animate-fade-in border-t border-gray-100">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMenuOpen(false);
              }}
              className={`font-display font-bold text-2xl text-left transition-colors ${
                activeTab === item.id ? 'text-brand-green' : 'text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {user ? (
            <div className="mt-auto flex flex-col gap-4 border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
                <div className="flex flex-col">
                  <span className="font-display font-bold text-base text-brand-dark">
                    {profile?.displayName || user.email.split('@')[0]}
                  </span>
                  <span className="font-display font-semibold text-[10px] uppercase tracking-wider text-brand-pink mt-0.5">
                    {profile?.subscriptionTier || 'free'} Member
                  </span>
                </div>
                <span className="text-xl">👑</span>
              </div>
              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="bg-brand-dark hover:bg-brand-dark/95 text-white font-display font-bold text-lg py-4 rounded-2xl w-full text-center"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="mt-auto flex flex-col gap-4">
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMenuOpen(false);
                }}
                className="border border-gray-200 text-brand-dark font-display font-bold text-lg py-4 rounded-2xl w-full text-center"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setActiveTab('contact');
                  setMenuOpen(false);
                }}
                className="bg-brand-pink text-white font-display font-bold text-lg py-4 rounded-2xl w-full text-center"
              >
                Join Request
              </button>
            </div>
          )}
        </div>
      )}

      {/* Global Auth Modal Overlay */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Main Pages Content Frame */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {renderPage()}
      </main>

      {/* Shared Editorial Footer */}
      <footer className="bg-brand-bg border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white border border-gray-200 p-0.5">
                <img src="/logo.png" alt="logo" className="w-full h-full" />
              </div>
              <span className="font-display font-extrabold text-sm text-brand-dark">
                Masti <span className="text-brand-green">Mongsters</span>
              </span>
            </div>
            <p className="text-xs text-gray-400">© 2026 Masti Mongsters Community. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm font-semibold font-display text-gray-400">
            <a href="#" className="hover:text-brand-green transition-colors">WhatsApp</a>
            <a href="#" className="hover:text-brand-pink transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-blue transition-colors">Telegram</a>
            <a href="#" className="hover:text-red-600 transition-colors">YouTube</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
