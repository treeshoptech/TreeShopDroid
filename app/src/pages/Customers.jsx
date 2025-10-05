import { useState } from 'react'
import './Customers.css'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalButton from '../components/TacticalButton'
import TacticalInput from '../components/TacticalInput'
import TacticalTable from '../components/TacticalTable'
import TacticalModal from '../components/TacticalModal'

const Customers = () => {
  // Mock customer data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Oak St, Springfield, IL 62701',
      status: 'active',
      totalJobs: 5,
      totalRevenue: 12450,
      lastJob: '2025-09-15',
      createdDate: '2024-03-12',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      phone: '(555) 234-5678',
      email: 'sarah.j@email.com',
      address: '456 Pine Ave, Springfield, IL 62702',
      status: 'active',
      totalJobs: 3,
      totalRevenue: 8900,
      lastJob: '2025-08-22',
      createdDate: '2024-05-20',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Mike Davis',
      phone: '(555) 345-6789',
      email: 'mike.davis@email.com',
      address: '789 Maple Dr, Springfield, IL 62703',
      status: 'active',
      totalJobs: 8,
      totalRevenue: 18750,
      lastJob: '2025-10-01',
      createdDate: '2023-11-08',
      priority: 'high'
    },
    {
      id: 4,
      name: 'Lisa Brown',
      phone: '(555) 456-7890',
      email: 'lisa.brown@email.com',
      address: '321 Elm Rd, Springfield, IL 62704',
      status: 'inactive',
      totalJobs: 2,
      totalRevenue: 4200,
      lastJob: '2024-12-15',
      createdDate: '2024-08-03',
      priority: 'low'
    },
    {
      id: 5,
      name: 'Tom Wilson',
      phone: '(555) 567-8901',
      email: 'tom.wilson@email.com',
      address: '654 Cedar Ln, Springfield, IL 62705',
      status: 'active',
      totalJobs: 12,
      totalRevenue: 32400,
      lastJob: '2025-09-28',
      createdDate: '2023-06-15',
      priority: 'high'
    },
    {
      id: 6,
      name: 'Robert Martinez',
      phone: '(555) 678-9012',
      email: 'robert.m@email.com',
      address: '987 Birch Way, Springfield, IL 62706',
      status: 'active',
      totalJobs: 4,
      totalRevenue: 9800,
      lastJob: '2025-09-10',
      createdDate: '2024-02-28',
      priority: 'medium'
    },
    {
      id: 7,
      name: 'Jennifer Lee',
      phone: '(555) 789-0123',
      email: 'jennifer.lee@email.com',
      address: '147 Spruce Ct, Springfield, IL 62707',
      status: 'lead',
      totalJobs: 0,
      totalRevenue: 0,
      lastJob: null,
      createdDate: '2025-10-02',
      priority: 'medium'
    },
    {
      id: 8,
      name: 'David Anderson',
      phone: '(555) 890-1234',
      email: 'david.a@email.com',
      address: '258 Willow Pl, Springfield, IL 62708',
      status: 'active',
      totalJobs: 6,
      totalRevenue: 14500,
      lastJob: '2025-09-05',
      createdDate: '2024-01-17',
      priority: 'medium'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('view') // 'view', 'add', 'edit'

  // Filter and search customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Table columns
  const columns = [
    { key: 'name', label: 'CUSTOMER NAME', sortable: true },
    { key: 'phone', label: 'PHONE', sortable: false },
    { key: 'email', label: 'EMAIL', sortable: false },
    { key: 'status', label: 'STATUS', sortable: true },
    { key: 'totalJobs', label: 'JOBS', sortable: true },
    { key: 'totalRevenue', label: 'REVENUE', sortable: true },
    { key: 'lastJob', label: 'LAST JOB', sortable: true },
    { key: 'actions', label: 'ACTIONS', sortable: false }
  ]

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setModalMode('add')
    setIsModalOpen(true)
  }

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleDeleteCustomer = (customerId) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== customerId))
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      active: 'workorder',
      inactive: 'completed',
      lead: 'lead'
    }
    return statusMap[status] || 'completed'
  }

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      high: 'invoice',
      medium: 'proposal',
      low: 'completed'
    }
    return priorityMap[priority] || 'completed'
  }

  return (
    <div className="customers-container">
      {/* Header */}
      <div className="customers-header">
        <div className="header-left">
          <h1 className="customers-title">
            <span className="title-bracket">[</span>
            CUSTOMER DATABASE
            <span className="title-bracket">]</span>
          </h1>
          <div className="customers-subtitle">Client Management System</div>
        </div>
        <div className="header-right">
          <TacticalButton variant="primary" onClick={handleAddCustomer}>
            + ADD CUSTOMER
          </TacticalButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="customers-stats">
        <TacticalCard variant="stat">
          <div className="stat-item">
            <div className="stat-value">{customers.length}</div>
            <div className="stat-label">TOTAL CUSTOMERS</div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="stat-item">
            <div className="stat-value">{customers.filter(c => c.status === 'active').length}</div>
            <div className="stat-label">ACTIVE CUSTOMERS</div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="stat-item">
            <div className="stat-value">{customers.filter(c => c.status === 'lead').length}</div>
            <div className="stat-label">NEW LEADS</div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="stat-item">
            <div className="stat-value">
              ${customers.reduce((sum, c) => sum + c.totalRevenue, 0).toLocaleString()}
            </div>
            <div className="stat-label">TOTAL REVENUE</div>
          </div>
        </TacticalCard>
      </div>

      {/* Search and Filters */}
      <TacticalCard>
        <div className="search-filters">
          <div className="search-section">
            <TacticalInput
              label="SEARCH CUSTOMERS"
              placeholder="Name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-section">
            <TacticalInput
              label="STATUS FILTER"
              type="select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Customers' },
                { value: 'active', label: 'Active Only' },
                { value: 'inactive', label: 'Inactive Only' },
                { value: 'lead', label: 'Leads Only' }
              ]}
            />
          </div>

          <div className="results-count">
            <span className="count-value">{filteredCustomers.length}</span>
            <span className="count-label">RESULTS</span>
          </div>
        </div>
      </TacticalCard>

      {/* Customers Table */}
      <TacticalCard>
        <div className="table-container">
          <table className="customers-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} onClick={() => handleViewCustomer(customer)}>
                  <td className="customer-name">
                    <div className="name-cell">
                      <span className="name">{customer.name}</span>
                      {customer.priority === 'high' && (
                        <span className="priority-indicator">★</span>
                      )}
                    </div>
                  </td>
                  <td>{customer.phone}</td>
                  <td className="email-cell">{customer.email}</td>
                  <td>
                    <TacticalBadge status={getStatusBadge(customer.status)}>
                      {customer.status.toUpperCase()}
                    </TacticalBadge>
                  </td>
                  <td className="jobs-count">{customer.totalJobs}</td>
                  <td className="revenue-cell">${customer.totalRevenue.toLocaleString()}</td>
                  <td className="date-cell">{customer.lastJob || 'No jobs yet'}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <TacticalButton
                        variant="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditCustomer(customer)
                        }}
                      >
                        ✎
                      </TacticalButton>
                      <TacticalButton
                        variant="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCustomer(customer.id)
                        }}
                      >
                        ⊗
                      </TacticalButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCustomers.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">◈</div>
              <div className="no-results-text">No customers found</div>
            </div>
          )}
        </div>
      </TacticalCard>

      {/* Customer Details Modal */}
      <TacticalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'ADD NEW CUSTOMER' : modalMode === 'edit' ? 'EDIT CUSTOMER' : 'CUSTOMER DETAILS'}
      >
        {selectedCustomer && modalMode === 'view' && (
          <div className="customer-details">
            <div className="details-section">
              <div className="section-title">
                <span className="section-bracket">[</span>
                CONTACT INFORMATION
                <span className="section-bracket">]</span>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">NAME</div>
                  <div className="detail-value">{selectedCustomer.name}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">PHONE</div>
                  <div className="detail-value">{selectedCustomer.phone}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">EMAIL</div>
                  <div className="detail-value">{selectedCustomer.email}</div>
                </div>
                <div className="detail-item full-width">
                  <div className="detail-label">ADDRESS</div>
                  <div className="detail-value">{selectedCustomer.address}</div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <div className="section-title">
                <span className="section-bracket">[</span>
                CUSTOMER STATUS
                <span className="section-bracket">]</span>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">STATUS</div>
                  <div className="detail-value">
                    <TacticalBadge status={getStatusBadge(selectedCustomer.status)}>
                      {selectedCustomer.status.toUpperCase()}
                    </TacticalBadge>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">PRIORITY</div>
                  <div className="detail-value">
                    <TacticalBadge status={getPriorityBadge(selectedCustomer.priority)} variant="priority">
                      {selectedCustomer.priority.toUpperCase()}
                    </TacticalBadge>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">CUSTOMER SINCE</div>
                  <div className="detail-value">{selectedCustomer.createdDate}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">LAST JOB</div>
                  <div className="detail-value">{selectedCustomer.lastJob || 'No jobs yet'}</div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <div className="section-title">
                <span className="section-bracket">[</span>
                BUSINESS METRICS
                <span className="section-bracket">]</span>
              </div>

              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-value">{selectedCustomer.totalJobs}</div>
                  <div className="metric-label">TOTAL JOBS</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">${selectedCustomer.totalRevenue.toLocaleString()}</div>
                  <div className="metric-label">TOTAL REVENUE</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">
                    ${selectedCustomer.totalJobs > 0 ? (selectedCustomer.totalRevenue / selectedCustomer.totalJobs).toFixed(0) : 0}
                  </div>
                  <div className="metric-label">AVG JOB VALUE</div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <TacticalButton variant="primary" onClick={() => {
                setModalMode('edit')
              }}>
                EDIT CUSTOMER
              </TacticalButton>
              <TacticalButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                CLOSE
              </TacticalButton>
            </div>
          </div>
        )}

        {(modalMode === 'add' || modalMode === 'edit') && (
          <div className="customer-form">
            <p className="form-placeholder">Customer form would go here (similar to LeadForm)</p>
            <TacticalButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              CLOSE
            </TacticalButton>
          </div>
        )}
      </TacticalModal>
    </div>
  )
}

export default Customers
