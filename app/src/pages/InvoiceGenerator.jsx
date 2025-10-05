import { useState } from 'react'
import './InvoiceGenerator.css'
import TacticalButton from '../components/TacticalButton'
import TacticalInput from '../components/TacticalInput'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalDivider from '../components/TacticalDivider'
import TacticalProgress from '../components/TacticalProgress'

const InvoiceGenerator = ({ onSubmit, onCancel, workOrderData = {} }) => {
  const [formData, setFormData] = useState({
    // Invoice Info
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

    // Customer Info (from work order)
    customerName: workOrderData.customerName || '',
    propertyAddress: workOrderData.propertyAddress || '',
    phone: workOrderData.phone || '',
    email: workOrderData.email || '',

    // Work Details
    workOrderNumber: workOrderData.workOrderNumber || '',
    serviceDate: workOrderData.scheduledDate || '',
    serviceType: workOrderData.serviceType || '',

    // Financial
    taxRate: 0,
    discount: 0,
    depositPaid: 0,

    // Payment
    paymentStatus: 'unpaid',
    paymentMethod: '',
    paymentTerms: 'Net 30',

    // Notes
    invoiceNotes: '',
    paymentInstructions: 'Payment due within 30 days. Make checks payable to TreeShop.',

    // Late Fees
    lateFeePercent: 1.5,
    gracePeriodDays: 5
  })

  const [lineItems, setLineItems] = useState([
    {
      id: 1,
      description: workOrderData.workDescription || '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
  ])

  const [payments, setPayments] = useState([])

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
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }])
  }

  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const addPayment = () => {
    setPayments(prev => [...prev, {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      method: '',
      reference: ''
    }])
  }

  const removePayment = (id) => {
    setPayments(prev => prev.filter(payment => payment.id !== id))
  }

  const handlePaymentChange = (id, field, value) => {
    setPayments(prev => prev.map(payment =>
      payment.id === id ? { ...payment, [field]: value } : payment
    ))
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

  const calculateTotalPaid = () => {
    const depositPaid = parseFloat(formData.depositPaid) || 0
    const paymentsPaid = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
    return depositPaid + paymentsPaid
  }

  const calculateBalance = () => {
    return calculateTotal() - calculateTotalPaid()
  }

  const getPaymentProgress = () => {
    const total = calculateTotal()
    if (total === 0) return 0
    return Math.min(100, (calculateTotalPaid() / total) * 100)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const invoiceData = {
      ...formData,
      lineItems,
      payments,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      discount: calculateDiscount(),
      total: calculateTotal(),
      totalPaid: calculateTotalPaid(),
      balance: calculateBalance()
    }
    onSubmit && onSubmit(invoiceData)
  }

  return (
    <div className="invoice-generator-container">
      <div className="form-header">
        <div className="header-left">
          <h1 className="form-title">
            <span className="title-bracket">[</span>
            INVOICE GENERATOR
            <span className="title-bracket">]</span>
          </h1>
          <div className="invoice-number">#{formData.invoiceNumber}</div>
        </div>
        <TacticalBadge status="invoice">INVOICE</TacticalBadge>
      </div>

      <form onSubmit={handleSubmit} className="invoice-form">
        {/* Invoice Details */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            INVOICE DETAILS
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <TacticalInput
              label="Invoice Date"
              type="text"
              value={formData.invoiceDate}
              onChange={(e) => handleChange('invoiceDate', e.target.value)}
              required
            />

            <TacticalInput
              label="Due Date"
              type="text"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              required
            />

            <TacticalInput
              label="Work Order #"
              value={formData.workOrderNumber}
              onChange={(e) => handleChange('workOrderNumber', e.target.value)}
            />

            <TacticalInput
              label="Service Date"
              type="text"
              value={formData.serviceDate}
              onChange={(e) => handleChange('serviceDate', e.target.value)}
            />

            <TacticalInput
              label="Payment Status"
              type="select"
              value={formData.paymentStatus}
              onChange={(e) => handleChange('paymentStatus', e.target.value)}
              options={[
                { value: 'unpaid', label: 'Unpaid' },
                { value: 'partial', label: 'Partially Paid' },
                { value: 'paid', label: 'Paid in Full' },
                { value: 'overdue', label: 'Overdue' }
              ]}
            />

            <TacticalInput
              label="Payment Terms"
              type="select"
              value={formData.paymentTerms}
              onChange={(e) => handleChange('paymentTerms', e.target.value)}
              options={[
                { value: 'Net 15', label: 'Net 15' },
                { value: 'Net 30', label: 'Net 30' },
                { value: 'Net 60', label: 'Net 60' },
                { value: 'Due on Receipt', label: 'Due on Receipt' },
                { value: '50% Deposit', label: '50% Deposit, Balance on Completion' }
              ]}
            />
          </div>
        </TacticalCard>

        {/* Customer Information */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            BILL TO
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

        {/* Line Items */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            INVOICE LINE ITEMS
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
                  <div className="form-full-width">
                    <TacticalInput
                      label="Description"
                      type="textarea"
                      placeholder="Service description..."
                      value={item.description}
                      onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                      rows={2}
                      required
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

        {/* Financial Summary */}
        <TacticalCard variant="stat">
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            FINANCIAL SUMMARY
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

        {/* Payment Tracking */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            PAYMENT TRACKING
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <TacticalInput
              label="Deposit Paid ($)"
              type="text"
              placeholder="0.00"
              value={formData.depositPaid}
              onChange={(e) => handleChange('depositPaid', e.target.value)}
            />
          </div>

          <TacticalDivider label="ADDITIONAL PAYMENTS" />

          <div className="payments-section">
            {payments.map((payment, index) => (
              <div key={payment.id} className="payment-item">
                <div className="payment-header">
                  <span className="payment-number">PAYMENT #{index + 1}</span>
                  <TacticalButton
                    type="button"
                    variant="icon"
                    onClick={() => removePayment(payment.id)}
                  >
                    ⊗
                  </TacticalButton>
                </div>

                <div className="payment-grid">
                  <TacticalInput
                    label="Date"
                    type="text"
                    value={payment.date}
                    onChange={(e) => handlePaymentChange(payment.id, 'date', e.target.value)}
                  />

                  <TacticalInput
                    label="Amount ($)"
                    type="text"
                    value={payment.amount}
                    onChange={(e) => handlePaymentChange(payment.id, 'amount', e.target.value)}
                  />

                  <TacticalInput
                    label="Method"
                    type="select"
                    value={payment.method}
                    onChange={(e) => handlePaymentChange(payment.id, 'method', e.target.value)}
                    options={[
                      { value: 'cash', label: 'Cash' },
                      { value: 'check', label: 'Check' },
                      { value: 'card', label: 'Credit/Debit Card' },
                      { value: 'transfer', label: 'Bank Transfer' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />

                  <TacticalInput
                    label="Reference #"
                    type="text"
                    placeholder="Check #, Confirmation #"
                    value={payment.reference}
                    onChange={(e) => handlePaymentChange(payment.id, 'reference', e.target.value)}
                  />
                </div>
              </div>
            ))}

            <TacticalButton
              type="button"
              variant="secondary"
              onClick={addPayment}
            >
              + ADD PAYMENT
            </TacticalButton>
          </div>

          <TacticalDivider />

          <div className="payment-summary">
            <div className="summary-row">
              <span className="summary-label">TOTAL PAID:</span>
              <span className="summary-value paid">${calculateTotalPaid().toFixed(2)}</span>
            </div>
            <div className="summary-row balance-row">
              <span className="summary-label">BALANCE DUE:</span>
              <span className={`summary-value ${calculateBalance() > 0 ? 'due' : 'paid'}`}>
                ${calculateBalance().toFixed(2)}
              </span>
            </div>

            <TacticalDivider />

            <TacticalProgress
              value={getPaymentProgress()}
              label="PAYMENT PROGRESS"
              showPercentage={true}
            />
          </div>
        </TacticalCard>

        {/* Notes & Instructions */}
        <TacticalCard>
          <div className="card-section-title">
            <span className="section-bracket">{'['}</span>
            NOTES & PAYMENT INSTRUCTIONS
            <span className="section-bracket">{']'}</span>
          </div>

          <div className="form-grid">
            <div className="form-full-width">
              <TacticalInput
                label="Invoice Notes"
                type="textarea"
                placeholder="Additional notes, work completion details..."
                value={formData.invoiceNotes}
                onChange={(e) => handleChange('invoiceNotes', e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-full-width">
              <TacticalInput
                label="Payment Instructions"
                type="textarea"
                value={formData.paymentInstructions}
                onChange={(e) => handleChange('paymentInstructions', e.target.value)}
                rows={3}
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
            GENERATE INVOICE
          </TacticalButton>
        </div>
      </form>
    </div>
  )
}

export default InvoiceGenerator
