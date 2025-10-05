import { useState } from 'react'
import './ComponentShowcase.css'
import TacticalButton from './components/TacticalButton'
import TacticalInput from './components/TacticalInput'
import TacticalCard from './components/TacticalCard'
import TacticalBadge from './components/TacticalBadge'
import TacticalCheckbox from './components/TacticalCheckbox'
import TacticalToggle from './components/TacticalToggle'
import TacticalRadio from './components/TacticalRadio'
import TacticalTable from './components/TacticalTable'
import TacticalList from './components/TacticalList'
import TacticalTabs from './components/TacticalTabs'
import TacticalModal from './components/TacticalModal'
import TacticalToast from './components/TacticalToast'
import TacticalSpinner from './components/TacticalSpinner'
import TacticalProgress from './components/TacticalProgress'
import TacticalDropdown from './components/TacticalDropdown'
import TacticalBreadcrumbs from './components/TacticalBreadcrumbs'
import TacticalPagination from './components/TacticalPagination'
import TacticalDivider from './components/TacticalDivider'
import TacticalAccordion from './components/TacticalAccordion'

const ComponentShowcase = () => {
  const [currentComponent, setCurrentComponent] = useState('buttons')
  const [inputValue, setInputValue] = useState('')
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [toggleChecked, setToggleChecked] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [modalOpen, setModalOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const components = [
    { id: 'buttons', name: 'BUTTONS', desc: 'Action triggers' },
    { id: 'inputs', name: 'INPUTS', desc: 'Form fields' },
    { id: 'cards', name: 'CARDS', desc: 'Content containers' },
    { id: 'badges', name: 'BADGES', desc: 'Status indicators' },
    { id: 'forms', name: 'FORM CONTROLS', desc: 'Checkbox, Toggle, Radio' },
    { id: 'data', name: 'DATA DISPLAY', desc: 'Table, List, Tabs' },
    { id: 'feedback', name: 'FEEDBACK', desc: 'Modal, Toast, Spinner' },
    { id: 'navigation', name: 'NAVIGATION', desc: 'Dropdown, Breadcrumbs, Pagination' },
    { id: 'layout', name: 'LAYOUT', desc: 'Divider, Accordion' }
  ]

  return (
    <div className="showcase-tactical">
      <div className="showcase-grid"></div>

      {/* Header */}
      <header className="showcase-header">
        <div className="showcase-logo">
          <div className="logo-brackets">[</div>
          <div className="logo-text">COMPONENT LIBRARY</div>
          <div className="logo-brackets">]</div>
        </div>
        <div className="showcase-status">
          <span className="status-label">MODE:</span>
          <span className="status-value online">APPROVAL</span>
        </div>
      </header>

      {/* Component Navigation */}
      <nav className="component-nav">
        {components.map(comp => (
          <button
            key={comp.id}
            className={`nav-btn ${currentComponent === comp.id ? 'active' : ''}`}
            onClick={() => setCurrentComponent(comp.id)}
          >
            <div className="nav-btn-name">{comp.name}</div>
            <div className="nav-btn-desc">{comp.desc}</div>
          </button>
        ))}
      </nav>

      {/* Component Display */}
      <main className="component-display">
        <div className="display-title">
          <span className="title-bracket">{'['}</span>
          {components.find(c => c.id === currentComponent)?.name}
          <span className="title-bracket">{']'}</span>
        </div>

        <div className="display-content">
          {/* BUTTONS */}
          {currentComponent === 'buttons' && (
            <div className="component-section">
              <div className="section-header">
                <h3>PRIMARY BUTTONS</h3>
                <p>Main action triggers with green accent</p>
              </div>
              <div className="component-grid">
                <TacticalButton variant="primary">EXECUTE MISSION</TacticalButton>
                <TacticalButton variant="primary" disabled>DISABLED STATE</TacticalButton>
              </div>

              <div className="section-header">
                <h3>SECONDARY BUTTONS</h3>
                <p>Alternative actions with outline style</p>
              </div>
              <div className="component-grid">
                <TacticalButton variant="secondary">CANCEL OPERATION</TacticalButton>
                <TacticalButton variant="secondary" disabled>DISABLED STATE</TacticalButton>
              </div>

              <div className="section-header">
                <h3>ICON BUTTONS</h3>
                <p>Compact action buttons</p>
              </div>
              <div className="component-grid">
                <TacticalButton variant="icon">◉</TacticalButton>
                <TacticalButton variant="icon">⊕</TacticalButton>
                <TacticalButton variant="icon">⊗</TacticalButton>
                <TacticalButton variant="icon">⟳</TacticalButton>
              </div>
            </div>
          )}

          {/* INPUTS */}
          {currentComponent === 'inputs' && (
            <div className="component-section">
              <div className="section-header">
                <h3>TEXT INPUT</h3>
                <p>Standard text entry field</p>
              </div>
              <div className="component-grid vertical">
                <TacticalInput
                  label="CALL SIGN"
                  placeholder="Enter operator call sign"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <TacticalInput
                  label="COORDINATES"
                  placeholder="LAT, LONG"
                  disabled
                />
              </div>

              <div className="section-header">
                <h3>TEXTAREA</h3>
                <p>Multi-line text input</p>
              </div>
              <div className="component-grid vertical">
                <TacticalInput
                  label="MISSION BRIEFING"
                  type="textarea"
                  placeholder="Enter mission details..."
                  rows={4}
                />
              </div>

              <div className="section-header">
                <h3>SELECT</h3>
                <p>Dropdown selection field</p>
              </div>
              <div className="component-grid vertical">
                <TacticalInput
                  label="PRIORITY LEVEL"
                  type="select"
                  options={[
                    { value: 'low', label: 'LOW' },
                    { value: 'medium', label: 'MEDIUM' },
                    { value: 'high', label: 'HIGH' },
                    { value: 'critical', label: 'CRITICAL' }
                  ]}
                />
              </div>
            </div>
          )}

          {/* CARDS */}
          {currentComponent === 'cards' && (
            <div className="component-section">
              <div className="section-header">
                <h3>INFO CARD</h3>
                <p>Standard information container</p>
              </div>
              <TacticalCard>
                <h4>OPERATION ALPHA</h4>
                <p>Mission Status: ACTIVE</p>
                <p>Priority: HIGH</p>
                <p>ETA: 0400 HOURS</p>
              </TacticalCard>

              <div className="section-header">
                <h3>STAT CARD</h3>
                <p>Metric display card</p>
              </div>
              <TacticalCard variant="stat">
                <div className="stat-label">ACTIVE OPERATIONS</div>
                <div className="stat-value">28</div>
                <div className="stat-change">+3 FROM LAST HOUR</div>
              </TacticalCard>

              <div className="section-header">
                <h3>ALERT CARD</h3>
                <p>Warning or alert container</p>
              </div>
              <TacticalCard variant="alert">
                <div className="alert-icon">⚠</div>
                <div className="alert-content">
                  <h4>SYSTEM ALERT</h4>
                  <p>Equipment maintenance required for Unit-03</p>
                </div>
              </TacticalCard>
            </div>
          )}

          {/* BADGES */}
          {currentComponent === 'badges' && (
            <div className="component-section">
              <div className="section-header">
                <h3>STATUS BADGES</h3>
                <p>Workflow stage indicators</p>
              </div>
              <div className="component-grid">
                <TacticalBadge status="lead">LEAD</TacticalBadge>
                <TacticalBadge status="proposal">PROPOSAL</TacticalBadge>
                <TacticalBadge status="workorder">WORK ORDER</TacticalBadge>
                <TacticalBadge status="invoice">INVOICE</TacticalBadge>
                <TacticalBadge status="completed">COMPLETED</TacticalBadge>
              </div>

              <div className="section-header">
                <h3>COUNT BADGES</h3>
                <p>Numerical indicators</p>
              </div>
              <div className="component-grid">
                <TacticalBadge variant="count">12</TacticalBadge>
                <TacticalBadge variant="count">5</TacticalBadge>
                <TacticalBadge variant="count">99+</TacticalBadge>
              </div>

              <div className="section-header">
                <h3>PRIORITY BADGES</h3>
                <p>Task priority levels</p>
              </div>
              <div className="component-grid">
                <TacticalBadge priority="low">LOW</TacticalBadge>
                <TacticalBadge priority="medium">MEDIUM</TacticalBadge>
                <TacticalBadge priority="high">HIGH</TacticalBadge>
                <TacticalBadge priority="critical">CRITICAL</TacticalBadge>
              </div>
            </div>
          )}

          {/* FORM CONTROLS */}
          {currentComponent === 'forms' && (
            <div className="component-section">
              <div className="section-header">
                <h3>CHECKBOX</h3>
                <p>Selection boxes for multiple choices</p>
              </div>
              <div className="component-grid vertical">
                <TacticalCheckbox
                  label="Enable Notifications"
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                />
                <TacticalCheckbox label="Read and Accepted" checked disabled />
              </div>

              <div className="section-header">
                <h3>TOGGLE SWITCH</h3>
                <p>On/off switches</p>
              </div>
              <div className="component-grid vertical">
                <TacticalToggle
                  label="System Active"
                  checked={toggleChecked}
                  onChange={(e) => setToggleChecked(e.target.checked)}
                />
                <TacticalToggle label="Auto-Deploy" checked={false} disabled />
              </div>

              <div className="section-header">
                <h3>RADIO BUTTONS</h3>
                <p>Single choice selection</p>
              </div>
              <div className="component-grid">
                <TacticalRadio
                  label="Option Alpha"
                  name="demo"
                  value="option1"
                  checked={radioValue === 'option1'}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
                <TacticalRadio
                  label="Option Bravo"
                  name="demo"
                  value="option2"
                  checked={radioValue === 'option2'}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
                <TacticalRadio
                  label="Option Charlie"
                  name="demo"
                  value="option3"
                  checked={radioValue === 'option3'}
                  onChange={(e) => setRadioValue(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* DATA DISPLAY */}
          {currentComponent === 'data' && (
            <div className="component-section">
              <div className="section-header">
                <h3>TABLE</h3>
                <p>Data grid for structured information</p>
              </div>
              <TacticalTable
                columns={[
                  { key: 'id', label: 'ID', width: '80px' },
                  { key: 'name', label: 'OPERATOR', width: '200px' },
                  { key: 'status', label: 'STATUS', width: '120px' },
                  { key: 'mission', label: 'MISSION' }
                ]}
                data={[
                  { id: '001', name: 'ALPHA-7', status: 'ACTIVE', mission: 'RECON NORTH' },
                  { id: '002', name: 'BRAVO-3', status: 'STANDBY', mission: 'PATROL EAST' },
                  { id: '003', name: 'CHARLIE-9', status: 'ACTIVE', mission: 'SECURE PERIMETER' }
                ]}
              />

              <div className="section-header">
                <h3>LIST</h3>
                <p>Ordered and unordered lists</p>
              </div>
              <TacticalList
                items={['FIRST OBJECTIVE', 'SECOND OBJECTIVE', 'THIRD OBJECTIVE']}
              />

              <div className="section-header">
                <h3>TABS</h3>
                <p>Content organization with tab navigation</p>
              </div>
              <TacticalTabs
                tabs={[
                  { id: 'intel', label: 'INTEL', content: <p>Intelligence briefing data goes here...</p> },
                  { id: 'ops', label: 'OPERATIONS', content: <p>Operational details and status...</p> },
                  { id: 'assets', label: 'ASSETS', content: <p>Asset inventory and allocation...</p> }
                ]}
              />
            </div>
          )}

          {/* FEEDBACK */}
          {currentComponent === 'feedback' && (
            <div className="component-section">
              <div className="section-header">
                <h3>MODAL</h3>
                <p>Dialog windows for important actions</p>
              </div>
              <TacticalButton variant="primary" onClick={() => setModalOpen(true)}>
                OPEN MODAL
              </TacticalButton>
              <TacticalModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="MISSION BRIEFING"
              >
                <p>Objective: Secure the designated area and report status.</p>
                <p>Authorization Code: ALPHA-7-BRAVO</p>
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <TacticalButton variant="primary" onClick={() => setModalOpen(false)}>
                    CONFIRM
                  </TacticalButton>
                  <TacticalButton variant="secondary" onClick={() => setModalOpen(false)}>
                    CANCEL
                  </TacticalButton>
                </div>
              </TacticalModal>

              <div className="section-header">
                <h3>TOAST</h3>
                <p>Temporary notifications</p>
              </div>
              <TacticalButton variant="primary" onClick={() => setToastVisible(true)}>
                SHOW TOAST
              </TacticalButton>
              <TacticalToast
                type="success"
                message="Operation completed successfully"
                isVisible={toastVisible}
                onClose={() => setToastVisible(false)}
              />

              <div className="section-header">
                <h3>SPINNER</h3>
                <p>Loading indicators</p>
              </div>
              <div className="component-grid">
                <TacticalSpinner size="small" label="LOADING" />
                <TacticalSpinner size="medium" label="PROCESSING" />
                <TacticalSpinner size="large" label="DEPLOYING" />
              </div>

              <div className="section-header">
                <h3>PROGRESS</h3>
                <p>Progress bars for tracking completion</p>
              </div>
              <div className="component-grid vertical">
                <TacticalProgress value={30} label="MISSION ALPHA" />
                <TacticalProgress value={65} label="MISSION BRAVO" />
                <TacticalProgress value={100} label="MISSION CHARLIE" />
              </div>
            </div>
          )}

          {/* NAVIGATION */}
          {currentComponent === 'navigation' && (
            <div className="component-section">
              <div className="section-header">
                <h3>DROPDOWN</h3>
                <p>Context menus and action lists</p>
              </div>
              <TacticalDropdown
                trigger={<TacticalButton variant="secondary">ACTIONS ▼</TacticalButton>}
                items={[
                  { label: 'VIEW DETAILS', value: 'view' },
                  { label: 'EDIT ENTRY', value: 'edit' },
                  { label: 'DELETE', value: 'delete' }
                ]}
              />

              <div className="section-header">
                <h3>BREADCRUMBS</h3>
                <p>Navigation trail showing current location</p>
              </div>
              <TacticalBreadcrumbs
                items={[
                  { label: 'HOME', href: '#' },
                  { label: 'OPERATIONS', href: '#' },
                  { label: 'MISSION ALPHA', href: '#' },
                  { label: 'DETAILS' }
                ]}
              />

              <div className="section-header">
                <h3>PAGINATION</h3>
                <p>Page navigation for large datasets</p>
              </div>
              <TacticalPagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* LAYOUT */}
          {currentComponent === 'layout' && (
            <div className="component-section">
              <div className="section-header">
                <h3>DIVIDER</h3>
                <p>Section separators</p>
              </div>
              <TacticalDivider />
              <TacticalDivider label="WITH LABEL" />
              <TacticalDivider variant="dashed" />
              <TacticalDivider variant="dotted" label="DOTTED STYLE" />

              <div className="section-header">
                <h3>ACCORDION</h3>
                <p>Collapsible content sections</p>
              </div>
              <TacticalAccordion
                items={[
                  {
                    title: 'MISSION OBJECTIVES',
                    content: 'Complete reconnaissance of designated sector and report findings.'
                  },
                  {
                    title: 'RESOURCE ALLOCATION',
                    content: '3 tactical units, 2 support vehicles, 1 communications officer.'
                  },
                  {
                    title: 'TIMELINE',
                    content: 'Deploy at 0600, complete by 1800, debrief at 1900.'
                  }
                ]}
              />
            </div>
          )}
        </div>

        {/* Approval Footer */}
        <div className="approval-footer">
          <TacticalButton variant="secondary">
            ← PREVIOUS
          </TacticalButton>
          <TacticalButton variant="primary">
            APPROVE & CONTINUE →
          </TacticalButton>
        </div>
      </main>
    </div>
  )
}

export default ComponentShowcase
