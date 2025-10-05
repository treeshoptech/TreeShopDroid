import { useState } from 'react'
import './Settings.css'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalButton from '../components/TacticalButton'
import TacticalInput from '../components/TacticalInput'
import TacticalToggle from '../components/TacticalToggle'
import TacticalDivider from '../components/TacticalDivider'

const Settings = () => {
  const [settings, setSettings] = useState({
    // Company Info
    companyName: 'TreeShop Services',
    email: 'info@treeshop.com',
    phone: '(555) 123-4567',
    address: '123 Business St, Springfield, IL 62701',
    website: 'www.treeshop.com',

    // Financial
    taxRate: 8.5,
    defaultPaymentTerms: 'Net 30',
    currency: 'USD',
    lateFeePercent: 1.5,
    gracePeriodDays: 5,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    newLeadAlert: true,
    jobCompletionAlert: true,
    paymentReceivedAlert: true,
    overdueInvoiceAlert: true,

    // Display
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12hr',
    theme: 'tactical',
    compactView: false,

    // Business Hours
    businessHoursStart: '08:00',
    businessHoursEnd: '17:00',
    workDays: ['mon', 'tue', 'wed', 'thu', 'fri']
  })

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
    alert('Settings saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Reset all settings to default values?')) {
      // Reset to defaults
      console.log('Resetting settings')
    }
  }

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div className="header-left">
          <h1 className="settings-title">
            <span className="title-bracket">[</span>
            SYSTEM SETTINGS
            <span className="title-bracket">]</span>
          </h1>
          <div className="settings-subtitle">Configuration & Preferences</div>
        </div>
        <div className="header-right">
          <TacticalBadge status="completed">AUTHENTICATED</TacticalBadge>
        </div>
      </div>

      {/* Company Information */}
      <TacticalCard>
        <div className="section-title">
          <span className="section-bracket">[</span>
          COMPANY INFORMATION
          <span className="section-bracket">]</span>
        </div>

        <div className="settings-grid">
          <TacticalInput
            label="Company Name"
            value={settings.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
          />
          <TacticalInput
            label="Email Address"
            type="email"
            value={settings.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <TacticalInput
            label="Phone Number"
            value={settings.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <TacticalInput
            label="Website"
            value={settings.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
          <div className="full-width">
            <TacticalInput
              label="Business Address"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </div>
      </TacticalCard>

      {/* Financial Settings */}
      <TacticalCard>
        <div className="section-title">
          <span className="section-bracket">[</span>
          FINANCIAL SETTINGS
          <span className="section-bracket">]</span>
        </div>

        <div className="settings-grid">
          <TacticalInput
            label="Default Tax Rate (%)"
            type="text"
            value={settings.taxRate}
            onChange={(e) => handleChange('taxRate', e.target.value)}
          />
          <TacticalInput
            label="Payment Terms"
            type="select"
            value={settings.defaultPaymentTerms}
            onChange={(e) => handleChange('defaultPaymentTerms', e.target.value)}
            options={[
              { value: 'Net 15', label: 'Net 15' },
              { value: 'Net 30', label: 'Net 30' },
              { value: 'Net 60', label: 'Net 60' },
              { value: 'Due on Receipt', label: 'Due on Receipt' }
            ]}
          />
          <TacticalInput
            label="Currency"
            type="select"
            value={settings.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            options={[
              { value: 'USD', label: 'USD ($)' },
              { value: 'CAD', label: 'CAD ($)' },
              { value: 'EUR', label: 'EUR (€)' },
              { value: 'GBP', label: 'GBP (£)' }
            ]}
          />
        </div>

        <TacticalDivider label="LATE FEE SETTINGS" />

        <div className="settings-grid">
          <TacticalInput
            label="Late Fee (%)"
            type="text"
            value={settings.lateFeePercent}
            onChange={(e) => handleChange('lateFeePercent', e.target.value)}
          />
          <TacticalInput
            label="Grace Period (Days)"
            type="text"
            value={settings.gracePeriodDays}
            onChange={(e) => handleChange('gracePeriodDays', e.target.value)}
          />
        </div>
      </TacticalCard>

      {/* Notification Settings */}
      <TacticalCard>
        <div className="section-title">
          <span className="section-bracket">[</span>
          NOTIFICATION SETTINGS
          <span className="section-bracket">]</span>
        </div>

        <div className="toggle-grid">
          <TacticalToggle
            label="Email Notifications"
            checked={settings.emailNotifications}
            onChange={(checked) => handleChange('emailNotifications', checked)}
          />
          <TacticalToggle
            label="SMS Notifications"
            checked={settings.smsNotifications}
            onChange={(checked) => handleChange('smsNotifications', checked)}
          />
        </div>

        <TacticalDivider label="ALERT TYPES" />

        <div className="toggle-grid">
          <TacticalToggle
            label="New Lead Alerts"
            checked={settings.newLeadAlert}
            onChange={(checked) => handleChange('newLeadAlert', checked)}
          />
          <TacticalToggle
            label="Job Completion Alerts"
            checked={settings.jobCompletionAlert}
            onChange={(checked) => handleChange('jobCompletionAlert', checked)}
          />
          <TacticalToggle
            label="Payment Received Alerts"
            checked={settings.paymentReceivedAlert}
            onChange={(checked) => handleChange('paymentReceivedAlert', checked)}
          />
          <TacticalToggle
            label="Overdue Invoice Alerts"
            checked={settings.overdueInvoiceAlert}
            onChange={(checked) => handleChange('overdueInvoiceAlert', checked)}
          />
        </div>
      </TacticalCard>

      {/* Display Settings */}
      <TacticalCard>
        <div className="section-title">
          <span className="section-bracket">[</span>
          DISPLAY SETTINGS
          <span className="section-bracket">]</span>
        </div>

        <div className="settings-grid">
          <TacticalInput
            label="Date Format"
            type="select"
            value={settings.dateFormat}
            onChange={(e) => handleChange('dateFormat', e.target.value)}
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
            ]}
          />
          <TacticalInput
            label="Time Format"
            type="select"
            value={settings.timeFormat}
            onChange={(e) => handleChange('timeFormat', e.target.value)}
            options={[
              { value: '12hr', label: '12 Hour' },
              { value: '24hr', label: '24 Hour' }
            ]}
          />
          <TacticalInput
            label="Theme"
            type="select"
            value={settings.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            options={[
              { value: 'tactical', label: 'Tactical Operator' },
              { value: 'dark', label: 'Dark Mode' },
              { value: 'light', label: 'Light Mode' }
            ]}
          />
        </div>

        <div className="toggle-grid">
          <TacticalToggle
            label="Compact View Mode"
            checked={settings.compactView}
            onChange={(checked) => handleChange('compactView', checked)}
          />
        </div>
      </TacticalCard>

      {/* Business Hours */}
      <TacticalCard>
        <div className="section-title">
          <span className="section-bracket">[</span>
          BUSINESS HOURS
          <span className="section-bracket">]</span>
        </div>

        <div className="settings-grid">
          <TacticalInput
            label="Start Time"
            type="text"
            value={settings.businessHoursStart}
            onChange={(e) => handleChange('businessHoursStart', e.target.value)}
            placeholder="08:00"
          />
          <TacticalInput
            label="End Time"
            type="text"
            value={settings.businessHoursEnd}
            onChange={(e) => handleChange('businessHoursEnd', e.target.value)}
            placeholder="17:00"
          />
        </div>

        <div className="workdays-section">
          <div className="workdays-label">WORK DAYS</div>
          <div className="workdays-grid">
            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
              <button
                key={day}
                className={`workday-btn ${settings.workDays.includes(day) ? 'active' : ''}`}
                onClick={() => {
                  const newWorkDays = settings.workDays.includes(day)
                    ? settings.workDays.filter(d => d !== day)
                    : [...settings.workDays, day]
                  handleChange('workDays', newWorkDays)
                }}
              >
                {day.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </TacticalCard>

      {/* Action Buttons */}
      <div className="settings-actions">
        <TacticalButton variant="secondary" onClick={handleReset}>
          RESET TO DEFAULTS
        </TacticalButton>
        <TacticalButton variant="primary" onClick={handleSave}>
          SAVE SETTINGS
        </TacticalButton>
      </div>
    </div>
  )
}

export default Settings
