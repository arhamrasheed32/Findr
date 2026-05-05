import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConversations } from '../services/chat';
import { getItemById } from '../services/items';

import { useAuth } from '../components/AuthContext';

const InboxPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [enriched, setEnriched] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getConversations(user.id)
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  // Enrich conversations with item title
  useEffect(() => {
    if (!conversations.length) { setEnriched([]); return; }
    Promise.all(
      conversations.map((c) =>
        getItemById(c.item_id)
          .then((item) => ({ ...c, itemTitle: item.title, itemImage: item.image_url }))
          .catch(() => ({ ...c, itemTitle: 'Unknown Item', itemImage: null }))
      )
    ).then(setEnriched);
  }, [conversations]);

  if (!user) return null;

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h1 className="page-title">Inbox</h1>
            <p className="page-subtitle">Your conversations about lost & found items.</p>
          </div>

          {loading ? (
            <div className="loader-wrap"><div className="loader loader--blue" /></div>
          ) : enriched.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '3rem' }}>📬</span>
              <p>No conversations yet.</p>
              <p>Browse items and click "Contact Reporter" to start a chat.</p>
              <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Items</button>
            </div>
          ) : (
            <div className="inbox-list">
              {enriched.map((conv) => {
                const other = conv.participants.find((p) => p !== user.id);
                return (
                  <div
                    key={conv.id}
                    className="inbox-item glass-card"
                    onClick={() => navigate(`/chat/${conv.id}`)}
                  >
                    <div className="inbox-avatar">
                      {conv.itemImage ? (
                        <img src={conv.itemImage} alt={conv.itemTitle} />
                      ) : (
                        <div className="inbox-avatar-placeholder">📦</div>
                      )}
                    </div>
                    <div className="inbox-info">
                      <h4>{conv.itemTitle}</h4>
                      <p className="inbox-participant">Chat with: {other}</p>
                      <p className="inbox-date">{new Date(conv.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="inbox-arrow">→</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default InboxPage;
