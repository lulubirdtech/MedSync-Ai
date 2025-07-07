import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { AuthForm } from './components/auth/AuthForm'
import { LandingPage } from './components/landing/LandingPage'
import { TermsOfService } from './components/legal/TermsOfService'
import { PrivacyPolicy } from './components/legal/PrivacyPolicy'
import { ContactPage } from './components/legal/ContactPage'
import { PatientDashboard } from './components/dashboard/PatientDashboard'
import { DoctorDashboard } from './components/dashboard/DoctorDashboard'
import { Loader2 } from 'lucide-react'

function App() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'terms' | 'privacy' | 'contact' | 'dashboard'>('landing')

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error)
      } else {
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    setCurrentView('dashboard')
  }

  const handleGetStarted = () => {
    setCurrentView('auth')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
  }

  const handleViewChange = (view: 'landing' | 'auth' | 'terms' | 'privacy' | 'contact' | 'dashboard') => {
    setCurrentView(view)
    // Update URL without page reload
    const path = view === 'landing' ? '/' : `/${view}`
    window.history.pushState({}, '', path)
  }

  // Handle route changes for legal pages
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      if (path === '/terms') {
        setCurrentView('terms')
      } else if (path === '/privacy') {
        setCurrentView('privacy')
      } else if (path === '/contact') {
        setCurrentView('contact')
      } else {
        setCurrentView('landing')
      }
    }

    window.addEventListener('popstate', handlePopState)
    handlePopState() // Check initial route

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading MedSync AI...</p>
        </div>
      </div>
    )
  }

  // Show legal pages
  if (currentView === 'terms') {
    return <TermsOfService onBack={handleBackToLanding} />
  }

  if (currentView === 'privacy') {
    return <PrivacyPolicy onBack={handleBackToLanding} />
  }

  if (currentView === 'contact') {
    return <ContactPage onBack={handleBackToLanding} />
  }

  // Show landing page if no user or explicitly requested
  if (!user && currentView === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} onViewChange={handleViewChange} />
  }

  // Show auth form
  if (!user && currentView === 'auth') {
    return <AuthForm onAuthSuccess={handleAuthSuccess} onBackToLanding={handleBackToLanding} onViewChange={handleViewChange} />
  }

  // Show dashboard for authenticated users
  // Determine user role from profile or metadata
  const userRole = userProfile?.role || user?.user_metadata?.role || 'patient'

  if (userRole === 'doctor') {
    return <DoctorDashboard user={user} />
  }

  return <PatientDashboard user={user} />
}

export default App