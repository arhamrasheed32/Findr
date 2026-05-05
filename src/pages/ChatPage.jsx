import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMessages, sendMessage, subscribeToMessages } from '../services/chat';
import { useToast } from '../components/Toast';

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const rawUser = localStorage.getItem('srm_findr_user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  // Fetch conversation item info from the conversationId stored in messages (or from URL state)
  const loadMessages = useCallback(async () => {
    try {
      const msgs = await getMessages(conversationId);
      setMessages(msgs);
    } catch {
      // Silently fail on poll
    }
  }, [conversationId]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadMessages();
    // Poll every 3 seconds for new messages
    pollRef.current = setInterval(loadMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [loadMessages]); // eslint-disable-line

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    // Optimistic update
    const optimistic = {
      id: `opt-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: user.id,
      text: text.trim(),
      created_at: new Date().toISOString(),
      optimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setText('');

    try {
      const msg = await sendMessage(conversationId, user.id, optimistic.text);
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? msg : m)));
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      showToast('Failed to send message', 'error');
      setText(optimistic.text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page chat-page">
      {/* Chat Header */}
      <div className="chat-header glass-card">
        <button className="back-btn" onClick={() => navigate('/inbox')}>← Inbox</button>
        <div className="chat-header-info">
          <h2>Conversation</h2>
          <p className="chat-conv-id">ID: {conversationId.slice(0, 8)}…</p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <span>💬</span>
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id;
          return (
            <div key={msg.id} className={`bubble-wrap ${isMine ? 'bubble-wrap--mine' : 'bubble-wrap--theirs'}`}>
              <div className={`bubble ${isMine ? 'bubble--mine' : 'bubble--theirs'} ${msg.optimistic ? 'bubble--sending' : ''}`}>
                <p>{msg.text}</p>
                <span className="bubble-time">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.optimistic && ' ·· '}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form className="chat-input-bar glass-card" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={sending}
          autoFocus
        />
        <button type="submit" className="btn btn-primary send-btn" disabled={sending || !text.trim()}>
          {sending ? <span className="loader loader--white" /> : '➤'}
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
