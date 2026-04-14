import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function EditProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    bio: '',
    phone: '',
    address: '',
    specialities: '',
    profileImageUrl: ''
  });

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      // We need to get the user's ID first, then fetch profile
      const allServices = await axios.get('http://localhost:8080/api/services/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Try to get provider ID from services, or use email
      let userId = user.email;
      if (allServices.data.length > 0) {
        userId = allServices.data[0].providerId;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/profiles/${userId}`);
        const p = res.data;
        setForm({
          fullName: p.fullName || user.fullName || '',
          bio: p.bio || '',
          phone: p.phone || '',
          address: p.address || '',
          specialities: p.specialities ? p.specialities.join(', ') : '',
          profileImageUrl: p.profileImageUrl || ''
        });
      } catch (e) {
        setForm(prev => ({ ...prev, fullName: user.fullName || '' }));
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('http://localhost:8080/api/profiles', {
        fullName: form.fullName,
        bio: form.bio,
        phone: form.phone,
        address: form.address,
        specialities: form.specialities.split(',').map((s) => s.trim()).filter(Boolean),
        profileImageUrl: form.profileImageUrl
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  return (
    <div className="detail-page">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="glass-card" style={{ animation: 'slideUp 0.6s ease' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: '28px',
            fontWeight: 800, marginBottom: '8px', textAlign: 'center'
          }}>
            Edit Profile ✏️
          </h2>
          <p style={{
            textAlign: 'center', color: 'var(--text-secondary)',
            marginBottom: '32px', fontSize: '15px'
          }}>
            Update your provider profile to attract more customers
          </p>

          {success && <div className="form-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Profile Image Preview */}
            <div style={{
              textAlign: 'center', marginBottom: '24px'
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'var(--accent-gradient)', margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', fontWeight: 800, color: 'white',
                fontFamily: 'var(--font-heading)',
                overflow: 'hidden'
              }}>
                {form.profileImageUrl ? (
                  <img src={form.profileImageUrl} alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  form.fullName.charAt(0).toUpperCase()
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input className="form-input" type="text" name="fullName"
                placeholder="Your full name" value={form.fullName}
                onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea className="form-input" name="bio"
                placeholder="Tell customers about yourself, your experience, and expertise..."
                value={form.bio} onChange={handleChange} rows={4} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input className="form-input" type="text" name="phone"
                  placeholder="+91 XXXXX" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input className="form-input" type="text" name="address"
                  placeholder="Your location" value={form.address} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Specialities (comma-separated)</label>
              <input className="form-input" type="text" name="specialities"
                placeholder="e.g. Plumbing, Electrical, AC Repair"
                value={form.specialities} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Profile Image URL</label>
              <input className="form-input" type="url" name="profileImageUrl"
                placeholder="https://example.com/your-photo.jpg"
                value={form.profileImageUrl} onChange={handleChange} />
            </div>

            <button className="btn btn-primary btn-block btn-lg" type="submit"
              disabled={saving} style={{ marginTop: '20px' }}>
              {saving ? '⏳ Saving...' : '💾 Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
