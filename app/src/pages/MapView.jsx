import { useState } from 'react'
import './MapView.css'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalButton from '../components/TacticalButton'
import TacticalCheckbox from '../components/TacticalCheckbox'

const MapView = () => {
  // Mock location data - in real app, this would come from API with actual GPS coordinates
  const [mapPins, setMapPins] = useState([
    { id: 1, customer: 'John Smith', address: '123 Oak St', lat: 35, lng: 45, status: 'lead', service: 'Tree Removal', priority: 'high' },
    { id: 2, customer: 'Sarah Johnson', address: '456 Pine Ave', lat: 55, lng: 25, status: 'proposal', service: 'Tree Trimming', priority: 'medium' },
    { id: 3, customer: 'Mike Davis', address: '789 Maple Dr', lat: 25, lng: 65, status: 'workorder', service: 'Stump Grinding', priority: 'high' },
    { id: 4, customer: 'Lisa Brown', address: '321 Elm Rd', lat: 70, lng: 50, status: 'invoice', service: 'Land Clearing', priority: 'low' },
    { id: 5, customer: 'Tom Wilson', address: '654 Cedar Ln', lat: 45, lng: 75, status: 'lead', service: 'Emergency Storm Damage', priority: 'critical' },
    { id: 6, customer: 'Robert Martinez', address: '987 Birch Way', lat: 60, lng: 35, status: 'workorder', service: 'Tree Removal', priority: 'medium' },
    { id: 7, customer: 'Jennifer Lee', address: '147 Spruce Ct', lat: 20, lng: 40, status: 'proposal', service: 'Stump Grinding', priority: 'low' },
    { id: 8, customer: 'David Anderson', address: '258 Willow Pl', lat: 80, lng: 70, status: 'completed', service: 'Tree Trimming', priority: 'medium' },
    { id: 9, customer: 'Emily Taylor', address: '369 Ash Blvd', lat: 40, lng: 20, status: 'invoice', service: 'Land Clearing', priority: 'high' },
    { id: 10, customer: 'Chris Martin', address: '741 Redwood Dr', lat: 15, lng: 85, status: 'completed', service: 'Tree Removal', priority: 'low' },
    { id: 11, customer: 'Amy White', address: '852 Hickory St', lat: 65, lng: 15, status: 'lead', service: 'Tree Trimming', priority: 'medium' },
    { id: 12, customer: 'Brian Clark', address: '963 Sycamore Ave', lat: 50, lng: 55, status: 'proposal', service: 'Stump Grinding', priority: 'high' }
  ])

  const [filters, setFilters] = useState({
    lead: true,
    proposal: true,
    workorder: true,
    invoice: true,
    completed: true
  })

  const [selectedPin, setSelectedPin] = useState(null)

  const handleFilterToggle = (status) => {
    setFilters(prev => ({ ...prev, [status]: !prev[status] }))
  }

  const filteredPins = mapPins.filter(pin => filters[pin.status])

  const getPinColor = (status) => {
    const colors = {
      lead: '#2196f3',
      proposal: '#ff9100',
      workorder: '#00ff41',
      invoice: '#ff4136',
      completed: '#808080'
    }
    return colors[status]
  }

  const getPinIcon = (status) => {
    const icons = {
      lead: '▣',
      proposal: '▤',
      workorder: '▥',
      invoice: '▦',
      completed: '◈'
    }
    return icons[status]
  }

  const getStatusLabel = (status) => {
    const labels = {
      lead: 'LEAD',
      proposal: 'PROPOSAL',
      workorder: 'WORK ORDER',
      invoice: 'INVOICE',
      completed: 'COMPLETED'
    }
    return labels[status]
  }

  const handlePinClick = (pin) => {
    setSelectedPin(selectedPin?.id === pin.id ? null : pin)
  }

  const getPinCount = (status) => {
    return mapPins.filter(pin => pin.status === status).length
  }

  return (
    <div className="map-view-container">
      {/* Header */}
      <div className="map-header">
        <div className="header-left">
          <h1 className="map-title">
            <span className="title-bracket">[</span>
            TACTICAL MAP VIEW
            <span className="title-bracket">]</span>
          </h1>
          <div className="map-subtitle">Geographic Operations Overview</div>
        </div>
        <div className="header-right">
          <TacticalBadge status="completed">GPS ACTIVE</TacticalBadge>
        </div>
      </div>

      {/* Map Controls */}
      <div className="map-controls">
        <TacticalCard>
          <div className="controls-header">
            <span className="section-bracket">[</span>
            WORKFLOW FILTERS
            <span className="section-bracket">]</span>
          </div>

          <div className="filter-grid">
            <div className="filter-item">
              <TacticalCheckbox
                label={`LEADS (${getPinCount('lead')})`}
                checked={filters.lead}
                onChange={() => handleFilterToggle('lead')}
              />
            </div>
            <div className="filter-item">
              <TacticalCheckbox
                label={`PROPOSALS (${getPinCount('proposal')})`}
                checked={filters.proposal}
                onChange={() => handleFilterToggle('proposal')}
              />
            </div>
            <div className="filter-item">
              <TacticalCheckbox
                label={`WORK ORDERS (${getPinCount('workorder')})`}
                checked={filters.workorder}
                onChange={() => handleFilterToggle('workorder')}
              />
            </div>
            <div className="filter-item">
              <TacticalCheckbox
                label={`INVOICES (${getPinCount('invoice')})`}
                checked={filters.invoice}
                onChange={() => handleFilterToggle('invoice')}
              />
            </div>
            <div className="filter-item">
              <TacticalCheckbox
                label={`COMPLETED (${getPinCount('completed')})`}
                checked={filters.completed}
                onChange={() => handleFilterToggle('completed')}
              />
            </div>
          </div>
        </TacticalCard>
      </div>

      {/* Map Container */}
      <div className="map-content">
        <TacticalCard>
          <div className="map-viewport">
            {/* Grid Background */}
            <div className="map-grid">
              {Array.from({ length: 10 }).map((_, row) => (
                <div key={row} className="grid-row">
                  {Array.from({ length: 10 }).map((_, col) => (
                    <div key={col} className="grid-cell"></div>
                  ))}
                </div>
              ))}
            </div>

            {/* Map Pins */}
            <div className="map-pins">
              {filteredPins.map((pin) => (
                <div
                  key={pin.id}
                  className={`map-pin ${selectedPin?.id === pin.id ? 'selected' : ''} ${pin.priority === 'critical' ? 'pulse' : ''}`}
                  style={{
                    left: `${pin.lng}%`,
                    top: `${pin.lat}%`,
                    color: getPinColor(pin.status)
                  }}
                  onClick={() => handlePinClick(pin)}
                >
                  <div className="pin-icon">{getPinIcon(pin.status)}</div>
                  {pin.priority === 'critical' && (
                    <div className="pin-alert">!</div>
                  )}
                </div>
              ))}
            </div>

            {/* Coordinate Grid Labels */}
            <div className="map-coordinates">
              <div className="coord-top">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="coord-label">{i}</div>
                ))}
              </div>
              <div className="coord-left">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="coord-label">{i}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="map-legend">
            <div className="legend-title">
              <span className="section-bracket">[</span>
              LEGEND
              <span className="section-bracket">]</span>
            </div>
            <div className="legend-items">
              <div className="legend-item" style={{ color: getPinColor('lead') }}>
                <span className="legend-icon">▣</span>
                <span className="legend-label">LEAD</span>
              </div>
              <div className="legend-item" style={{ color: getPinColor('proposal') }}>
                <span className="legend-icon">▤</span>
                <span className="legend-label">PROPOSAL</span>
              </div>
              <div className="legend-item" style={{ color: getPinColor('workorder') }}>
                <span className="legend-icon">▥</span>
                <span className="legend-label">WORK ORDER</span>
              </div>
              <div className="legend-item" style={{ color: getPinColor('invoice') }}>
                <span className="legend-icon">▦</span>
                <span className="legend-label">INVOICE</span>
              </div>
              <div className="legend-item" style={{ color: getPinColor('completed') }}>
                <span className="legend-icon">◈</span>
                <span className="legend-label">COMPLETED</span>
              </div>
            </div>
          </div>
        </TacticalCard>
      </div>

      {/* Location Details Panel */}
      {selectedPin && (
        <div className="location-details">
          <TacticalCard variant="info">
            <div className="details-header">
              <div className="section-title">
                <span className="section-bracket">[</span>
                LOCATION DETAILS
                <span className="section-bracket">]</span>
              </div>
              <TacticalButton
                variant="icon"
                onClick={() => setSelectedPin(null)}
              >
                ✕
              </TacticalButton>
            </div>

            <div className="details-content">
              <div className="detail-row">
                <div className="detail-label">STATUS</div>
                <TacticalBadge status={selectedPin.status}>
                  {getStatusLabel(selectedPin.status)}
                </TacticalBadge>
              </div>

              <div className="detail-row">
                <div className="detail-label">CUSTOMER</div>
                <div className="detail-value">{selectedPin.customer}</div>
              </div>

              <div className="detail-row">
                <div className="detail-label">ADDRESS</div>
                <div className="detail-value">{selectedPin.address}</div>
              </div>

              <div className="detail-row">
                <div className="detail-label">SERVICE</div>
                <div className="detail-value">{selectedPin.service}</div>
              </div>

              <div className="detail-row">
                <div className="detail-label">PRIORITY</div>
                <div className="detail-value priority">
                  <TacticalBadge
                    status={selectedPin.priority === 'critical' ? 'invoice' : 'completed'}
                    variant="priority"
                  >
                    {selectedPin.priority.toUpperCase()}
                  </TacticalBadge>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-label">COORDINATES</div>
                <div className="detail-value coordinates">
                  LAT: {selectedPin.lat.toFixed(2)} / LNG: {selectedPin.lng.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="details-actions">
              <TacticalButton variant="primary">
                VIEW FULL DETAILS
              </TacticalButton>
              <TacticalButton variant="secondary">
                GET DIRECTIONS
              </TacticalButton>
            </div>
          </TacticalCard>
        </div>
      )}

      {/* Map Statistics */}
      <div className="map-stats">
        <TacticalCard variant="stat">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">TOTAL PINS</div>
              <div className="stat-value">{filteredPins.length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">ACTIVE FILTERS</div>
              <div className="stat-value">{Object.values(filters).filter(Boolean).length}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">SELECTED</div>
              <div className="stat-value">{selectedPin ? '1' : '0'}</div>
            </div>
          </div>
        </TacticalCard>
      </div>
    </div>
  )
}

export default MapView
