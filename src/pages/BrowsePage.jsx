import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../services/items';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600';

const SkeletonCard = () => (
  <div className="item-card glass-card skeleton-card">
    <div className="skeleton-image" />
    <div className="skeleton-body">
      <div className="skeleton-line" style={{ width: '70%' }} />
      <div className="skeleton-line" style={{ width: '45%' }} />
      <div className="skeleton-line" style={{ width: '85%' }} />
    </div>
  </div>
);

const BrowsePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(() => setError('Could not connect to Supabase. Check your connection or SQL schema.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      {/* Hero Banner */}
      <section className="browse-hero">
        <div className="container">
          <h1 className="page-title">Lost Items Registry</h1>
          <p className="page-subtitle">Recent items recovered across SRM campus blocks.</p>
          <button className="btn btn-primary" onClick={() => navigate('/report')}>
            Found Something? Report It →
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="grid">
              {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div className="glass-card error-state">
              <span className="error-icon">⚠️</span>
              <h3>Backend Not Reachable</h3>
              <p>{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '3rem' }}>📦</span>
              <p>No items yet. Be the first to report!</p>
              <button className="btn btn-primary" onClick={() => navigate('/report')}>Report an Item</button>
            </div>
          ) : (
            <div className="grid">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="item-card glass-card"
                  onClick={() => navigate(`/item/${item.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="item-image">
                    <img
                      src={item.image_url || PLACEHOLDER}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                    />
                    <div className="item-badge">{item.location}</div>
                  </div>
                  <div className="item-body">
                    <h3>{item.title}</h3>
                    <p className="item-date">{new Date(item.created_at).toLocaleDateString()}</p>
                    <p className="item-desc">{item.description}</p>
                    <span className="btn-link">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BrowsePage;
