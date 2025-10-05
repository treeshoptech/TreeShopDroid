import { useState } from 'react'
import './TacticalMenu.css'

const TacticalMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems = [
    { icon: '◉', label: 'MAP VIEW', sublabel: 'Tactical Overview' },
    { icon: '◎', label: 'LEADS', sublabel: 'Target Acquisition', badge: '12' },
    { icon: '⬢', label: 'PROPOSALS', sublabel: 'Mission Briefing', badge: '5' },
    { icon: '⬡', label: 'WORK ORDERS', sublabel: 'Active Operations', badge: '8' },
    { icon: '⬟', label: 'INVOICES', sublabel: 'Mission Complete', badge: '3' },
    { icon: '◈', label: 'CALENDAR', sublabel: 'Timeline' },
    { icon: '◆', label: 'REPORTS', sublabel: 'Intel Summary' },
    { icon: '◇', label: 'SETTINGS', sublabel: 'Configuration' }
  ]

  return (
    <div className="tactical-theme">
      {/* Background Grid */}
      <div className="tactical-grid"></div>

      {/* Main Content */}
      <div className="tactical-content">
        <div className="tactical-header">
          <div className="tactical-logo">
            <div className="logo-brackets">[</div>
            <div className="logo-text">TREESHOP</div>
            <div className="logo-brackets">]</div>
          </div>
          <div className="tactical-status">
            <div className="status-item">
              <span className="status-label">SYS</span>
              <span className="status-value online">ONLINE</span>
            </div>
            <div className="status-item">
              <span className="status-label">OPS</span>
              <span className="status-value">28</span>
            </div>
          </div>
        </div>

        <div className="tactical-main">
          <div className="main-grid">
            <div className="grid-item">
              <div className="grid-item-label">ACTIVE LEADS</div>
              <div className="grid-item-value">12</div>
            </div>
            <div className="grid-item">
              <div className="grid-item-label">IN PROGRESS</div>
              <div className="grid-item-value">8</div>
            </div>
            <div className="grid-item">
              <div className="grid-item-label">COMPLETED</div>
              <div className="grid-item-value">143</div>
            </div>
            <div className="grid-item">
              <div className="grid-item-label">EFFICIENCY</div>
              <div className="grid-item-value">94%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Button */}
      <button
        className={`tactical-menu-btn ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="menu-btn-line"></div>
        <div className="menu-btn-line"></div>
        <div className="menu-btn-line"></div>
      </button>

      {/* Slide Menu */}
      <div className={`tactical-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <div className="menu-title">TACTICAL MENU</div>
          <div className="menu-timestamp">{new Date().toLocaleTimeString('en-US', { hour12: false })}</div>
        </div>

        <div className="menu-items">
          {menuItems.map((item, index) => (
            <div key={index} className="menu-item" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="menu-item-icon">{item.icon}</div>
              <div className="menu-item-content">
                <div className="menu-item-label">{item.label}</div>
                <div className="menu-item-sublabel">{item.sublabel}</div>
              </div>
              {item.badge && (
                <div className="menu-item-badge">{item.badge}</div>
              )}
              <div className="menu-item-arrow">›</div>
            </div>
          ))}
        </div>

        <div className="menu-footer">
          <div className="menu-footer-item">
            <span>STATUS:</span> <span className="online">OPERATIONAL</span>
          </div>
          <div className="menu-footer-item">
            <span>USER:</span> <span>OPERATOR-01</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="tactical-overlay" onClick={() => setMenuOpen(false)}></div>}
    </div>
  )
}

export default TacticalMenu
