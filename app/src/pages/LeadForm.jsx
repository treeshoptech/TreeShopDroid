import { useState } from 'react'
import './LeadForm.css'
import TacticalButton from '../components/TacticalButton'
import TacticalInput from '../components/TacticalInput'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalDivider from '../components/TacticalDivider'
import TacticalCheckbox from '../components/TacticalCheckbox'

const LeadForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    // Customer Info
    customerName: initialData.customerName || '',
    phone: initialData.phone || '',
    email: initialData.email || '',

    // Property Info
    propertyAddress: initialData.propertyAddress || '',
    city: initialData.city || '',
    state: initialData.state || '',
    zipCode: initialData.zipCode || '',

    // Service Details
    serviceType: initialData.serviceType || '',
    priority: initialData.priority || 'medium',
    urgency: initialData.urgency || false,

    // Additional Info
    source: initialData.source || '',
    description: initialData.description || '',
    estimatedTreeCount: initialData.estimatedTreeCount || '',
    propertyType: initialData.propertyType || ''
  })

  const serviceTypes = [
    { value: 'removal', label: 'Tree Removal' },
    { value: 'trimming', label: 'Tree Trimming' },
    { value: 'stump', label: 'Stump Grinding' },
    { value: 'mulching', label: 'Forestry Mulching' },
    { value: 'assessment', label: 'Tree Assessment' },
    { value: 'emergency', label: 'Emergency Service' }
  ]

  const leadSources = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'google', label: 'Google Search' },
    { value: 'social', label: 'Social Media' },
    { value: 'repeat', label: 'Repeat Customer' },
    { value: 'other', label: 'Other' }
  ]

  const propertyTypes = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'municipal', label: 'Municipal' },
    { value: 'hoa', label: 'HOA/Community' }
  ]

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit && onSubmit(formData)
  }

  return (
    <div className="lead-form-container">
      <div className="form-header">
        <h1 className="form-title">
          <span className="title-bracket">[</span>
          NEW LEAD CAPTURE
          <span className="title-bracket">]</span>
        </h1>
        <TacticalBadge status="lead">LEAD</TacticalBadge>
      </div>

      <form onSubmit={handleSubmit} className="lead-form">
        {/* Customer Information */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            CUSTOMER INFORMATION
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <TacticalInput
              label="Customer Name"
              placeholder="Full Name"
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              required
            />

            <TacticalInput
              label="Phone Number"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />

            <TacticalInput
              label="Email Address"
              type="text"
              placeholder="customer@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </TacticalCard>

        {/* Property Information */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            PROPERTY INFORMATION
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <div className="form-full-width">
              <TacticalInput
                label="Property Address"
                placeholder="Street Address"
                value={formData.propertyAddress}
                onChange={(e) => handleChange('propertyAddress', e.target.value)}
                required
              />
            </div>

            <TacticalInput
              label="City"
              placeholder="City"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
            />

            <TacticalInput
              label="State"
              placeholder="State"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              required
            />

            <TacticalInput
              label="Zip Code"
              placeholder="12345"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              required
            />

            <TacticalInput
              label="Property Type"
              type="select"
              value={formData.propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              options={propertyTypes}
            />

            <TacticalInput
              label="Est. Tree Count"
              placeholder="Number of trees"
              value={formData.estimatedTreeCount}
              onChange={(e) => handleChange('estimatedTreeCount', e.target.value)}
            />
          </div>
        </TacticalCard>

        {/* Service Details */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            SERVICE DETAILS
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <TacticalInput
              label="Service Type"
              type="select"
              value={formData.serviceType}
              onChange={(e) => handleChange('serviceType', e.target.value)}
              options={serviceTypes}
              required
            />

            <TacticalInput
              label="Priority Level"
              type="select"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' }
              ]}
            />

            <TacticalInput
              label="Lead Source"
              type="select"
              value={formData.source}
              onChange={(e) => handleChange('source', e.target.value)}
              options={leadSources}
            />

            <div className="form-checkbox-wrapper">
              <TacticalCheckbox
                label="Emergency Service Required"
                checked={formData.urgency}
                onChange={(e) => handleChange('urgency', e.target.checked)}
              />
            </div>
          </div>

          <TacticalDivider />

          <div className="form-full-width">
            <TacticalInput
              label="Description / Notes"
              type="textarea"
              placeholder="Describe the service needed, tree conditions, access issues, etc..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
            />
          </div>
        </TacticalCard>

        {/* Action Buttons */}
        <div className="form-actions">
          <TacticalButton
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            CANCEL
          </TacticalButton>
          <TacticalButton
            type="submit"
            variant="primary"
          >
            CREATE LEAD
          </TacticalButton>
        </div>
      </form>
    </div>
  )
}

export default LeadForm
