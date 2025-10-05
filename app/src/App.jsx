import { useState } from 'react'
import TacticalMenu from './themes/TacticalMenu'
import CarbonMenu from './themes/CarbonMenu'
import IndustrialMenu from './themes/IndustrialMenu'
import './App.css'

function App() {
  const [currentTheme, setCurrentTheme] = useState('tactical') // tactical, carbon, industrial

  const themes = {
    tactical: {
      component: TacticalMenu,
      name: 'Tactical Operator',
      desc: 'Military spec-ops • Sharp angles • Stealth green'
    },
    carbon: {
      component: CarbonMenu,
      name: 'Carbon Fiber',
      desc: 'Premium tech • MacBook inspired • Cyan accents'
    },
    industrial: {
      component: IndustrialMenu,
      name: 'Industrial Steel',
      desc: 'Heavy machinery • Brushed metal • Amber highlights'
    }
  }

  const CurrentThemeComponent = themes[currentTheme].component

  return (
    <div className="app">
      <CurrentThemeComponent />

      {/* Theme Selector */}
      <div className="theme-selector">
        <div className="theme-title">SELECT THEME</div>
        <div className="theme-options">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              className={`theme-option ${currentTheme === key ? 'active' : ''}`}
              onClick={() => setCurrentTheme(key)}
            >
              <div className="theme-option-name">{theme.name}</div>
              <div className="theme-option-desc">{theme.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
