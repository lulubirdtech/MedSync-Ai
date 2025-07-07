import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  FileText, 
  Users, 
  Lock, 
  AlertTriangle, 
  CheckCircle,
  ArrowLeft,
  Scale,
  Globe,
  Heart
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface TermsOfServiceProps {
  onBack: () => void
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: "By accessing and using MedSync AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      icon: Users,
      title: "User Accounts",
      content: "You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree not to disclose your password to any third party and to take sole responsibility for activities that occur under your account."
    },
    {
      icon: Heart,
      title: "Medical Disclaimer",
      content: "MedSync AI provides AI-powered medical assistance for informational purposes only. Our service is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers."
    },
    {
      icon: Lock,
      title: "Privacy & Data Protection",
      content: "We are committed to protecting your privacy and personal health information. All data is encrypted and stored securely in compliance with HIPAA regulations and international privacy standards."
    },
    {
      icon: Shield,
      title: "AI Technology Limitations",
      content: "While our AI agents are trained on extensive medical data, they may not always provide accurate diagnoses. Users should verify all medical information with qualified healthcare professionals before making health decisions."
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Uses",
      content: "You may not use our service for any unlawful purpose, to transmit harmful content, or to interfere with the security or functionality of the platform. Emergency medical situations require immediate professional medical attention."
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: "MedSync AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service, including but not limited to medical decisions based on AI recommendations."
    },
    {
      icon: Globe,
      title: "International Use",
      content: "Our service is available globally with multilingual support. However, medical regulations and standards may vary by country. Users are responsible for ensuring compliance with local healthcare regulations."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                scale: [1, Math.random() * 0.3 + 0.7],
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-6 border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl border border-blue-400/30 mb-6">
              <Scale className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Please read these terms carefully before using MedSync AI. 
              These terms govern your use of our AI-powered medical assistance platform.
            </p>
            <div className="mt-6 text-sm text-gray-400">
              Last updated: January 2025 | Effective Date: January 1, 2025
            </div>
          </div>
        </motion.div>

        {/* Quick Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg border-blue-400/30">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-400">
                <CheckCircle className="w-6 h-6 mr-3" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">What We Provide:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• AI-powered medical assistance and consultation</li>
                    <li>• Multi-agent diagnostic support system</li>
                    <li>• Multilingual healthcare communication</li>
                    <li>• Secure patient data management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Your Responsibilities:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Use service for informational purposes only</li>
                    <li>• Consult healthcare professionals for medical decisions</li>
                    <li>• Maintain account security and confidentiality</li>
                    <li>• Comply with applicable laws and regulations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Terms Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-slate-700/50 hover:border-blue-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mr-3">
                      <section.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-lg border-red-400/30">
            <CardHeader>
              <CardTitle className="flex items-center text-red-400">
                <AlertTriangle className="w-6 h-6 mr-3" />
                Important Medical Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-4">
                <strong className="text-white">Emergency Situations:</strong> MedSync AI is not designed for emergency medical situations. 
                If you are experiencing a medical emergency, immediately contact your local emergency services (911, 112, etc.) or go to the nearest emergency room.
              </p>
              <p className="mb-4">
                <strong className="text-white">Professional Medical Advice:</strong> Our AI agents provide preliminary assessments and general health information. 
                This information should never replace professional medical advice, diagnosis, or treatment from qualified healthcare providers.
              </p>
              <p>
                <strong className="text-white">Accuracy Limitations:</strong> While our AI is trained on extensive medical data, 
                it may not always provide accurate or complete information. Always verify medical information with healthcare professionals.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-slate-700/50">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Questions About These Terms?</h3>
              <p className="text-gray-300 mb-6">
                If you have any questions about these Terms of Service, please contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                >
                  Contact Legal Team
                </Button>
                <Button
                  onClick={onBack}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  I Understand & Agree
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}