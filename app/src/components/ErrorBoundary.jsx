import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#00ff00',
          padding: '20px',
          fontFamily: 'monospace'
        }}>
          <div style={{ maxWidth: '600px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️ ERROR</h1>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              {this.state.error?.message || 'Something went wrong'}
            </p>
            <p style={{ color: '#888', marginBottom: '30px' }}>
              This might be because your account needs to be set up in the database.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#00ff00',
                color: '#000',
                border: 'none',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              RELOAD PAGE
            </button>
            <br />
            <button
              onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}
              style={{
                background: 'transparent',
                color: '#ff4136',
                border: '1px solid #ff4136',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              CLEAR DATA & RELOAD
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
