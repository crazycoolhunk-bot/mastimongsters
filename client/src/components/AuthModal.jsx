import React, { useState } from 'react';
import { Mail, Lock, User, X, Loader2, KeyRound } from 'lucide-react';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setLoading(false);
    setResetSent(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = (newMode) => {
    setError('');
    setResetSent(false);
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          throw new Error("Full name is required.");
        }
        // 1. Create firebase user auth record
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Automate Firestore user profile document creation
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: fullName.trim(),
          email: email.toLowerCase().trim(),
          subscriptionTier: 'free',
          createdAt: new Date().toISOString()
        });

      } else if (mode === 'login') {
        // Sign in user
        await signInWithEmailAndPassword(auth, email, password);

      } else if (mode === 'forgot') {
        // Send reset email
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
        setLoading(false);
        return;
      }

      // Success, close the modal
      handleClose();
    } catch (err) {
      console.error("Auth action failed:", err);
      // Clean up Firebase standard error messages for client presentation
      let friendlyMessage = err.message;
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already registered.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        friendlyMessage = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password must be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Please enter a valid email address.';
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-brand-dark/50 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={handleClose}
    >
      <div 
        className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl flex flex-col gap-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-brand-dark transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Headers */}
        <div className="text-center">
          <h3 className="font-display font-extrabold text-2xl text-brand-dark">
            {mode === 'login' && "Welcome Back"}
            {mode === 'signup' && "Create Account"}
            {mode === 'forgot' && "Reset Password"}
          </h3>
          <p className="text-xs text-gray-400 mt-1.5 font-body">
            {mode === 'login' && "Sign in to access your Masti Mongsters dashboard."}
            {mode === 'signup' && "Register to secure your community profile."}
            {mode === 'forgot' && "Enter your email to receive a password reset link."}
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-3.5 text-xs font-semibold leading-relaxed font-body">
            {error}
          </div>
        )}

        {/* Reset Password Success Notification */}
        {resetSent && (
          <div className="bg-green-50 border border-green-100 text-green-700 rounded-xl p-3.5 text-xs font-semibold leading-relaxed font-body">
            A password reset email has been sent. Please check your inbox!
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-display">
          
          {/* Full Name input (Sign Up Only) */}
          {mode === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-brand-bg border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>
          )}

          {/* Email input (All modes) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-brand-bg border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-green"
              />
            </div>
          </div>

          {/* Password input (Login & Signup modes) */}
          {mode !== 'forgot' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[10px] text-brand-pink font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-bg border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-green hover:bg-brand-green/95 disabled:bg-gray-200 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 mt-2 text-sm"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                {mode === 'login' && "Sign In"}
                {mode === 'signup' && "Register"}
                {mode === 'forgot' && "Send Reset Link"}
              </>
            )}
          </button>
        </form>

        {/* Mode Switchers */}
        <div className="border-t border-gray-100 pt-4 text-center font-display text-xs text-gray-400">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button onClick={() => switchMode('signup')} className="text-brand-pink font-bold hover:underline">
                Create one now
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button onClick={() => switchMode('login')} className="text-brand-pink font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              Remember your password?{' '}
              <button onClick={() => switchMode('login')} className="text-brand-pink font-bold hover:underline">
                Back to Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
