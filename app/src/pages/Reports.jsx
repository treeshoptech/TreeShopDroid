import { useState } from 'react'
import './Reports.css'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalButton from '../components/TacticalButton'
import TacticalInput from '../components/TacticalInput'
import TacticalProgress from '../components/TacticalProgress'
import TacticalDivider from '../components/TacticalDivider'

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month') // 'week', 'month', 'quarter', 'year'

  // Mock analytics data
  const revenueData = {
    total: 125430,
    thisMonth: 12500,
    lastMonth: 15200,
    thisYear: 89650,
    growth: -17.8 // percentage
  }

  const jobStats = {
    total: 156,
    completed: 142,
    pending: 9,
    cancelled: 5,
    completionRate: 91.0
  }

  const workflowStats = [
    { stage: 'Leads', count: 12, value: 0, color: '#2196f3' },
    { stage: 'Proposals', count: 8, value: 24600, color: '#ff9100' },
    { stage: 'Work Orders', count: 5, value: 14200, color: '#00ff41' },
    { stage: 'Invoices', count: 3, value: 8900, color: '#ff4136' },
    { stage: 'Completed', count: 142, value: 125430, color: '#808080' }
  ]

  const monthlyRevenue = [
    { month: 'JAN', revenue: 8200, jobs: 11 },
    { month: 'FEB', revenue: 9800, jobs: 13 },
    { month: 'MAR', revenue: 11400, jobs: 15 },
    { month: 'APR', revenue: 10200, jobs: 14 },
    { month: 'MAY', revenue: 12800, jobs: 17 },
    { month: 'JUN', revenue: 9600, jobs: 12 },
    { month: 'JUL', revenue: 14200, jobs: 18 },
    { month: 'AUG', revenue: 13600, jobs: 16 },
    { month: 'SEP', revenue: 15200, jobs: 19 },
    { month: 'OCT', revenue: 12500, jobs: 14 }
  ]

  const serviceBreakdown = [
    { service: 'Tree Removal', count: 48, revenue: 52800, percentage: 42 },
    { service: 'Tree Trimming', count: 52, revenue: 36400, percentage: 29 },
    { service: 'Stump Grinding', count: 28, revenue: 19600, percentage: 16 },
    { service: 'Land Clearing', count: 18, revenue: 16630, percentage: 13 }
  ]

  const crewPerformance = [
    { crew: 'A Team', jobs: 58, revenue: 54200, efficiency: 95, avgJobTime: 4.2 },
    { crew: 'B Team', jobs: 52, revenue: 45800, efficiency: 88, avgJobTime: 4.8 },
    { crew: 'C Team', jobs: 32, revenue: 25430, efficiency: 82, avgJobTime: 5.1 }
  ]

  const topCustomers = [
    { name: 'Tom Wilson', jobs: 12, revenue: 32400, lastJob: '2025-09-28' },
    { name: 'Mike Davis', jobs: 8, revenue: 18750, lastJob: '2025-10-01' },
    { name: 'David Anderson', jobs: 6, revenue: 14500, lastJob: '2025-09-05' },
    { name: 'John Smith', jobs: 5, revenue: 12450, lastJob: '2025-09-15' },
    { name: 'Robert Martinez', jobs: 4, revenue: 9800, lastJob: '2025-09-10' }
  ]

  const getMaxRevenue = () => {
    return Math.max(...monthlyRevenue.map(m => m.revenue))
  }

  const getBarHeight = (revenue) => {
    const max = getMaxRevenue()
    return (revenue / max) * 100
  }

  return (
    <div className="reports-container">
      {/* Header */}
      <div className="reports-header">
        <div className="header-left">
          <h1 className="reports-title">
            <span className="title-bracket">[</span>
            ANALYTICS & REPORTS
            <span className="title-bracket">]</span>
          </h1>
          <div className="reports-subtitle">Business Intelligence Dashboard</div>
        </div>
        <div className="header-right">
          <TacticalInput
            type="select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' }
            ]}
          />
          <TacticalButton variant="primary">
            EXPORT REPORT
          </TacticalButton>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-overview">
        <TacticalCard variant="stat">
          <div className="metric-large">
            <div className="metric-icon">$</div>
            <div className="metric-content">
              <div className="metric-value">${revenueData.thisMonth.toLocaleString()}</div>
              <div className="metric-label">REVENUE THIS MONTH</div>
              <div className={`metric-change ${revenueData.growth < 0 ? 'negative' : 'positive'}`}>
                {revenueData.growth > 0 ? '▲' : '▼'} {Math.abs(revenueData.growth)}% vs last month
              </div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="metric-large">
            <div className="metric-icon">◉</div>
            <div className="metric-content">
              <div className="metric-value">{jobStats.completed}</div>
              <div className="metric-label">COMPLETED JOBS</div>
              <div className="metric-subtext">{jobStats.total} total jobs</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="metric-large">
            <div className="metric-icon">✓</div>
            <div className="metric-content">
              <div className="metric-value">{jobStats.completionRate}%</div>
              <div className="metric-label">COMPLETION RATE</div>
              <div className="metric-subtext">{jobStats.cancelled} cancelled</div>
            </div>
          </div>
        </TacticalCard>

        <TacticalCard variant="stat">
          <div className="metric-large">
            <div className="metric-icon">$</div>
            <div className="metric-content">
              <div className="metric-value">${(revenueData.total / jobStats.completed).toFixed(0)}</div>
              <div className="metric-label">AVG JOB VALUE</div>
              <div className="metric-subtext">Per completed job</div>
            </div>
          </div>
        </TacticalCard>
      </div>

      {/* Revenue Trend Chart */}
      <TacticalCard>
        <div className="chart-section">
          <div className="section-title">
            <span className="section-bracket">[</span>
            REVENUE TREND - 2025
            <span className="section-bracket">]</span>
          </div>

          <div className="bar-chart">
            <div className="chart-bars">
              {monthlyRevenue.map((data) => (
                <div key={data.month} className="chart-bar-wrapper">
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ height: `${getBarHeight(data.revenue)}%` }}
                    >
                      <div className="bar-value">${(data.revenue / 1000).toFixed(1)}K</div>
                    </div>
                  </div>
                  <div className="bar-label">{data.month}</div>
                  <div className="bar-sublabel">{data.jobs} jobs</div>
                </div>
              ))}
            </div>

            <div className="chart-stats">
              <div className="chart-stat">
                <span className="stat-label">HIGHEST:</span>
                <span className="stat-value">${Math.max(...monthlyRevenue.map(m => m.revenue)).toLocaleString()} (SEP)</span>
              </div>
              <div className="chart-stat">
                <span className="stat-label">AVERAGE:</span>
                <span className="stat-value">${(monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / monthlyRevenue.length).toFixed(0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </TacticalCard>

      {/* Workflow Pipeline & Service Breakdown */}
      <div className="reports-grid">
        {/* Workflow Stats */}
        <TacticalCard>
          <div className="section-title">
            <span className="section-bracket">[</span>
            WORKFLOW PIPELINE
            <span className="section-bracket">]</span>
          </div>

          <div className="workflow-breakdown">
            {workflowStats.map((stage) => (
              <div key={stage.stage} className="workflow-item">
                <div className="workflow-header">
                  <div className="workflow-name">{stage.stage.toUpperCase()}</div>
                  <div className="workflow-count">
                    <TacticalBadge status={stage.stage.toLowerCase().replace(' ', '')}>
                      {stage.count}
                    </TacticalBadge>
                  </div>
                </div>
                {stage.value > 0 && (
                  <div className="workflow-value">${stage.value.toLocaleString()}</div>
                )}
              </div>
            ))}
          </div>
        </TacticalCard>

        {/* Service Breakdown */}
        <TacticalCard>
          <div className="section-title">
            <span className="section-bracket">[</span>
            SERVICE BREAKDOWN
            <span className="section-bracket">]</span>
          </div>

          <div className="service-breakdown">
            {serviceBreakdown.map((service) => (
              <div key={service.service} className="service-item">
                <div className="service-header">
                  <div className="service-name">{service.service}</div>
                  <div className="service-stats">
                    <span className="service-count">{service.count} jobs</span>
                    <span className="service-revenue">${service.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <TacticalProgress
                  value={service.percentage}
                  label={`${service.percentage}%`}
                  showPercentage={true}
                />
              </div>
            ))}
          </div>
        </TacticalCard>
      </div>

      {/* Crew Performance */}
      <TacticalCard>
        <div className="section-title">
          <span className="section-bracket">[</span>
          CREW PERFORMANCE
          <span className="section-bracket">]</span>
        </div>

        <div className="crew-table">
          <table>
            <thead>
              <tr>
                <th>CREW</th>
                <th>JOBS</th>
                <th>REVENUE</th>
                <th>EFFICIENCY</th>
                <th>AVG TIME/JOB</th>
              </tr>
            </thead>
            <tbody>
              {crewPerformance.map((crew) => (
                <tr key={crew.crew}>
                  <td className="crew-name">{crew.crew}</td>
                  <td className="crew-jobs">{crew.jobs}</td>
                  <td className="crew-revenue">${crew.revenue.toLocaleString()}</td>
                  <td className="crew-efficiency">
                    <div className="efficiency-bar">
                      <TacticalProgress
                        value={crew.efficiency}
                        showPercentage={true}
                      />
                    </div>
                  </td>
                  <td className="crew-time">{crew.avgJobTime}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TacticalCard>

      {/* Top Customers */}
      <TacticalCard>
        <div className="section-title">
          <span className="section-bracket">[</span>
          TOP CUSTOMERS
          <span className="section-bracket">]</span>
        </div>

        <div className="top-customers">
          {topCustomers.map((customer, index) => (
            <div key={customer.name} className="customer-row">
              <div className="customer-rank">#{index + 1}</div>
              <div className="customer-info">
                <div className="customer-name">{customer.name}</div>
                <div className="customer-meta">
                  {customer.jobs} jobs • Last: {customer.lastJob}
                </div>
              </div>
              <div className="customer-revenue">${customer.revenue.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </TacticalCard>
    </div>
  )
}

export default Reports
