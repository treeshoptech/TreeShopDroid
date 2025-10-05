import { useState } from 'react'
import './Calendar.css'
import TacticalCard from '../components/TacticalCard'
import TacticalBadge from '../components/TacticalBadge'
import TacticalButton from '../components/TacticalButton'
import TacticalCheckbox from '../components/TacticalCheckbox'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 5)) // October 5, 2025
  const [viewMode, setViewMode] = useState('month') // 'month', 'week', 'day'
  const [selectedDay, setSelectedDay] = useState(null)

  // Mock scheduled jobs
  const scheduledJobs = [
    { id: 1, date: '2025-10-06', time: '08:00', duration: 4, customer: 'John Smith', service: 'Tree Removal', status: 'workorder', crew: 'A Team', priority: 'high' },
    { id: 2, date: '2025-10-06', time: '13:00', duration: 3, customer: 'Sarah Johnson', service: 'Stump Grinding', status: 'workorder', crew: 'B Team', priority: 'medium' },
    { id: 3, date: '2025-10-07', time: '09:00', duration: 5, customer: 'Mike Davis', service: 'Tree Trimming', status: 'workorder', crew: 'A Team', priority: 'high' },
    { id: 4, date: '2025-10-07', time: '14:00', duration: 2, customer: 'Lisa Brown', service: 'Land Clearing', status: 'proposal', crew: 'B Team', priority: 'low' },
    { id: 5, date: '2025-10-08', time: '08:30', duration: 6, customer: 'Tom Wilson', service: 'Emergency Storm Damage', status: 'workorder', crew: 'A Team', priority: 'critical' },
    { id: 6, date: '2025-10-09', time: '10:00', duration: 3, customer: 'Robert Martinez', service: 'Tree Removal', status: 'workorder', crew: 'C Team', priority: 'medium' },
    { id: 7, date: '2025-10-10', time: '08:00', duration: 4, customer: 'Jennifer Lee', service: 'Stump Grinding', status: 'proposal', crew: 'B Team', priority: 'low' },
    { id: 8, date: '2025-10-10', time: '13:30', duration: 3, customer: 'David Anderson', service: 'Tree Trimming', status: 'workorder', crew: 'A Team', priority: 'medium' },
    { id: 9, date: '2025-10-11', time: '09:00', duration: 5, customer: 'Emily Taylor', service: 'Land Clearing', status: 'workorder', crew: 'C Team', priority: 'high' },
    { id: 10, date: '2025-10-12', time: '08:00', duration: 2, customer: 'Chris Martin', service: 'Tree Removal', status: 'completed', crew: 'B Team', priority: 'low' },
    { id: 11, date: '2025-10-13', time: '10:30', duration: 4, customer: 'Amy White', service: 'Tree Trimming', status: 'workorder', crew: 'A Team', priority: 'medium' },
    { id: 12, date: '2025-10-14', time: '08:00', duration: 3, customer: 'Brian Clark', service: 'Stump Grinding', status: 'workorder', crew: 'C Team', priority: 'high' }
  ]

  const [filters, setFilters] = useState({
    workorder: true,
    proposal: true,
    completed: true
  })

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month, 1).getDay()
  }

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ]

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date(2025, 9, 5))
  }

  const getJobsForDate = (dateStr) => {
    return scheduledJobs.filter(job => job.date === dateStr && filters[job.status])
  }

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const isToday = (year, month, day) => {
    const today = new Date(2025, 9, 5) // Mock today
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  const handleFilterToggle = (status) => {
    setFilters(prev => ({ ...prev, [status]: !prev[status] }))
  }

  const handleDayClick = (dateStr) => {
    setSelectedDay(dateStr)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const days = []

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day)
      const jobs = getJobsForDate(dateStr)
      const today = isToday(year, month, day)

      days.push(
        <div
          key={day}
          className={`calendar-day ${today ? 'today' : ''} ${jobs.length > 0 ? 'has-jobs' : ''} ${selectedDay === dateStr ? 'selected' : ''}`}
          onClick={() => handleDayClick(dateStr)}
        >
          <div className="day-number">{day}</div>
          <div className="day-jobs">
            {jobs.slice(0, 3).map(job => (
              <div key={job.id} className={`job-dot status-${job.status}`}></div>
            ))}
            {jobs.length > 3 && (
              <div className="job-more">+{jobs.length - 3}</div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const getStatusColor = (status) => {
    const colors = {
      workorder: '#00ff41',
      proposal: '#ff9100',
      completed: '#808080'
    }
    return colors[status]
  }

  const selectedDayJobs = selectedDay ? getJobsForDate(selectedDay) : []

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <div className="header-left">
          <h1 className="calendar-title">
            <span className="title-bracket">[</span>
            OPERATIONS CALENDAR
            <span className="title-bracket">]</span>
          </h1>
          <div className="calendar-subtitle">Job Scheduling & Timeline</div>
        </div>
        <div className="header-right">
          <TacticalBadge status="workorder">
            {scheduledJobs.filter(j => filters[j.status]).length} SCHEDULED
          </TacticalBadge>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="calendar-controls">
        <TacticalCard>
          <div className="controls-row">
            <div className="nav-controls">
              <TacticalButton variant="icon" onClick={previousMonth}>
                ◀
              </TacticalButton>
              <div className="month-display">
                <div className="month-name">{monthNames[currentDate.getMonth()]}</div>
                <div className="year-name">{currentDate.getFullYear()}</div>
              </div>
              <TacticalButton variant="icon" onClick={nextMonth}>
                ▶
              </TacticalButton>
            </div>

            <TacticalButton variant="secondary" onClick={goToToday}>
              TODAY
            </TacticalButton>

            <div className="filter-controls">
              <TacticalCheckbox
                label="WORK ORDERS"
                checked={filters.workorder}
                onChange={() => handleFilterToggle('workorder')}
              />
              <TacticalCheckbox
                label="PROPOSALS"
                checked={filters.proposal}
                onChange={() => handleFilterToggle('proposal')}
              />
              <TacticalCheckbox
                label="COMPLETED"
                checked={filters.completed}
                onChange={() => handleFilterToggle('completed')}
              />
            </div>
          </div>
        </TacticalCard>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-content">
        <TacticalCard>
          <div className="calendar-grid">
            {/* Day Headers */}
            <div className="calendar-header-row">
              {dayNames.map(day => (
                <div key={day} className="calendar-header-cell">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="calendar-days">
              {renderCalendar()}
            </div>
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <div className="legend-title">
              <span className="section-bracket">[</span>
              LEGEND
              <span className="section-bracket">]</span>
            </div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-dot status-workorder"></div>
                <span className="legend-label">WORK ORDER</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot status-proposal"></div>
                <span className="legend-label">PROPOSAL</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot status-completed"></div>
                <span className="legend-label">COMPLETED</span>
              </div>
            </div>
          </div>
        </TacticalCard>
      </div>

      {/* Selected Day Details */}
      {selectedDay && selectedDayJobs.length > 0 && (
        <div className="day-details">
          <TacticalCard variant="info">
            <div className="details-header">
              <div className="section-title">
                <span className="section-bracket">[</span>
                JOBS FOR {selectedDay}
                <span className="section-bracket">]</span>
              </div>
              <TacticalButton variant="icon" onClick={() => setSelectedDay(null)}>
                ✕
              </TacticalButton>
            </div>

            <div className="jobs-timeline">
              {selectedDayJobs
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(job => (
                  <div key={job.id} className={`timeline-job status-${job.status}`}>
                    <div className="job-time">
                      <div className="time-start">{job.time}</div>
                      <div className="time-duration">{job.duration}h</div>
                    </div>
                    <div className="job-info">
                      <div className="job-customer">{job.customer}</div>
                      <div className="job-service">{job.service}</div>
                      <div className="job-meta">
                        <span className="job-crew">Crew: {job.crew}</span>
                        {job.priority === 'critical' && (
                          <TacticalBadge status="invoice" variant="priority">
                            CRITICAL
                          </TacticalBadge>
                        )}
                      </div>
                    </div>
                    <div className="job-status">
                      <TacticalBadge status={job.status === 'workorder' ? 'workorder' : job.status === 'proposal' ? 'proposal' : 'completed'}>
                        {job.status.toUpperCase()}
                      </TacticalBadge>
                    </div>
                  </div>
                ))}
            </div>
          </TacticalCard>
        </div>
      )}

      {/* Quick Stats */}
      <div className="calendar-stats">
        <div className="stats-grid">
          <TacticalCard variant="stat">
            <div className="stat-item">
              <div className="stat-value">{scheduledJobs.filter(j => j.status === 'workorder').length}</div>
              <div className="stat-label">CONFIRMED JOBS</div>
            </div>
          </TacticalCard>

          <TacticalCard variant="stat">
            <div className="stat-item">
              <div className="stat-value">{scheduledJobs.filter(j => j.status === 'proposal').length}</div>
              <div className="stat-label">PENDING PROPOSALS</div>
            </div>
          </TacticalCard>

          <TacticalCard variant="stat">
            <div className="stat-item">
              <div className="stat-value">{scheduledJobs.filter(j => j.status === 'completed').length}</div>
              <div className="stat-label">COMPLETED THIS MONTH</div>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  )
}

export default Calendar
