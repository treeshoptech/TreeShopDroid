import { useState } from 'react'
import './ProposalBuilder.css'
import TacticalButton from '../components/TacticalButton'
import TacticalInput from '../components/TacticalInput'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalDivider from '../components/TacticalDivider'
import TacticalTable from '../components/TacticalTable'

const ProposalBuilder = ({ onSubmit, onCancel, leadData = {} }) => {
  const [formData, setFormData] = useState({
    // Customer Info (from lead)
    customerName: leadData.customerName || '',
    propertyAddress: leadData.propertyAddress || '',
    phone: leadData.phone || '',
    email: leadData.email || '',

    // Proposal Details
    proposalNumber: `PROP-${Date.now().toString().slice(-6)}`,
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

    // Financial
    taxRate: 0,
    discount: 0,

    // Terms
    paymentTerms: '50% deposit, balance on completion',
    notes: '',
    termsAndConditions: 'Work to be completed in a professional manner. All debris to be removed from site. Customer responsible for clearing access to work area.'
  })

  const [lineItems, setLineItems] = useState([
    {
      id: 1,
      service: leadData.serviceType || '',
      description: leadData.description || '',
      quantity: 1,
      unit: 'job',
      rate: 0,
      amount: 0
    }
  ])

  const serviceOptions = [
    { value: 'removal', label: 'Tree Removal' },
    { value: 'trimming', label: 'Tree Trimming' },
    { value: 'stump', label: 'Stump Grinding' },
    { value: 'mulching', label: 'Forestry Mulching' },
    { value: 'assessment', label: 'Tree Assessment' },
    { value: 'emergency', label: 'Emergency Service' },
    { value: 'cleanup', label: 'Debris Cleanup' },
    { value: 'hauling', label: 'Hauling' }
  ]

  const unitOptions = [
    { value: 'job', label: 'Per Job' },
    { value: 'tree', label: 'Per Tree' },
    { value: 'hour', label: 'Per Hour' },
    { value: 'day', label: 'Per Day' },
    { value: 'cord', label: 'Per Cord' },
    { value: 'yard', label: 'Per Yard' }
  ]

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLineItemChange = (id, field, value) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'rate') {
          updated.amount = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.rate) || 0)
        }
        return updated
      }
      return item
    }))
  }

  const addLineItem = () => {
    setLineItems(prev => [...prev, {
      id: Date.now(),
      service: '',
      description: '',
      quantity: 1,
      unit: 'job',
      rate: 0,
      amount: 0
    }])
  }

  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * (parseFloat(formData.taxRate) || 0) / 100
  }

  const calculateDiscount = () => {
    return calculateSubtotal() * (parseFloat(formData.discount) || 0) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const proposalData = {
      ...formData,
      lineItems,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      discount: calculateDiscount(),
      total: calculateTotal()
    }
    onSubmit && onSubmit(proposalData)
  }

  return (
    <div className="proposal-builder-container">
      <div className="form-header">
        <div className="header-left">
          <h1 className="form-title">
            <span className="title-bracket">[</span>
            PROPOSAL BUILDER
            <span className="title-bracket">]</span>
          </h1>
          <div className="proposal-number">#{formData.proposalNumber}</div>
        </div>
        <TacticalBadge status="proposal">PROPOSAL</TacticalBadge>
      </div>

      <form onSubmit={handleSubmit} className="proposal-form">
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
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              required
            />

            <TacticalInput
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
            />

            <div className="form-full-width">
              <TacticalInput
                label="Property Address"
                value={formData.propertyAddress}
                onChange={(e) => handleChange('propertyAddress', e.target.value)}
                required
              />
            </div>

            <TacticalInput
              label="Email Address"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
        </TacticalCard>

        {/* Proposal Details */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            PROPOSAL DETAILS
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <TacticalInput
              label="Issue Date"
              type="text"
              value={formData.issueDate}
              onChange={(e) => handleChange('issueDate', e.target.value)}
              required
            />

            <TacticalInput
              label="Valid Until"
              type="text"
              value={formData.validUntil}
              onChange={(e) => handleChange('validUntil', e.target.value)}
              required
            />
          </div>
        </TacticalCard>

        {/* Line Items */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            SERVICE LINE ITEMS
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="line-items-section">
            {lineItems.map((item, index) => (
              <div key={item.id} className="line-item">
                <div className="line-item-header">
                  <span className="line-item-number">ITEM #{index + 1}</span>
                  {lineItems.length > 1 && (
                    <TacticalButton
                      type="button"
                      variant="icon"
                      onClick={() => removeLineItem(item.id)}
                    >
                      ⊗
                    </TacticalButton>
                  )}
                </div>

                <div className="line-item-grid">
                  <TacticalInput
                    label="Service Type"
                    type="select"
                    value={item.service}
                    onChange={(e) => handleLineItemChange(item.id, 'service', e.target.value)}
                    options={serviceOptions}
                    required
                  />

                  <div className="form-full-width">
                    <TacticalInput
                      label="Description"
                      type="textarea"
                      placeholder="Detailed description of work..."
                      value={item.description}
                      onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <TacticalInput
                    label="Quantity"
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                    required
                  />

                  <TacticalInput
                    label="Unit"
                    type="select"
                    value={item.unit}
                    onChange={(e) => handleLineItemChange(item.id, 'unit', e.target.value)}
                    options={unitOptions}
                  />

                  <TacticalInput
                    label="Rate ($)"
                    type="text"
                    placeholder="0.00"
                    value={item.rate}
                    onChange={(e) => handleLineItemChange(item.id, 'rate', e.target.value)}
                    required
                  />

                  <div className="amount-display">
                    <div className="amount-label">AMOUNT</div>
                    <div className="amount-value">${item.amount.toFixed(2)}</div>
                  </div>
                </div>

                {index < lineItems.length - 1 && <TacticalDivider />}
              </div>
            ))}

            <TacticalButton
              type="button"
              variant="secondary"
              onClick={addLineItem}
            >
              + ADD LINE ITEM
            </TacticalButton>
          </div>
        </TacticalCard>

        {/* Pricing Summary */}
        <TacticalCard variant="stat">
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            PRICING SUMMARY
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="pricing-grid">
            <TacticalInput
              label="Tax Rate (%)"
              type="text"
              placeholder="0"
              value={formData.taxRate}
              onChange={(e) => handleChange('taxRate', e.target.value)}
            />

            <TacticalInput
              label="Discount (%)"
              type="text"
              placeholder="0"
              value={formData.discount}
              onChange={(e) => handleChange('discount', e.target.value)}
            />
          </div>

          <TacticalDivider />

          <div className="totals-section">
            <div className="total-row">
              <span className="total-label">SUBTOTAL:</span>
              <span className="total-value">${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span className="total-label">TAX:</span>
              <span className="total-value">${calculateTax().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span className="total-label">DISCOUNT:</span>
              <span className="total-value discount">-${calculateDiscount().toFixed(2)}</span>
            </div>
            <TacticalDivider />
            <div className="total-row grand-total">
              <span className="total-label">TOTAL:</span>
              <span className="total-value">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </TacticalCard>

        {/* Terms & Conditions */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            TERMS & CONDITIONS
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <div className="form-full-width">
              <TacticalInput
                label="Payment Terms"
                type="textarea"
                value={formData.paymentTerms}
                onChange={(e) => handleChange('paymentTerms', e.target.value)}
                rows={2}
              />
            </div>

            <div className="form-full-width">
              <TacticalInput
                label="Additional Notes"
                type="textarea"
                placeholder="Special instructions, access requirements, etc..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-full-width">
              <TacticalInput
                label="Terms and Conditions"
                type="textarea"
                value={formData.termsAndConditions}
                onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                rows={4}
              />
            </div>
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
            GENERATE PROPOSAL
          </TacticalButton>
        </div>
      </form>
    </div>
  )
}

export default ProposalBuilder
