import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Heart, Mail, Lock, User, Calendar, Users, ArrowLeft } from 'lucide-react'

interface AuthFormProps {
  onAuthSuccess: () => void
  onBackToLanding: () => void
  onViewChange: (view: 'landing' | 'auth' | 'terms' | 'privacy' | 'contact' | 'dashboard') => void
}

export function AuthForm({ onAuthSuccess, onBackToLanding, onViewChange }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'patient' as 'patient' | 'doctor' | 'admin',
    dob: '',
    gender: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })
        if (error) throw error
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: formData.role
            }
          }
        })
        if (error) throw error

        if (data.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: formData.email,
              name: formData.name,
              role: formData.role,
              locale: 'en'
            })

          if (profileError) console.error('Profile creation error:', profileError)

          // Create patient profile if role is patient
          if (formData.role === 'patient' && formData.dob && formData.gender) {
            // Wait a moment for the user to be properly authenticated
            setTimeout(async () => {
              const { error: patientError } = await supabase
                .from('patients')
                .insert({
                  user_id: data.user.id,
                  dob: formData.dob,
                  gender: formData.gender,
                  medical_history: {},
                  preferences: {},
                  emergency_contact: {}
                })

              if (patientError) console.error('Patient profile error:', patientError)
            }, 1000)
          }
        }
      }
      onAuthSuccess()
    } catch (error: any) {
      console.error('Auth error:', error.message)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-white/80 border-white/30 shadow-2xl">
          <div className="absolute top-4 left-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToLanding}
              className="text-gray-600 hover:text-gray-800 rounded-2xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-full">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              MedSync AI
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isLogin ? 'Welcome back to your AI medical assistant' : 'Join the future of healthcare'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10 rounded-2xl border-2"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full pl-10 pr-3 py-2 border-2 border-input rounded-2xl bg-background text-sm"
                      required
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {formData.role === 'patient' && (
                    <>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          type="date"
                          placeholder="Date of Birth"
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          className="pl-10 rounded-2xl border-2"
                          required
                        />
                      </div>
                      <div className="relative">
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-input rounded-2xl bg-background text-sm"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 rounded-2xl border-2"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 rounded-2xl border-2"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-500 text-center">
              By continuing, you agree to our{' '}
              <button 
                onClick={() => onViewChange('terms')}
                className="text-blue-600 hover:underline"
              >
                Terms of Service
              </button>
              {' '}and{' '}
              <button 
                onClick={() => onViewChange('privacy')}
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}