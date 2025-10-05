import { useState } from 'react'
import './TacticalNavMenu.css'
import TacticalBadge from './TacticalBadge'

const TacticalNavMenu = ({ isOpen, onClose, onNavigate, currentView }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '◉',
      description: 'Overview & Analytics',
      badge: null
    },
    {
      id: 'map',
      label: 'Map View',
      icon: '⊕',
      description: 'Interactive Map',
      badge: null
    },
    {
      id: 'lead-form',
      label: 'Leads',
      icon: '▣',
      description: 'Customer Inquiries',
      badge: { count: 12, status: 'lead' }
    },
    {
      id: 'proposal',
      label: 'Proposals',
      icon: '▤',
      description: 'Quotes & Estimates',
      badge: { count: 8, status: 'proposal' }
    },
    {
      id: 'work-order',
      label: 'Work Orders',
      icon: '▥',
      description: 'Scheduled Jobs',
      badge: { count: 5, status: 'workorder' }
    },
    {
      id: 'invoice',
      label: 'Invoices',
      icon: '▦',
      description: 'Billing & Payments',
      badge: { count: 3, status: 'invoice' }
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '◈',
      description: 'Customer Database',
      badge: null
    },
    {
      id: 'components',
      label: 'Components',
      icon: '⊞',
      description: 'UI Library',
      badge: null
    }
  ]

  const handleItemClick = (id) => {
    onNavigate(id)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="nav-backdrop" onClick={onClose}></div>}

      {/* Navigation Menu */}
      <div className={`tactical-nav-menu ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="nav-header">
          <div className="nav-logo">
            <div className="logo-icon">🌲</div>
            <div className="logo-text">
              <div className="logo-title">TREESHOP</div>
              <div className="logo-subtitle">TACTICAL OPS</div>
            </div>
          </div>
          <button className="nav-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* User Profile */}
        <div className="nav-profile">
          <div className="profile-avatar">OP</div>
          <div className="profile-info">
            <div className="profile-name">Operator</div>
            <div className="profile-role">Admin • Active</div>
          </div>
          <div className="profile-status online"></div>
        </div>

        {/* Navigation Items */}
        <nav className="nav-items">
          <div className="nav-section-title">
            <span className="section-bracket">[</span>
            NAVIGATION
            <span className="section-bracket">]</span>
          </div>

          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <div className="nav-item-icon">{item.icon}</div>
              <div className="nav-item-content">
                <div className="nav-item-label">{item.label}</div>
                <div className="nav-item-desc">{item.description}</div>
              </div>
              {item.badge && (
                <div className="nav-item-badge">
                  <TacticalBadge status={item.badge.status} variant="count">
                    {item.badge.count}
                  </TacticalBadge>
                </div>
              )}
              <div className="nav-item-arrow">▸</div>
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="nav-stats">
          <div className="nav-section-title">
            <span className="section-bracket">[</span>
            QUICK STATS
            <span className="section-bracket">]</span>
          </div>
          <div className="stat-grid">
            <div className="stat-item">
              <div className="stat-value">28</div>
              <div className="stat-label">Active Jobs</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">$12.5K</div>
              <div className="stat-label">Revenue MTD</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <button className="nav-action-btn">
            <span className="action-icon">⚙</span>
            <span className="action-label">Settings</span>
          </button>
          <button className="nav-action-btn">
            <span className="action-icon">?</span>
            <span className="action-label">Help</span>
          </button>
          <button className="nav-action-btn logout">
            <span className="action-icon">⊗</span>
            <span className="action-label">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="nav-footer">
          <div className="footer-version">v1.0.0-alpha</div>
          <div className="footer-status">
            <span className="status-dot"></span>
            System Online
          </div>
        </div>
      </div>
    </>
  )
}

export default TacticalNavMenu
