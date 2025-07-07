import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Brain,
  Video,
  Mic,
  MicOff
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { supabase } from '../../lib/supabase'

interface DoctorDashboardProps {
  user: any
}

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState('patients')
  const [isListening, setIsListening] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    loadDoctorData()
  }, [user.id])

  const loadDoctorData = async () => {
    try {
      // Load patients and appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select(`
          *,
          patients:patient_id (
            *,
            users:user_id (name, email)
          )
        `)
        .eq('doctor_id', user.id)
        .order('scheduled_at', { ascending: true })

      setAppointments(appointmentsData || [])
    } catch (error) {
      console.error('Error loading doctor data:', error)
    }
  }

  const startAIListening = () => {
    setIsListening(true)
    // Simulate AI listening and generating suggestions
    setTimeout(() => {
      setAiSuggestions([
        'Consider checking blood pressure',
        'Recommend chest X-ray',
        'Suggest follow-up in 2 weeks',
        'Review current medications'
      ])
      setIsListening(false)
    }, 3000)
  }

  const tabs = [
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Brain },
    { id: 'consultations', label: 'Live Consults', icon: Video },
    { id: 'reports', label: 'Reports', icon: FileText }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dr. {user.user_metadata?.name || user.email}
          </h1>
          <p className="text-gray-600">AI-Enhanced Medical Practice Dashboard</p>
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 rounded-2xl border-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'ai-assistant' && (
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    Live AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Real-time AI suggestions during consultations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
                      }`}>
                        {isListening ? (
                          <MicOff className="w-8 h-8 text-red-500" />
                        ) : (
                          <Mic className="w-8 h-8 text-blue-500" />
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {isListening ? 'AI is listening to your consultation...' : 'Start AI-assisted consultation'}
                      </p>
                      <Button
                        onClick={startAIListening}
                        disabled={isListening}
                        variant="gradient"
                        className="rounded-2xl"
                      >
                        {isListening ? 'Listening...' : 'Start AI Listening'}
                      </Button>
                    </div>
                  </div>

                  {aiSuggestions.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800">AI Suggestions:</h3>
                      {aiSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-blue-50 rounded-2xl border-l-4 border-blue-500"
                        >
                          <p className="text-blue-800">{suggestion}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'appointments' && (
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Today's Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
                    ) : (
                      appointments.map((appointment: any) => (
                        <div key={appointment.id} className="p-4 border-2 rounded-2xl">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {appointment.patients?.users?.name || 'Patient'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(appointment.scheduled_at).toLocaleString()}
                              </p>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'consultations' && (
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-500" />
                    Live Video Consultations
                  </CardTitle>
                  <CardDescription>
                    Multilingual video consultations with real-time AI translation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Video consultation will appear here</p>
                      <p className="text-sm opacity-75">Powered by LiveKit with AI translation</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="gradient" className="flex-1 rounded-2xl">
                      Start Consultation
                    </Button>
                    <Button variant="outline" className="rounded-2xl border-2">
                      Schedule Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    Today's Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Appointments</span>
                      <span className="font-semibold">{appointments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-semibold text-green-600">
                        {appointments.filter((a: any) => a.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-semibold text-orange-600">
                        {appointments.filter((a: any) => a.status === 'scheduled').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent AI Insights */}
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <CardTitle className="text-sm">Recent AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-2 bg-blue-50 rounded-2xl border-2 border-blue-200">
                      <p className="text-blue-800">Patient compliance improved by 23% this month</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded-2xl border-2 border-green-200">
                      <p className="text-green-800">Early diagnosis accuracy: 94%</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-2xl border-2 border-purple-200">
                      <p className="text-purple-800">3 medication interactions prevented</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}