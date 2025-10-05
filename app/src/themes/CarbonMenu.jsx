import { useState } from 'react'
import './CarbonMenu.css'

const CarbonMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems = [
    { icon: '○', label: 'Map', sublabel: 'Location overview' },
    { icon: '◉', label: 'Leads', sublabel: 'Manage prospects', badge: '12' },
    { icon: '●', label: 'Proposals', sublabel: 'Active quotes', badge: '5' },
    { icon: '◐', label: 'Work Orders', sublabel: 'Jobs in progress', badge: '8' },
    { icon: '◑', label: 'Invoices', sublabel: 'Billing & payments', badge: '3' },
    { icon: '◒', label: 'Calendar', sublabel: 'Schedule & timeline' },
    { icon: '◓', label: 'Analytics', sublabel: 'Performance metrics' },
    { icon: '◔', label: 'Settings', sublabel: 'App preferences' }
  ]

  return (
    <div className="carbon-theme">
      {/* Carbon Fiber Pattern */}
      <div className="carbon-pattern"></div>

      {/* Main Content */}
      <div className="carbon-content">
        <div className="carbon-header">
          <div className="carbon-logo">
            <div className="logo-circle"></div>
            <span>TreeShop</span>
          </div>
          <div className="carbon-nav">
            <button className="nav-item active">Dashboard</button>
            <button className="nav-item">Projects</button>
            <button className="nav-item">Team</button>
          </div>
        </div>

        <div className="carbon-main">
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-value">$48.2K</div>
                <div className="stat-label">Revenue</div>
              </div>
              <div className="stat-trend up">+12%</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">◉</div>
              <div className="stat-content">
                <div className="stat-value">28</div>
                <div className="stat-label">Active Jobs</div>
              </div>
              <div className="stat-trend up">+3</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">◐</div>
              <div className="stat-content">
                <div className="stat-value">94%</div>
                <div className="stat-label">Completion</div>
              </div>
              <div className="stat-trend up">+2%</div>
            </div>
          </div>

          <div className="chart-placeholder">
            <div className="chart-title">Performance Overview</div>
            <div className="chart-bars">
              <div className="chart-bar" style={{height: '60%'}}></div>
              <div className="chart-bar" style={{height: '80%'}}></div>
              <div className="chart-bar" style={{height: '45%'}}></div>
              <div className="chart-bar" style={{height: '90%'}}></div>
              <div className="chart-bar" style={{height: '70%'}}></div>
              <div className="chart-bar" style={{height: '85%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Button */}
      <button
        className={`carbon-menu-btn ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="menu-btn-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Slide Menu */}
      <div className={`carbon-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-blur"></div>

        <div className="menu-header">
          <div className="menu-user">
            <div className="user-avatar">TS</div>
            <div className="user-info">
              <div className="user-name">TreeShop User</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        </div>

        <div className="menu-items">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="menu-item"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="menu-item-icon">{item.icon}</div>
              <div className="menu-item-content">
                <div className="menu-item-label">{item.label}</div>
                <div className="menu-item-sublabel">{item.sublabel}</div>
              </div>
              {item.badge && (
                <div className="menu-item-badge">{item.badge}</div>
              )}
            </div>
          ))}
        </div>

        <div className="menu-footer">
          <button className="footer-btn">
            <span>⚙</span>
            Preferences
          </button>
          <button className="footer-btn">
            <span>◐</span>
            Sign Out
          </button>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="carbon-overlay" onClick={() => setMenuOpen(false)}></div>}
    </div>
  )
}

export default CarbonMenu
