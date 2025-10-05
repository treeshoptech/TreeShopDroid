import { useState } from 'react'
import ComponentShowcase from './ComponentShowcase'
import Dashboard from './pages/Dashboard'
import MapView from './pages/MapView'
import Calendar from './pages/Calendar'
import Customers from './pages/Customers'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Help from './pages/Help'
import LeadForm from './pages/LeadForm'
import ProposalBuilder from './pages/ProposalBuilder'
import WorkOrderForm from './pages/WorkOrderForm'
import InvoiceGenerator from './pages/InvoiceGenerator'
import TacticalNavMenu from './components/TacticalNavMenu'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard', 'map', 'components', 'lead-form', 'proposal', 'work-order', 'invoice'
  const [isNavOpen, setIsNavOpen] = useState(false)

  const handleLeadSubmit = (formData) => {
    console.log('Lead submitted:', formData)
    alert('Lead created successfully!')
  }

  const handleProposalSubmit = (proposalData) => {
    console.log('Proposal submitted:', proposalData)
    alert('Proposal generated successfully!')
  }

  const handleWorkOrderSubmit = (workOrderData) => {
    console.log('Work Order submitted:', workOrderData)
    alert('Work Order created successfully!')
  }

  const handleInvoiceSubmit = (invoiceData) => {
    console.log('Invoice submitted:', invoiceData)
    alert('Invoice generated successfully!')
  }

  const handleNavigate = (viewId) => {
    setCurrentView(viewId)
  }

  return (
    <div className="app">
      {/* View Switcher */}
      <div className="view-switcher">
        <button
          className={currentView === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentView('dashboard')}
        >
          DASHBOARD
        </button>
        <button
          className={currentView === 'map' ? 'active' : ''}
          onClick={() => setCurrentView('map')}
        >
          MAP
        </button>
        <button
          className={currentView === 'components' ? 'active' : ''}
          onClick={() => setCurrentView('components')}
        >
          COMPONENTS
        </button>
        <button
          className={currentView === 'lead-form' ? 'active' : ''}
          onClick={() => setCurrentView('lead-form')}
        >
          LEAD
        </button>
        <button
          className={currentView === 'proposal' ? 'active' : ''}
          onClick={() => setCurrentView('proposal')}
        >
          PROPOSAL
        </button>
        <button
          className={currentView === 'work-order' ? 'active' : ''}
          onClick={() => setCurrentView('work-order')}
        >
          WORK ORDER
        </button>
        <button
          className={currentView === 'invoice' ? 'active' : ''}
          onClick={() => setCurrentView('invoice')}
        >
          INVOICE
        </button>
        <button
          className="menu-btn"
          onClick={() => setIsNavOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* Render Current View */}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'map' && <MapView />}
      {currentView === 'calendar' && <Calendar />}
      {currentView === 'customers' && <Customers />}
      {currentView === 'reports' && <Reports />}
      {currentView === 'settings' && <Settings />}
      {currentView === 'help' && <Help />}
      {currentView === 'components' && <ComponentShowcase />}
      {currentView === 'lead-form' && (
        <LeadForm
          onSubmit={handleLeadSubmit}
          onCancel={() => console.log('Cancelled')}
        />
      )}
      {currentView === 'proposal' && (
        <ProposalBuilder
          onSubmit={handleProposalSubmit}
          onCancel={() => console.log('Cancelled')}
        />
      )}
      {currentView === 'work-order' && (
        <WorkOrderForm
          onSubmit={handleWorkOrderSubmit}
          onCancel={() => console.log('Cancelled')}
        />
      )}
      {currentView === 'invoice' && (
        <InvoiceGenerator
          onSubmit={handleInvoiceSubmit}
          onCancel={() => console.log('Cancelled')}
        />
      )}

      {/* Tactical Navigation Menu */}
      <TacticalNavMenu
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        onNavigate={handleNavigate}
        currentView={currentView}
      />
    </div>
  )
}

export default App
