import { useState } from 'react'
import './Dashboard.css'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalButton from '../components/TacticalButton'
import TacticalProgress from '../components/TacticalProgress'
import TacticalDivider from '../components/TacticalDivider'
import { useLeads, useProposals, useWorkOrders, useInvoices, useCurrentUser } from '../hooks/useConvex'

const Dashboard = () => {
  const leads = useLeads()
  const proposals = useProposals()
  const workOrders = useWorkOrders()
  const invoices = useInvoices()
  const currentUser = useCurrentUser()

  // Real-time stats from Convex
  const stats = {
    pendingLeads: leads?.filter(l => l.status === 'new' || l.status === 'contacted').length || 0,
    activeProposals: proposals?.filter(p => p.status === 'sent' || p.status === 'viewed').length || 0,
    scheduledWorkOrders: workOrders?.filter(w => w.status === 'scheduled' || w.status === 'in_progress').length || 0,
    unpaidInvoices: invoices?.filter(i => i.status === 'sent' || i.status === 'overdue').length || 0,
    totalLeads: leads?.length || 0,
    totalProposals: proposals?.length || 0,
    totalWorkOrders: workOrders?.length || 0,
    totalInvoices: invoices?.length || 0,
    totalRevenue: invoices?.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0) || 0,
    completedJobs: workOrders?.filter(w => w.status === 'completed').length || 0
  }

  // Recent activity (most recent 5 items)
  const recentActivity = [
    ...(leads?.slice(0, 2).map(l => ({
      id: l._id,
      type: 'lead',
      title: `New Lead - ${l.serviceType[0] || 'Service Request'}`,
      customer: 'Lead',
      time: new Date(l.createdAt).toLocaleString(),
      status: 'lead'
    })) || []),
    ...(proposals?.slice(0, 2).map(p => ({
      id: p._id,
      type: 'proposal',
      title: `Proposal ${p.proposalNumber}`,
      customer: 'Customer',
      time: new Date(p.createdAt).toLocaleString(),
      status: 'proposal'
    })) || []),
    ...(invoices?.slice(0, 1).map(i => ({
      id: i._id,
      type: 'invoice',
      title: `Invoice ${i.invoiceNumber} - $${i.total.toFixed(2)}`,
      customer: 'Customer',
      time: new Date(i.createdAt).toLocaleString(),
      status: 'invoice'
    })) || [])
  ].slice(0, 5)

  // Upcoming jobs (next 4 scheduled work orders)
  const upcomingJobs = workOrders?.filter(w => w.status === 'scheduled')
    .sort((a, b) => a.scheduledDate - b.scheduledDate)
    .slice(0, 4)
    .map(w => ({
      id: w._id,
      date: new Date(w.scheduledDate).toLocaleDateString(),
      time: new Date(w.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: 'Customer',
      service: w.services[0]?.name || 'Service',
      status: 'workorder'
    })) || []

  // Workflow metrics with real data
  const workflowMetrics = [
    { stage: 'LEADS', count: stats.pendingLeads, total: stats.totalLeads, color: '#2196f3', progress: stats.totalLeads ? (stats.pendingLeads / stats.totalLeads * 100) : 0 },
    { stage: 'PROPOSALS', count: stats.activeProposals, total: stats.totalProposals, color: '#ff9100', progress: stats.totalProposals ? (stats.activeProposals / stats.totalProposals * 100) : 0 },
    { stage: 'WORK ORDERS', count: stats.scheduledWorkOrders, total: stats.totalWorkOrders, color: '#00ff41', progress: stats.totalWorkOrders ? (stats.scheduledWorkOrders / stats.totalWorkOrders * 100) : 0 },
    { stage: 'INVOICES', count: stats.unpaidInvoices, total: stats.totalInvoices, color: '#ff4136', progress: stats.totalInvoices ? (stats.unpaidInvoices / stats.totalInvoices * 100) : 0 }
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
              <div className="metric-value">{stats.scheduledWorkOrders}</div>
              <div className="metric-label">ACTIVE JOBS</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="metric-card">
            <div className="metric-icon">$</div>
            <div className="metric-content">
              <div className="metric-value">${(stats.totalRevenue / 1000).toFixed(1)}K</div>
              <div className="metric-label">TOTAL REVENUE</div>
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

      {/* Loading State */}
      {!leads && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#00ff41' }}>
          <div>LOADING DATA...</div>
        </div>
      )}

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
