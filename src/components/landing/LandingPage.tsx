import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Brain, 
  Stethoscope, 
  Users, 
  Globe, 
  Zap, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Mic,
  Video,
  MessageSquare,
  Calendar,
  Pill,
  Activity,
  Camera,
  Languages,
  ChevronRight
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface LandingPageProps {
  onGetStarted: () => void
  onViewChange: (view: 'landing' | 'auth' | 'terms' | 'privacy' | 'contact' | 'dashboard') => void
}

export function LandingPage({ onGetStarted, onViewChange }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const patientFeatures = [
    {
      icon: Mic,
      title: "Voice Symptom Checker",
      description: "Speak your symptoms naturally and get instant AI-powered preliminary diagnosis",
      color: "from-emerald-400 to-teal-500"
    },
    {
      icon: Brain,
      title: "AI Doctor Assistant",
      description: "24/7 access to AI medical consultation with personalized treatment recommendations",
      color: "from-purple-400 to-indigo-500"
    },
    {
      icon: Languages,
      title: "Multilingual Support",
      description: "Real-time translation in 50+ languages for global healthcare accessibility",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Calendar,
      title: "Smart Appointment Booking",
      description: "AI agents automatically schedule appointments with the best-matched doctors",
      color: "from-pink-400 to-rose-500"
    },
    {
      icon: Activity,
      title: "Health Coach AI",
      description: "Personalized chronic disease management with intelligent health tracking",
      color: "from-orange-400 to-amber-500"
    },
    {
      icon: Camera,
      title: "Photo Diagnosis",
      description: "Upload medical images for instant AI analysis and preliminary diagnosis",
      color: "from-violet-400 to-purple-500"
    }
  ]

  const doctorFeatures = [
    {
      icon: Stethoscope,
      title: "Live AI Assistant",
      description: "Real-time AI suggestions during consultations with differential diagnosis support",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: MessageSquare,
      title: "Auto Transcription",
      description: "Automatic meeting transcripts, summaries, and action item generation",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: Video,
      title: "Enhanced Consultations",
      description: "Video consultations with AI translation and real-time clinical insights",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: Pill,
      title: "Smart Prescriptions",
      description: "AI-powered medication recommendations with interaction checking",
      color: "from-yellow-400 to-orange-500"
    }
  ]

  const stats = [
    { number: "99.2%", label: "Diagnostic Accuracy", icon: Brain },
    { number: "50+", label: "Languages Supported", icon: Globe },
    { number: "24/7", label: "AI Availability", icon: Zap },
    { number: "HIPAA", label: "Compliant Security", icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, Math.random() * 0.5 + 0.5],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              MedSync AI
            </span>
          </motion.div>
          
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onGetStarted}
              className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10"
            >
              Sign In
            </Button>
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 text-center py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-lg rounded-full px-6 py-3 border border-emerald-400/30 mb-6">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300">Powered by Advanced AI Agents</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              The Future
            </span>
            <br />
            <span className="text-white">of Healthcare</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Experience revolutionary healthcare with our multi-agent AI platform. 
            Voice-powered diagnostics, real-time multilingual support, and intelligent 
            medical assistance for patients and doctors worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-lg px-8 py-4 rounded-full shadow-2xl shadow-emerald-500/25"
            >
              Start Your Health Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-400/50 text-purple-300 hover:bg-purple-400/10 text-lg px-8 py-4 rounded-full"
            >
              Watch Demo
              <Video className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 py-16 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl border border-emerald-400/30 mb-4">
                  <stat.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Patient Features */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="relative z-10 py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                For Patients
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary AI-powered healthcare tools designed to empower patients with instant, 
              accurate, and personalized medical assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {patientFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="group"
              >
                <Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-slate-700/50 hover:border-emerald-400/50 transition-all duration-300">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: hoveredFeature === index ? 1 : 0,
                        x: hoveredFeature === index ? 0 : -10
                      }}
                      className="flex items-center text-emerald-400 mt-4 cursor-pointer"
                      onClick={onGetStarted}
                    >
                      <span className="text-sm font-medium">Learn more</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Doctor Features */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="relative z-10 py-20 px-6 bg-gradient-to-r from-slate-900/50 to-purple-900/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                For Doctors
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI tools that enhance clinical decision-making, streamline workflows, 
              and improve patient outcomes through intelligent automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {doctorFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.4 + index * 0.1 }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-br from-slate-800/50 to-purple-900/50 backdrop-blur-lg border-slate-700/50 hover:border-purple-400/50 transition-all duration-300">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
        className="relative z-10 py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-lg rounded-3xl border border-emerald-400/30 p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Your Healthcare Experience?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of patients and doctors already using MedSync AI 
              to revolutionize healthcare delivery and outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-lg px-8 py-4 rounded-full shadow-2xl shadow-emerald-500/25"
              >
                Start Free Trial
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onGetStarted}
                className="border-2 border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10 text-lg px-8 py-4 rounded-full"
              >
                Schedule Demo
                <Calendar className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                MedSync AI
              </span>
            </div>
            <div className="flex space-x-8 text-gray-400">
              <button 
                onClick={() => onViewChange('terms')}
                className="hover:text-emerald-400 transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => onViewChange('privacy')}
                className="hover:text-emerald-400 transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => onViewChange('contact')}
                className="hover:text-emerald-400 transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700/50 text-center text-gray-400">
            <p>&copy; 2025 MedSync AI. All rights reserved. Built for RAISE YOUR HACK 2025.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}