import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import srmLogo from '../assets/srm-logo.webp';

import { useAuth } from './AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="nav nav--scrolled">
      <div className="container nav-wrap">
        <NavLink to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
          <img src={srmLogo} alt="SRM Logo" className="brand-logo" />
          <span className="brand-text">Findr</span>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
            Browse
          </NavLink>
          <NavLink to="/report" className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
            Report
          </NavLink>
          <NavLink to="/inbox" className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
            Inbox
          </NavLink>
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hi, {user.name}</span>
              <button className="nav-btn btn-outline" onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <button className="nav-btn" onClick={() => navigate('/login')}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
