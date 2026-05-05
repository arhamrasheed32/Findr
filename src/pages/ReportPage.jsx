import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/items';
import { useToast } from '../components/Toast';

const ReportPage = () => {
  const [form, setForm] = useState({ title: '', description: '', location: '', date: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleImage = (file) => {
    if (!file?.type.startsWith('image/')) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        title: form.title,
        description: form.description,
        location: form.location,
        date: form.date || new Date().toISOString().split('T')[0],
      };

      await createItem(itemData, imageFile);
      showToast('Item reported successfully! 🎉');
      navigate('/');
    } catch (err) {
      showToast(err.message || 'Failed to submit.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h1 className="page-title">Report Found Item</h1>
            <p className="page-subtitle">Help your fellow students by providing accurate details.</p>
          </div>

          <form className="glass-card report-form" onSubmit={handleSubmit}>
            <div className="input-row">
              <div className="input-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Blue Water Bottle"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Found At (Location) *</label>
                <input
                  type="text"
                  placeholder="e.g. UB Block, 3rd Floor"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label>Date Found</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Description *</label>
              <textarea
                placeholder="Brand, color, distinctive marks, or where exactly it was found..."
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Image Upload */}
            <div
              className={`drop-zone ${preview ? 'drop-zone--active' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleImage(e.dataTransfer.files[0]); }}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="preview-img" />
              ) : (
                <div className="drop-placeholder">
                  <span className="drop-icon">📸</span>
                  <p>Click or drag image to upload</p>
                  <span className="drop-hint">JPG, PNG, WEBP up to 8MB</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImage(e.target.files[0])}
              />
            </div>
            {preview && (
              <button
                type="button"
                className="btn-link"
                onClick={() => { setPreview(null); setImageFile(null); }}
              >
                Remove image
              </button>
            )}

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loader" /> : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ReportPage;
