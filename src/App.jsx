import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import BrowsePage from './pages/BrowsePage';
import ReportPage from './pages/ReportPage';
import ItemDetailPage from './pages/ItemDetailPage';
import ChatPage from './pages/ChatPage';
import InboxPage from './pages/InboxPage';

import { AuthProvider } from './components/AuthContext';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="layout-body">{children}</div>
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected — require login */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><BrowsePage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute>
              <Layout><ReportPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/item/:id" element={
            <ProtectedRoute>
              <Layout><ItemDetailPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat/:conversationId" element={
            <ProtectedRoute>
              <Layout><ChatPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/inbox" element={
            <ProtectedRoute>
              <Layout><InboxPage /></Layout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
