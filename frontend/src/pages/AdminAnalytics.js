import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_CONFIG = {
  PENDING:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  label: 'Pending' },
  CONFIRMED:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  label: 'Confirmed' },
  IN_PROGRESS: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', label: 'In Progress' },
  COMPLETED:   { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Completed' },
  CANCELLED:   { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   label: 'Cancelled' },
};

const MONTH_LABELS = { '01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun',
                        '07':'Jul','08':'Aug','09':'Sep','10':'Oct','11':'Nov','12':'Dec' };

function fmtMonth(key) {
  const [, m] = key.split('-');
  return MONTH_LABELS[m] || key;
}

/* ── Animated counter ─────────────────────────────────────── */
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const end = Number(value);
    if (start === end) return;
    const duration = 1200;
    const step = (timestamp) => {
      if (!ref.current) return;
      const progress = Math.min((timestamp - ref.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame((ts) => { ref.current = ts; requestAnimationFrame(step); });
  }, [value]);
  const shown = decimals ? display.toFixed(decimals) : Math.round(display).toLocaleString();
  return <>{prefix}{shown}{suffix}</>;
}

/* ── Donut chart ─────────────────────────────────────────── */
function DonutChart({ data, total }) {
  const size = 180;
  const R = 70;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * R;
  const [hovered, setHovered] = useState(null);
  let offset = 0;
  const slices = data.map(({ key, count }) => {
    const pct = total > 0 ? count / total : 0;
    const dash = pct * circumference;
    const gap  = circumference - dash;
    const slice = { key, count, pct, dash, gap, offset, color: STATUS_CONFIG[key]?.color || '#888' };
    offset += dash;
    return slice;
  });

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={28} />
        {slices.map((s) => (
          <circle
            key={s.key}
            cx={cx} cy={cy} r={R}
            fill="none"
            stroke={s.color}
            strokeWidth={hovered === s.key ? 34 : 28}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset + circumference * 0.25}
            style={{ transition: 'stroke-width 0.2s', cursor: 'pointer', transformOrigin: `${cx}px ${cy}px` }}
            onMouseEnter={() => setHovered(s.key)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#9ca3af" fontSize="11">bookings</text>
      </svg>
      <div className="donut-legend">
        {slices.map((s) => (
          <div key={s.key} className={`donut-legend-item ${hovered === s.key ? 'hovered' : ''}`}
               onMouseEnter={() => setHovered(s.key)}
               onMouseLeave={() => setHovered(null)}>
            <span className="donut-dot" style={{ background: s.color }} />
            <span className="donut-label">{STATUS_CONFIG[s.key]?.label}</span>
            <span className="donut-count">{s.count}</span>
            <span className="donut-pct">{(s.pct * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── SVG trend line ──────────────────────────────────────── */
function TrendLine({ trend }) {
  const entries = Object.entries(trend);
  const values  = entries.map(([, v]) => v);
  const maxVal  = Math.max(...values, 1);
  const W = 420, H = 140, PAD = 20;
  const pts = entries.map(([, v], i) => {
    const x = PAD + (i / (entries.length - 1 || 1)) * (W - PAD * 2);
    const y = H - PAD - ((v / maxVal) * (H - PAD * 2));
    return [x, y];
  });
  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const area = pts.map(([x, y]) => `${x},${y}`).join(' ') +
               ` ${pts[pts.length - 1]?.[0]},${H} ${pts[0]?.[0]},${H}`;

  return (
    <div className="trend-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={PAD} y1={PAD + (1 - f) * (H - PAD * 2)}
                x2={W - PAD} y2={PAD + (1 - f) * (H - PAD * 2)}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        <polygon points={area} fill="url(#trendGrad)" />
        <polyline points={polyline} fill="none" stroke="#6c5ce7" strokeWidth="2.5"
                  strokeLinejoin="round" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="4" fill="#6c5ce7" />
            <circle cx={x} cy={y} r="7" fill="rgba(108,92,231,0.2)" />
            <text x={x} y={H - 4} textAnchor="middle" fill="#9ca3af" fontSize="9">
              {fmtMonth(entries[i]?.[0])}
            </text>
            <text x={x} y={y - 12} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="700">
              {values[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
function AdminAnalytics() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user  = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role !== 'ADMIN') { navigate('/'); return; }
    axios.get('http://localhost:8080/api/admin/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load analytics. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line
  }, []);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  if (error) return (
    <div className="analytics-page">
      <div className="container" style={{ maxWidth: 800, paddingTop: 40 }}>
        <div className="form-error">{error}</div>
      </div>
    </div>
  );

  const donutData = [
    { key: 'PENDING',     count: data.pendingBookings },
    { key: 'CONFIRMED',   count: data.confirmedBookings },
    { key: 'IN_PROGRESS', count: data.inProgressBookings },
    { key: 'COMPLETED',   count: data.completedBookings },
    { key: 'CANCELLED',   count: data.cancelledBookings },
  ].filter(d => d.count > 0);

  const catEntries    = Object.entries(data.categoryBreakdown || {}).sort(([,a],[,b]) => b - a);
  const maxCatVal     = Math.max(...catEntries.map(([,v]) => v), 1);

  return (
    <div className="analytics-page">
      <div className="container" style={{ maxWidth: 1200 }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="analytics-header">
          <div>
            <h1 className="analytics-title">📊 Admin Analytics</h1>
            <p className="analytics-subtitle">Real-time overview of platform activity</p>
          </div>
          <div className="analytics-badge">
            <span className="dot pulse-green" />
            Live Data
          </div>
        </div>

        {/* ── KPI Cards ───────────────────────────────────────── */}
        <div className="kpi-grid">
          <div className="kpi-card kpi-blue">
            <div className="kpi-icon">👥</div>
            <div className="kpi-info">
              <div className="kpi-value"><AnimatedNumber value={data.totalUsers} /></div>
              <div className="kpi-label">Total Users</div>
            </div>
            <div className="kpi-sub">
              <span>{data.totalProviders} Providers</span>
              <span>{data.totalCustomers} Receivers</span>
            </div>
          </div>

          <div className="kpi-card kpi-purple">
            <div className="kpi-icon">🛠️</div>
            <div className="kpi-info">
              <div className="kpi-value"><AnimatedNumber value={data.totalServices} /></div>
              <div className="kpi-label">Services Listed</div>
            </div>
            <div className="kpi-sub">
              <span>{Object.keys(data.categoryBreakdown || {}).length} categories</span>
            </div>
          </div>

          <div className="kpi-card kpi-teal">
            <div className="kpi-icon">📅</div>
            <div className="kpi-info">
              <div className="kpi-value"><AnimatedNumber value={data.totalBookings} /></div>
              <div className="kpi-label">Total Bookings</div>
            </div>
            <div className="kpi-sub">
              <span>{data.completedBookings} Completed</span>
              <span>{data.pendingBookings} Pending</span>
            </div>
          </div>

          <div className="kpi-card kpi-green">
            <div className="kpi-icon">💰</div>
            <div className="kpi-info">
              <div className="kpi-value"><AnimatedNumber value={data.totalRevenue} prefix="₹" decimals={0} /></div>
              <div className="kpi-label">Total Revenue</div>
            </div>
            <div className="kpi-sub">
              <span>From completed bookings</span>
            </div>
          </div>
        </div>

        {/* ── Middle Row: Donut + Trend ──────────────────────── */}
        <div className="analytics-mid-row">

          {/* Booking Status Donut */}
          <div className="analytics-card" style={{ flex: '1 1 340px' }}>
            <h3 className="analytics-card-title">📋 Booking Status</h3>
            {donutData.length > 0 ? (
              <DonutChart data={donutData} total={data.totalBookings} />
            ) : (
              <div className="analytics-empty">No bookings yet</div>
            )}
          </div>

          {/* Monthly Trend */}
          <div className="analytics-card" style={{ flex: '2 1 480px' }}>
            <h3 className="analytics-card-title">📈 Monthly Booking Trend</h3>
            {Object.keys(data.monthlyTrend || {}).length > 0 ? (
              <TrendLine trend={data.monthlyTrend} />
            ) : (
              <div className="analytics-empty">No trend data</div>
            )}
          </div>
        </div>

        {/* ── Bottom Row: Category Bar + Top Providers ─────── */}
        <div className="analytics-mid-row">

          {/* Category Breakdown */}
          <div className="analytics-card" style={{ flex: '1 1 340px' }}>
            <h3 className="analytics-card-title">🗂️ Services by Category</h3>
            {catEntries.length > 0 ? (
              <div className="cat-bars">
                {catEntries.map(([cat, count]) => (
                  <div key={cat} className="cat-bar-row">
                    <span className="cat-bar-label">{cat}</span>
                    <div className="cat-bar-track">
                      <div className="cat-bar-fill" style={{ width: `${(count / maxCatVal) * 100}%` }} />
                    </div>
                    <span className="cat-bar-count">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="analytics-empty">No services yet</div>
            )}
          </div>

          {/* Top Providers */}
          <div className="analytics-card" style={{ flex: '2 1 480px' }}>
            <h3 className="analytics-card-title">🏆 Top Service Providers</h3>
            {data.topProviders?.length > 0 ? (
              <div className="provider-table-wrap">
                <table className="provider-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Provider</th>
                      <th>Completed</th>
                      <th>Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProviders.map((p, i) => (
                      <tr key={p.providerId}>
                        <td>
                          <span className={`rank-badge rank-${i + 1}`}>
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                          </span>
                        </td>
                        <td>
                          <div className="prov-name-cell">
                            <div className="prov-avatar">{p.providerName?.charAt(0)?.toUpperCase() || '?'}</div>
                            <span>{p.providerName}</span>
                          </div>
                        </td>
                        <td><span className="completed-chip">{p.completedBookings}</span></td>
                        <td className="earnings-cell">₹{p.totalEarnings.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="analytics-empty">No provider data yet</div>
            )}
          </div>
        </div>

        {/* ── Recent Activity Feed ──────────────────────────── */}
        <div className="analytics-card">
          <h3 className="analytics-card-title">🕐 Recent Activity</h3>
          {data.recentBookings?.length > 0 ? (
            <div className="activity-feed">
              {data.recentBookings.map((b, i) => {
                const cfg = STATUS_CONFIG[b.status] || { color: '#888', bg: 'rgba(136,136,136,0.1)', label: b.status };
                return (
                  <div key={b.id || i} className="activity-item">
                    <div className="activity-icon" style={{ background: cfg.bg, color: cfg.color }}>
                      {b.status === 'COMPLETED' ? '✅' :
                       b.status === 'PENDING'   ? '⏳' :
                       b.status === 'CONFIRMED' ? '🎯' :
                       b.status === 'IN_PROGRESS' ? '🔄' : '❌'}
                    </div>
                    <div className="activity-info">
                      <div className="activity-title">{b.serviceTitle}</div>
                      <div className="activity-meta">
                        <span>👤 {b.customerName}</span>
                        <span>→</span>
                        <span>🛠 {b.providerName}</span>
                      </div>
                    </div>
                    <div className="activity-right">
                      <span className="activity-status" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      <span className="activity-price">₹{b.price}</span>
                      <span className="activity-date">{b.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="analytics-empty">No recent bookings</div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;
