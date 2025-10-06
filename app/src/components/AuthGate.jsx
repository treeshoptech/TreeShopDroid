import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react'
import { useState } from 'react'
import './AuthGate.css'

/**
 * Authentication gate component using Clerk's prebuilt components
 * Shows sign-in/sign-up forms for unauthenticated users
 * Passes through to children for authenticated users
 */
export default function AuthGate({ children }) {
  const [showSignUp, setShowSignUp] = useState(false)

  return (
    <>
      {/* Signed Out - Show Auth UI */}
      <SignedOut>
        <div className="auth-gate">
          <div className="auth-container">
            <div className="auth-header">
              <div className="auth-logo">
                <span className="logo-icon">🌲</span>
                <span className="logo-text">TREESHOP</span>
              </div>
              <div className="auth-subtitle">TACTICAL OPERATIONS SYSTEM</div>
            </div>

            <div className="auth-form">
              {showSignUp ? (
                <>
                  <SignUp
                    appearance={{
                      elements: {
                        rootBox: "auth-clerk-root",
                        card: "auth-clerk-card"
                      }
                    }}
                  />
                  <div className="auth-toggle">
                    Already have an account?{' '}
                    <button onClick={() => setShowSignUp(false)}>
                      Sign In
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <SignIn
                    appearance={{
                      elements: {
                        rootBox: "auth-clerk-root",
                        card: "auth-clerk-card"
                      }
                    }}
                  />
                  <div className="auth-toggle">
                    Don't have an account?{' '}
                    <button onClick={() => setShowSignUp(true)}>
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="auth-footer">
              <div className="auth-features">
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <span>Enterprise Security</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span>Real-time Sync</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📱</span>
                  <span>Mobile Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      {/* Signed In - Show App */}
      <SignedIn>
        {children}
      </SignedIn>
    </>
  )
}
