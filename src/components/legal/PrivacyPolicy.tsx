import React from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Globe, 
  UserCheck,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Heart,
  Server,
  Key,
  FileText
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface PrivacyPolicyProps {
  onBack: () => void
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: "We collect personal information you provide (name, email, medical history), usage data (symptoms, interactions with AI agents), and technical data (device information, IP address) to provide personalized healthcare assistance."
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: "Your data is used to provide AI-powered medical assistance, improve our algorithms, ensure platform security, and comply with healthcare regulations. We never sell your personal health information to third parties."
    },
    {
      icon: Lock,
      title: "Data Security & Encryption",
      content: "All personal health information is encrypted both in transit and at rest using industry-standard AES-256 encryption. Our infrastructure is HIPAA-compliant and regularly audited for security vulnerabilities."
    },
    {
      icon: UserCheck,
      title: "Your Privacy Rights",
      content: "You have the right to access, update, or delete your personal information. You can also request data portability, restrict processing, and withdraw consent for non-essential data processing at any time."
    },
    {
      icon: Server,
      title: "Data Storage & Retention",
      content: "Your data is stored securely on Supabase infrastructure with automatic backups. Medical data is retained for 7 years as required by healthcare regulations, while general usage data is retained for 3 years."
    },
    {
      icon: Globe,
      title: "International Data Transfers",
      content: "As a global platform, your data may be processed in different countries. We ensure all transfers comply with GDPR, CCPA, and other applicable privacy laws through appropriate safeguards and agreements."
    },
    {
      icon: Heart,
      title: "Health Information Protection",
      content: "We follow strict HIPAA guidelines for protected health information (PHI). Your medical data is compartmentalized, access-controlled, and only used for providing healthcare services and improving AI accuracy."
    },
    {
      icon: Key,
      title: "Third-Party Integrations",
      content: "We integrate with trusted partners (Groq for AI processing, Supabase for data storage) under strict data processing agreements. These partners are also required to maintain the same privacy and security standards."
    }
  ]

  const dataTypes = [
    { type: "Personal Information", examples: "Name, email, date of birth, contact details", retention: "Account lifetime + 1 year" },
    { type: "Medical Data", examples: "Symptoms, diagnoses, prescriptions, vitals", retention: "7 years (regulatory requirement)" },
    { type: "Usage Data", examples: "AI interactions, session logs, feature usage", retention: "3 years" },
    { type: "Technical Data", examples: "IP address, device info, browser data", retention: "1 year" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 150 + 30}px`,
                height: `${Math.random() * 150 + 30}px`,
              }}
              animate={{
                x: [0, Math.random() * 40 - 20],
                y: [0, Math.random() * 40 - 20],
                scale: [1, Math.random() * 0.4 + 0.6],
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
            className="mb-6 border-indigo-400/50 text-indigo-400 hover:bg-indigo-400/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl border border-indigo-400/30 mb-6">
              <Shield className="w-10 h-10 text-indigo-400" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your privacy is our priority. Learn how we collect, use, and protect your personal 
              and health information in compliance with global privacy regulations.
            </p>
            <div className="mt-6 text-sm text-gray-400">
              Last updated: January 2025 | Effective Date: January 1, 2025
            </div>
          </div>
        </motion.div>

        {/* Privacy Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-lg border-indigo-400/30">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-400">
                <CheckCircle className="w-6 h-6 mr-3" />
                Our Privacy Commitment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">HIPAA Compliant</h4>
                  <p className="text-sm">Full compliance with healthcare privacy regulations</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">End-to-End Encryption</h4>
                  <p className="text-sm">Your data is encrypted at all times</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Your Control</h4>
                  <p className="text-sm">Full control over your personal data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Types Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="w-6 h-6 mr-3 text-indigo-400" />
                Data We Collect & Retention Periods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 text-indigo-400">Data Type</th>
                      <th className="text-left py-3 text-indigo-400">Examples</th>
                      <th className="text-left py-3 text-indigo-400">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataTypes.map((item, index) => (
                      <tr key={index} className="border-b border-slate-700/50">
                        <td className="py-3 font-medium text-white">{item.type}</td>
                        <td className="py-3 text-gray-300">{item.examples}</td>
                        <td className="py-3 text-gray-300">{item.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-slate-700/50 hover:border-indigo-400/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <div className="p-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl mr-3">
                      <section.icon className="w-5 h-5 text-indigo-400" />
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

        {/* Data Subject Rights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-lg border-green-400/30">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <UserCheck className="w-6 h-6 mr-3" />
                Your Data Rights (GDPR & CCPA Compliant)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-3">Access & Control Rights:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Right to access your personal data
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Right to rectify inaccurate information
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Right to delete your data (right to be forgotten)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Right to data portability
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3">Processing Rights:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Right to restrict processing
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Right to object to processing
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Right to withdraw consent
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      Right to lodge a complaint
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg border-slate-700/50">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Privacy Questions or Concerns?</h3>
              <p className="text-gray-300 mb-6">
                Our Data Protection Officer is available to help with any privacy-related questions or to assist with exercising your data rights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="border-indigo-400/50 text-indigo-400 hover:bg-indigo-400/10"
                >
                  Contact DPO
                </Button>
                <Button
                  variant="outline"
                  className="border-green-400/50 text-green-400 hover:bg-green-400/10"
                >
                  Exercise Data Rights
                </Button>
                <Button
                  onClick={onBack}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  I Understand
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}