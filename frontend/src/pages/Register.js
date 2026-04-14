import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
    } catch (err) {
      setError('Registration failed. Email may already exist.');
    }
    setLoading(false);
  };

  return (
    <div className="form-page">
      <div className="form-illustration">
        <img src="/images/auth-illustration.png" alt="Join us" />
      </div>
      <div className="form-side">
        <div className="form-card">
          <h2>Create Account ✨</h2>
          <p className="form-subtitle">Join thousands of users finding & offering services</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="role-cards">
              <div
                className={`role-card ${form.role === 'USER' ? 'selected' : ''}`}
                onClick={() => setForm({ ...form, role: 'USER' })}
              >
                <span className="role-card-icon">🔍</span>
                <div className="role-card-title">Find Services</div>
                <div className="role-card-desc">I need help</div>
              </div>
              <div
                className={`role-card ${form.role === 'PROVIDER' ? 'selected' : ''}`}
                onClick={() => setForm({ ...form, role: 'PROVIDER' })}
              >
                <span className="role-card-icon">🛠️</span>
                <div className="role-card-title">Offer Services</div>
                <div className="role-card-desc">I'm a pro</div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                className="form-input"
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                className="form-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  className="form-input"
                  type="password"
                  name="password"
                  placeholder="Min 6 chars"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-phone">Phone</label>
                <input
                  id="reg-phone"
                  className="form-input"
                  type="text"
                  name="phone"
                  placeholder="+91 XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              type="submit"
              disabled={loading}
              id="register-submit"
            >
              {loading ? '⏳ Creating Account...' : '🚀 Create Account'}
            </button>
          </form>

          <p className="form-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;