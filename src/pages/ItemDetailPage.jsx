import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '../services/items';
import { createConversation } from '../services/chat';
import { useAuth } from '../components/AuthContext';
import { useToast } from '../components/Toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=900';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    getItemById(id)
      .then(setItem)
      .catch(() => showToast('Item not found', 'error'))
      .finally(() => setLoading(false));
  }, [id]); // eslint-disable-line

  const handleContact = async () => {
    if (!user) { navigate('/login'); return; }
    if (item.reporter_id === user.id) {
      showToast("You can't contact yourself!", 'error');
      return;
    }
    setContacting(true);
    try {
      const conv = await createConversation(item.id, [user.id, item.reporter_id]);
      navigate(`/chat/${conv.id}`);
    } catch (err) {
      showToast('Failed to start conversation', 'error');
    } finally {
      setContacting(false);
    }
  };

  if (loading) return (
    <div className="page">
      <div className="loader-wrap full-page-loader">
        <div className="loader loader--blue" />
      </div>
    </div>
  );

  if (!item) return (
    <div className="page">
      <div className="container">
        <div className="glass-card error-state">
          <span className="error-icon">🔍</span>
          <h3>Item Not Found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Browse</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/')}>← Back to Browse</button>

          <div className="detail-layout glass-card">
            <div className="detail-image">
              <img
                src={item.image_url || PLACEHOLDER}
                alt={item.title}
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
            </div>
            <div className="detail-info">
              <div className="detail-meta">
                <span className="item-badge item-badge--inline">{item.location}</span>
                <span className="item-date">{new Date(item.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <h1 className="detail-title">{item.title}</h1>
              <p className="detail-desc">{item.description}</p>

              <div className="detail-fields">
                <div className="detail-field">
                  <span className="field-label">📍 Location</span>
                  <span className="field-value">{item.location}</span>
                </div>
                <div className="detail-field">
                  <span className="field-label">📅 Date Found</span>
                  <span className="field-value">{item.date || 'Not specified'}</span>
                </div>
                <div className="detail-field">
                  <span className="field-label">👤 Reported By</span>
                  <span className="field-value">{item.reporter_id}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-full contact-btn"
                onClick={handleContact}
                disabled={contacting}
              >
                {contacting ? <span className="loader" /> : '💬 Contact Reporter'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ItemDetailPage;
