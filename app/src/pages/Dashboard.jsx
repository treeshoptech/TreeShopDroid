import { useState } from 'react'
import './Dashboard.css'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalButton from '../components/TacticalButton'
import TacticalProgress from '../components/TacticalProgress'
import TacticalDivider from '../components/TacticalDivider'

const Dashboard = () => {
  // Mock data - in real app, this would come from API/database
  const stats = {
    activeJobs: 28,
    totalRevenue: 125430,
    revenueThisMonth: 12500,
    pendingLeads: 12,
    activeProposals: 8,
    scheduledWorkOrders: 5,
    unpaidInvoices: 3,
    completedJobs: 142
  }

  const recentActivity = [
    { id: 1, type: 'lead', title: 'New Lead - Oak Tree Removal', customer: 'John Smith', time: '15 min ago', status: 'lead' },
    { id: 2, type: 'proposal', title: 'Proposal Sent - Pine Trimming', customer: 'Sarah Johnson', time: '1 hour ago', status: 'proposal' },
    { id: 3, type: 'workorder', title: 'Work Order Completed', customer: 'Mike Davis', time: '2 hours ago', status: 'workorder' },
    { id: 4, type: 'invoice', title: 'Invoice Paid - $2,450', customer: 'Lisa Brown', time: '3 hours ago', status: 'invoice' },
    { id: 5, type: 'lead', title: 'New Lead - Emergency Storm Damage', customer: 'Tom Wilson', time: '4 hours ago', status: 'lead' }
  ]

  const upcomingJobs = [
    { id: 1, date: '2025-10-06', time: '08:00', customer: 'Robert Martinez', service: 'Oak Tree Removal', status: 'workorder' },
    { id: 2, date: '2025-10-06', time: '13:00', customer: 'Jennifer Lee', service: 'Stump Grinding', status: 'workorder' },
    { id: 3, date: '2025-10-07', time: '09:00', customer: 'David Anderson', service: 'Tree Trimming', status: 'workorder' },
    { id: 4, date: '2025-10-07', time: '14:00', customer: 'Emily Taylor', service: 'Land Clearing', status: 'workorder' }
  ]

  const workflowMetrics = [
    { stage: 'LEADS', count: 12, color: '#2196f3', progress: 65 },
    { stage: 'PROPOSALS', count: 8, color: '#ff9100', progress: 45 },
    { stage: 'WORK ORDERS', count: 5, color: '#00ff41', progress: 80 },
    { stage: 'INVOICES', count: 3, color: '#ff4136', progress: 35 }
  ]

  const getActivityIcon = (type) => {
    const icons = {
      lead: '▣',
      proposal: '▤',
      workorder: '▥',
      invoice: '▦'
    }
    return icons[type] || '◉'
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">
            <span className="title-bracket">[</span>
            MISSION CONTROL
            <span className="title-bracket">]</span>
          </h1>
          <div className="dashboard-subtitle">Operations Dashboard</div>
        </div>
        <div className="header-right">
          <TacticalBadge status="completed">SYSTEM ONLINE</TacticalBadge>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <TacticalCard variant="stat">
          <div className="metric-card">
            <div className="metric-icon">◉</div>
            <div className="metric-content">
              <div className="metric-value">{stats.activeJobs}</div>
              <div className="metric-label">ACTIVE JOBS</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="metric-card">
            <div className="metric-icon">$</div>
            <div className="metric-content">
              <div className="metric-value">${(stats.revenueThisMonth / 1000).toFixed(1)}K</div>
              <div className="metric-label">REVENUE MTD</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="metric-card">
            <div className="metric-icon">▣</div>
            <div className="metric-content">
              <div className="metric-value">{stats.pendingLeads}</div>
              <div className="metric-label">PENDING LEADS</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="metric-card">
            <div className="metric-icon">▦</div>
            <div className="metric-content">
              <div className="metric-value">{stats.unpaidInvoices}</div>
              <div className="metric-label">UNPAID INVOICES</div>
            </div>
          </div>
        </TacticalCard>
      </div>

      {/* Workflow Pipeline */}
      <TacticalCard>
        <div className="section-title">
          <span className="section-bracket">[</span>
          WORKFLOW PIPELINE
          <span className="section-bracket">]</span>
        </div>

        <div className="workflow-stages">
          {workflowMetrics.map((stage) => (
            <div key={stage.stage} className="workflow-stage">
              <div className="stage-header">
                <div className="stage-name">{stage.stage}</div>
                <div className="stage-count">{stage.count}</div>
              </div>
              <TacticalProgress
                value={stage.progress}
                showPercentage={false}
              />
            </div>
          ))}
        </div>
      </TacticalCard>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Activity */}
        <TacticalCard>
          <div className="section-title">
            <span className="section-bracket">[</span>
            RECENT ACTIVITY
            <span className="section-bracket">]</span>
          </div>

          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-meta">
                    <span className="activity-customer">{activity.customer}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
                <TacticalBadge status={activity.status} variant="status">
                  {activity.type.toUpperCase()}
                </TacticalBadge>
              </div>
            ))}
          </div>

          <TacticalDivider />

          <div className="card-actions">
            <TacticalButton variant="secondary">
              VIEW ALL ACTIVITY
            </TacticalButton>
          </div>
        </TacticalCard>

        {/* Upcoming Jobs */}
        <TacticalCard>
          <div className="section-title">
            <span className="section-bracket">[</span>
            UPCOMING JOBS
            <span className="section-bracket">]</span>
          </div>

          <div className="jobs-list">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="job-item">
                <div className="job-date">
                  <div className="date-day">{job.date.split('-')[2]}</div>
                  <div className="date-month">OCT</div>
                </div>
                <div className="job-content">
                  <div className="job-time">{job.time}</div>
                  <div className="job-service">{job.service}</div>
                  <div className="job-customer">{job.customer}</div>
                </div>
                <TacticalBadge status={job.status} variant="status">
                  SCHEDULED
                </TacticalBadge>
              </div>
            ))}
          </div>

          <TacticalDivider />

          <div className="card-actions">
            <TacticalButton variant="secondary">
              VIEW SCHEDULE
            </TacticalButton>
          </div>
        </TacticalCard>
      </div>

      {/* Quick Actions */}
      <TacticalCard variant="info">
        <div className="section-title">
          <span className="section-bracket">[</span>
          QUICK ACTIONS
          <span className="section-bracket">]</span>
        </div>

        <div className="quick-actions-grid">
          <TacticalButton variant="primary">
            + NEW LEAD
          </TacticalButton>
          <TacticalButton variant="primary">
            + CREATE PROPOSAL
          </TacticalButton>
          <TacticalButton variant="primary">
            + SCHEDULE WORK ORDER
          </TacticalButton>
          <TacticalButton variant="primary">
            + GENERATE INVOICE
          </TacticalButton>
        </div>
      </TacticalCard>

      {/* Revenue Summary */}
      <TacticalCard variant="stat">
        <div className="section-title">
          <span className="section-bracket">[</span>
          REVENUE SUMMARY
          <span className="section-bracket">]</span>
        </div>

        <div className="revenue-stats">
          <div className="revenue-item">
            <div className="revenue-label">TOTAL REVENUE (ALL TIME)</div>
            <div className="revenue-value large">${stats.totalRevenue.toLocaleString()}</div>
          </div>

          <TacticalDivider />

          <div className="revenue-grid">
            <div className="revenue-item">
              <div className="revenue-label">THIS MONTH</div>
              <div className="revenue-value">${stats.revenueThisMonth.toLocaleString()}</div>
            </div>
            <div className="revenue-item">
              <div className="revenue-label">COMPLETED JOBS</div>
              <div className="revenue-value">{stats.completedJobs}</div>
            </div>
          </div>
        </div>
      </TacticalCard>
    </div>
  )
}

export default Dashboard
