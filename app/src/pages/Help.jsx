import { useState } from 'react'
import './Help.css'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalAccordion from '../components/TacticalAccordion'
import TacticalInput from '../components/TacticalInput'

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const helpSections = [
    {
      category: 'Getting Started',
      items: [
        {
          question: 'How do I create a new lead?',
          answer: 'Navigate to the Leads page from the main menu, click the "+ ADD LEAD" button, and fill out the customer information form. Include property details, service type, and priority level. Click "CREATE LEAD" to save.'
        },
        {
          question: 'How do I convert a lead to a proposal?',
          answer: 'Open the lead details, click "CREATE PROPOSAL" button. The system will auto-populate customer information. Add line items with services and pricing, then send the proposal to the customer for approval.'
        },
        {
          question: 'How do I view the calendar?',
          answer: 'Click on "Calendar" in the main navigation. You can view scheduled jobs by month, week, or day. Click on any job to see details or make changes.'
        }
      ]
    },
    {
      category: 'Workflow Management',
      items: [
        {
          question: 'What is the workflow pipeline?',
          answer: 'TreeShop uses a 5-stage workflow: LEAD → PROPOSAL → WORK ORDER → INVOICE → COMPLETED. Each stage tracks your customer through the entire service lifecycle, from initial contact to final payment.'
        },
        {
          question: 'How do I create a work order?',
          answer: 'From an approved proposal, click "CREATE WORK ORDER". Assign crew members, equipment, schedule the job date and time. Add safety requirements and pre-job checklist items before scheduling.'
        },
        {
          question: 'How do I track job completion?',
          answer: 'Open the work order, complete the checklist items, mark the job as complete. The system will automatically move it to the invoice stage where you can generate the final bill.'
        }
      ]
    },
    {
      category: 'Invoicing & Payments',
      items: [
        {
          question: 'How do I generate an invoice?',
          answer: 'From a completed work order, click "GENERATE INVOICE". The system auto-populates services, pricing, and customer info. Add any additional charges, apply tax and discounts, then send to customer.'
        },
        {
          question: 'How do I track payments?',
          answer: 'Open the invoice and add payment records as they come in. Track deposits, partial payments, and final balance. The system automatically calculates remaining balance and payment progress.'
        },
        {
          question: 'How do I handle late payments?',
          answer: 'Set up late fee percentages and grace periods in Settings. The system will automatically flag overdue invoices and calculate late fees based on your configured rules.'
        }
      ]
    },
    {
      category: 'Customers & Database',
      items: [
        {
          question: 'How do I search for a customer?',
          answer: 'Go to the Customers page and use the search bar. You can search by name, phone number, or email address. Use the status filter to view active, inactive, or lead customers only.'
        },
        {
          question: 'How do I view customer history?',
          answer: 'Click on any customer in the database to view their complete job history, total revenue, average job value, and contact information. All past proposals, work orders, and invoices are linked to their profile.'
        },
        {
          question: 'How do I mark a customer as priority?',
          answer: 'In the customer details, set their priority level to "High". Priority customers will be marked with a star (★) symbol and appear at the top of lists and searches.'
        }
      ]
    },
    {
      category: 'Reports & Analytics',
      items: [
        {
          question: 'How do I view revenue reports?',
          answer: 'Navigate to Reports & Analytics. View monthly revenue trends, job completion rates, workflow pipeline stats, and top customers. Use the time range selector to view different periods.'
        },
        {
          question: 'How do I track crew performance?',
          answer: 'In the Reports page, scroll to "Crew Performance" to see each team\'s job count, revenue, efficiency rating, and average time per job. Use this data to optimize crew assignments.'
        },
        {
          question: 'How do I export reports?',
          answer: 'Click the "EXPORT REPORT" button in the Reports page header. Select your desired format (PDF, CSV, Excel) and time range. The system will generate a downloadable file with all analytics data.'
        }
      ]
    },
    {
      category: 'Map & Scheduling',
      items: [
        {
          question: 'How do I use the map view?',
          answer: 'The Map View shows all customer locations plotted on a tactical grid. Click on any pin to view job details. Use workflow filters to show only specific job types. Color coding indicates status: Blue (Lead), Orange (Proposal), Green (Work Order), Red (Invoice), Gray (Completed).'
        },
        {
          question: 'How do I schedule jobs on the calendar?',
          answer: 'In Calendar view, click on any day to view/add scheduled jobs. Each job shows time, duration, customer, service type, and assigned crew. Critical priority jobs pulse for visibility.'
        },
        {
          question: 'How do I assign crews to jobs?',
          answer: 'When creating a work order, select the crew from the dropdown. You can assign crew leader and team members. The calendar will show crew availability to prevent double-booking.'
        }
      ]
    },
    {
      category: 'System Settings',
      items: [
        {
          question: 'How do I configure tax rates?',
          answer: 'Go to Settings → Financial Settings. Set your default tax rate percentage. This will be applied automatically to all new proposals and invoices. You can override on individual documents.'
        },
        {
          question: 'How do I set up notifications?',
          answer: 'In Settings → Notifications, toggle email and SMS alerts. Configure which events trigger notifications: new leads, job completions, payments received, overdue invoices, etc.'
        },
        {
          question: 'How do I change business hours?',
          answer: 'Settings → Business Hours. Set your start/end times and select work days. This helps with scheduling and prevents jobs from being booked outside business hours.'
        }
      ]
    },
    {
      category: 'Mobile & Offline',
      items: [
        {
          question: 'Can I use TreeShop on mobile?',
          answer: 'Yes! TreeShop is a Progressive Web App (PWA) that works on all devices. On mobile, tap the "Add to Home Screen" option in your browser to install it like a native app.'
        },
        {
          question: 'Does it work offline?',
          answer: 'Limited offline functionality is available for viewing previously loaded data. Full offline mode with sync is coming in a future update. An internet connection is required for creating new records.'
        },
        {
          question: 'How do I take photos on job sites?',
          answer: 'Use your device\'s camera to capture before/after photos. Attach them to work orders for documentation. Photos help with quality control and customer communication.'
        }
      ]
    }
  ]

  const filteredSections = searchQuery
    ? helpSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.items.length > 0)
    : helpSections

  return (
    <div className="help-container">
      {/* Header */}
      <div className="help-header">
        <div className="header-left">
          <h1 className="help-title">
            <span className="title-bracket">[</span>
            HELP & DOCUMENTATION
            <span className="title-bracket">]</span>
          </h1>
          <div className="help-subtitle">User Guide & Support</div>
        </div>
        <div className="header-right">
          <TacticalBadge status="completed">ONLINE HELP</TacticalBadge>
        </div>
      </div>

      {/* Search */}
      <TacticalCard>
        <TacticalInput
          label="SEARCH HELP TOPICS"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </TacticalCard>

      {/* Quick Links */}
      <TacticalCard variant="info">
        <div className="section-title">
          <span className="section-bracket">[</span>
          QUICK START GUIDE
          <span className="section-bracket">]</span>
        </div>

        <div className="quick-links">
          <div className="quick-link-card">
            <div className="quick-link-icon">1</div>
            <div className="quick-link-content">
              <div className="quick-link-title">CREATE A LEAD</div>
              <div className="quick-link-desc">Capture customer inquiry with contact info and service details</div>
            </div>
          </div>

          <div className="quick-link-card">
            <div className="quick-link-icon">2</div>
            <div className="quick-link-content">
              <div className="quick-link-title">BUILD PROPOSAL</div>
              <div className="quick-link-desc">Add line items, pricing, and terms for customer approval</div>
            </div>
          </div>

          <div className="quick-link-card">
            <div className="quick-link-icon">3</div>
            <div className="quick-link-content">
              <div className="quick-link-title">SCHEDULE WORK ORDER</div>
              <div className="quick-link-desc">Assign crew, equipment, and schedule the job date</div>
            </div>
          </div>

          <div className="quick-link-card">
            <div className="quick-link-icon">4</div>
            <div className="quick-link-content">
              <div className="quick-link-title">GENERATE INVOICE</div>
              <div className="quick-link-desc">Create final bill and track payments to completion</div>
            </div>
          </div>
        </div>
      </TacticalCard>

      {/* FAQ Sections */}
      {filteredSections.map((section) => (
        <TacticalCard key={section.category}>
          <div className="section-title">
            <span className="section-bracket">[</span>
            {section.category.toUpperCase()}
            <span className="section-bracket">]</span>
          </div>

          <div className="faq-list">
            {section.items.map((item, index) => (
              <TacticalAccordion
                key={index}
                title={item.question}
                defaultOpen={searchQuery.length > 0}
              >
                <p className="faq-answer">{item.answer}</p>
              </TacticalAccordion>
            ))}
          </div>
        </TacticalCard>
      ))}

      {filteredSections.length === 0 && (
        <TacticalCard>
          <div className="no-results">
            <div className="no-results-icon">?</div>
            <div className="no-results-text">NO RESULTS FOUND</div>
            <div className="no-results-desc">Try different search terms or browse categories above</div>
          </div>
        </TacticalCard>
      )}

      {/* Contact Support */}
      <TacticalCard variant="stat">
        <div className="section-title">
          <span className="section-bracket">[</span>
          NEED MORE HELP?
          <span className="section-bracket">]</span>
        </div>

        <div className="support-info">
          <div className="support-item">
            <div className="support-label">EMAIL SUPPORT:</div>
            <div className="support-value">support@treeshop.com</div>
          </div>
          <div className="support-item">
            <div className="support-label">PHONE SUPPORT:</div>
            <div className="support-value">(555) 123-4567</div>
          </div>
          <div className="support-item">
            <div className="support-label">BUSINESS HOURS:</div>
            <div className="support-value">Monday - Friday, 8:00 AM - 5:00 PM</div>
          </div>
        </div>
      </TacticalCard>
    </div>
  )
}

export default Help
