import { useState } from 'react'
import './TacticalTabs.css'

/**
 * TacticalTabs - Military-style tab navigation
 *
 * Props:
 * - tabs: array of { id, label, content } objects
 * - defaultTab: string (id of default tab)
 */

const TacticalTabs = ({
  tabs = [],
  defaultTab,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className="tactical-tabs" {...props}>
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-bracket">[</span>
            {tab.label}
            <span className="tab-bracket">]</span>
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {activeTabContent}
      </div>
    </div>
  )
}

export default TacticalTabs
