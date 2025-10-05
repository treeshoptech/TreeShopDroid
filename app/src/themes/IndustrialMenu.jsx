import { useState } from 'react'
import './IndustrialMenu.css'

const IndustrialMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems = [
    { icon: '■', label: 'MAP VIEW', sublabel: 'Site Locations' },
    { icon: '▣', label: 'LEADS', sublabel: 'New Projects', badge: '12', status: 'active' },
    { icon: '▨', label: 'PROPOSALS', sublabel: 'Pending Quotes', badge: '5', status: 'warning' },
    { icon: '▦', label: 'WORK ORDERS', sublabel: 'Active Jobs', badge: '8', status: 'active' },
    { icon: '▧', label: 'INVOICES', sublabel: 'Billing Queue', badge: '3', status: 'warning' },
    { icon: '▩', label: 'CALENDAR', sublabel: 'Schedule' },
    { icon: '▥', label: 'EQUIPMENT', sublabel: 'Fleet Status' },
    { icon: '▤', label: 'SAFETY', sublabel: 'Protocols' }
  ]

  return (
    <div className="industrial-theme">
      {/* Metal Texture */}
      <div className="metal-texture"></div>
      <div className="metal-grain"></div>

      {/* Main Content */}
      <div className="industrial-content">
        <div className="industrial-header">
          <div className="industrial-logo">
            <div className="logo-badge">
              <div className="badge-rivet"></div>
              <div className="badge-rivet"></div>
              <div className="badge-rivet"></div>
              <div className="badge-rivet"></div>
            </div>
            <div className="logo-text">
              <span className="text-main">TREE</span>
              <span className="text-sub">SHOP</span>
            </div>
          </div>

          <div className="status-indicators">
            <div className="indicator">
              <div className="indicator-light active"></div>
              <span>SYSTEM ONLINE</span>
            </div>
            <div className="indicator">
              <div className="indicator-light warning"></div>
              <span>5 ALERTS</span>
            </div>
          </div>
        </div>

        <div className="industrial-main">
          <div className="panel-grid">
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">ACTIVE OPERATIONS</div>
                <div className="panel-value">28</div>
              </div>
              <div className="panel-bar">
                <div className="panel-bar-fill" style={{width: '70%'}}></div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">EQUIPMENT STATUS</div>
                <div className="panel-value">6/8</div>
              </div>
              <div className="panel-bar">
                <div className="panel-bar-fill warning" style={{width: '75%'}}></div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">CREW EFFICIENCY</div>
                <div className="panel-value">92%</div>
              </div>
              <div className="panel-bar">
                <div className="panel-bar-fill" style={{width: '92%'}}></div>
              </div>
            </div>
          </div>

          <div className="warning-panel">
            <div className="warning-header">
              <div className="warning-icon">⚠</div>
              <div className="warning-title">SAFETY ALERTS</div>
            </div>
            <div className="warning-list">
              <div className="warning-item">Equipment maintenance due - Chipper #3</div>
              <div className="warning-item">Weather advisory - High winds forecast</div>
              <div className="warning-item">Crew certification expires - 3 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Button */}
      <button
        className={`industrial-menu-btn ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="btn-plate">
          <div className="btn-rivet"></div>
          <div className="btn-rivet"></div>
          <div className="btn-icon">
            <div className="icon-bar"></div>
            <div className="icon-bar"></div>
            <div className="icon-bar"></div>
          </div>
        </div>
      </button>

      {/* Slide Menu */}
      <div className={`industrial-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-plate"></div>

        <div className="menu-header">
          <div className="menu-title">MAIN PANEL</div>
          <div className="menu-serial">SN: TS-2025-001</div>
        </div>

        <div className="menu-items">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="menu-item"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="item-plate">
                <div className="item-rivet"></div>
                <div className="item-rivet"></div>
              </div>
              <div className="menu-item-icon">{item.icon}</div>
              <div className="menu-item-content">
                <div className="menu-item-label">{item.label}</div>
                <div className="menu-item-sublabel">{item.sublabel}</div>
              </div>
              {item.badge && (
                <div className={`menu-item-badge ${item.status || ''}`}>
                  {item.badge}
                </div>
              )}
              <div className="menu-item-arrow">▸</div>
            </div>
          ))}
        </div>

        <div className="menu-footer">
          <div className="footer-plate">
            <div className="plate-rivet"></div>
            <div className="plate-rivet"></div>
            <div className="plate-rivet"></div>
            <div className="plate-rivet"></div>
          </div>
          <div className="footer-info">
            <div className="info-row">
              <span>OPERATOR:</span>
              <span>FIELD-TECH-01</span>
            </div>
            <div className="info-row">
              <span>SHIFT:</span>
              <span>DAY-A</span>
            </div>
            <div className="info-row">
              <span>STATUS:</span>
              <span className="status-active">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="industrial-overlay" onClick={() => setMenuOpen(false)}></div>}
    </div>
  )
}

export default IndustrialMenu
