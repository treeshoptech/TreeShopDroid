import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useSetupNewUser, useCurrentUser } from '../hooks/useConvex'

/**
 * Auto-setup user in Convex when they first sign in with Clerk
 */
export default function UserSetup({ children }) {
  const { user, isLoaded } = useUser()
  const currentUser = useCurrentUser()
  const setupNewUser = useSetupNewUser()
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupAttempted, setSetupAttempted] = useState(false)

  useEffect(() => {
    const setupUser = async () => {
      if (!isLoaded || !user || setupAttempted) return

      // If currentUser query returns null (user doesn't exist in Convex)
      if (currentUser === null && !isSettingUp) {
        setIsSettingUp(true)
        setSetupAttempted(true)

        try {
          await setupNewUser({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress || user.id,
            name: user.fullName || user.firstName || 'User',
          })

          // Reload to fetch the new user data
          window.location.reload()
        } catch (error) {
          console.error('Failed to setup user:', error)
          setIsSettingUp(false)
        }
      }
    }

    setupUser()
  }, [user, isLoaded, currentUser, setupNewUser, isSettingUp, setupAttempted])

  // Show loading while setting up
  if (isLoaded && user && (currentUser === null || isSettingUp)) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#00ff00',
        padding: '40px',
        textAlign: 'center',
        fontFamily: 'monospace'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌲</div>
          <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>SETTING UP YOUR ACCOUNT</h1>
          <p style={{ color: '#888' }}>Creating your organization and user profile...</p>
          <div style={{ marginTop: '30px', color: '#00ff00' }}>
            <div className="spinner-ring" style={{
              width: '60px',
              height: '60px',
              border: '3px solid #333',
              borderTopColor: '#00ff00',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
        </div>
      </div>
    )
  }

  return children
}
