import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../services/auth';
import { useToast } from '../components/Toast';
import srmLogo from '../assets/srm-logo.webp';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await signUp(email, password, name);
        showToast('Account created! Please check your email if verification is enabled.', 'success');
        setIsRegister(false); // Switch to login
      } else {
        await signIn(email, password);
        showToast('Welcome back!', 'success');
        navigate('/');
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card">
        <div className="auth-logo">
          <img src={srmLogo} alt="SRM Logo" className="brand-logo brand-logo--lg" />
          <h1 className="auth-title">Findr</h1>
          <p className="auth-subtitle">Lost & Found for the SRM community</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Institutional Email</label>
            <input
              type="email"
              placeholder="name@srmist.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="loader" /> : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button className="btn-link" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Sign In' : 'Create One'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
