# MedSync AI 🏥🤖

A cutting-edge, multi-agent medical assistant platform for patients and doctors, blending voice, text, video, multilingual support, and real-time AI recommendations.

## 🏆 Built for RAISE YOUR HACK 2025

This project is designed to compete in the RAISE YOUR HACK hackathon, integrating multiple sponsor technologies:

- **Groq API** with **Llama 3.1** models for AI inference
- **Coral Protocol** for multi-agent orchestration
- **Fetch.ai** for autonomous agent systems
- **Supabase** for real-time database and authentication
- **Snowflake** for analytics and data warehousing

## ✨ Core Features

### Patient App
- 🎤 **Voice-based symptom checker** with Groq Speech Models
- 🤖 **AI doctor interface** for diagnosis and treatment recommendations
- 🌍 **Real-time multilingual support** with live translation
- 📅 **Appointment booking** with AI agents
- 💊 **AI Health Coach** for chronic disease management
- 🛒 **AI-powered marketplace** with price aggregation and checkout

### Doctor App
- 🩺 **Live AI assistant** with real-time suggestions
- 📝 **Meeting transcripts** and automated summaries
- 📊 **EHR integration** and vitals dashboard
- 🎥 **Video consultations** with AI translation

### Admin Dashboard
- 📈 **Agent monitoring** and health metrics
- 📊 **Snowflake analytics** for patient outcomes
- 🔧 **System management** and configuration

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** with glassmorphic design
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend & AI
- **Groq API** for Llama 3.1 inference
- **Coral Protocol** for multi-agent coordination
- **Fetch.ai** for autonomous agents
- **Supabase** for database and real-time features
- **Snowflake** for analytics

### Real-time & Media
- **Supabase Realtime** for live updates
- **LiveKit** for video consultations
- **Groq Speech** for ASR/TTS

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medsync-ai.git
   cd medsync-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in your API keys and configuration
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the database migrations (see `/supabase/migrations/`)
   - Update your `.env` with Supabase credentials

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

MedSync AI uses a comprehensive Supabase PostgreSQL schema:

- **users** - User profiles and authentication
- **patients** - Patient-specific data and medical history
- **doctors** - Doctor profiles and specialties
- **appointments** - Scheduling and consultation management
- **agent_sessions** - Multi-agent interaction logs
- **vitals** - Patient vital signs tracking
- **prescriptions** - Medication management
- **transactions** - Payment and marketplace data

## 🤖 Multi-Agent Architecture

MedSync AI uses a sophisticated multi-agent system:

1. **SymptomAgent** - Analyzes patient symptoms
2. **DiagnosisAgent** - Provides preliminary diagnoses
3. **RemedyAgent** - Suggests treatments and remedies
4. **TranslationAgent** - Handles multilingual support
5. **ScheduleAgent** - Manages appointments
6. **SalesAgent** - Handles marketplace transactions
7. **HealthCoachAgent** - Provides personalized health guidance

## 🌐 API Integration

### Groq API
```typescript
import { GroqService } from './lib/groq'

const analysis = await GroqService.analyzeSymptoms(symptoms)
```

### Coral Protocol
```typescript
import { AgentOrchestrator } from './lib/agents'

const session = await AgentOrchestrator.processSymptoms(userId, symptoms)
```

## 🔐 Security & Privacy

- **HIPAA-compliant** data handling
- **End-to-end encryption** for sensitive data
- **Role-based access control** (Patient/Doctor/Admin)
- **Audit logging** for all medical interactions

## 📱 Mobile Responsive

Fully responsive design optimized for:
- 📱 Mobile devices
- 💻 Tablets
- 🖥️ Desktop computers

## 🌍 Multilingual Support

Built-in support for:
- 🇺🇸 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇨🇳 Mandarin
- 🇩🇪 German

## 💳 Payment Integration

- **Paystack** (primary) for African markets
- **Stripe** for global payments
- Multi-currency support (₦ Naira + $ USD)

## 📊 Analytics & Monitoring

- **Snowflake** integration for data analytics
- **Real-time monitoring** with Coral Studio
- **Performance metrics** and health dashboards

## 🚀 Deployment

The platform is designed for deployment on:
- **Vercel** (frontend and API routes)
- **Supabase** (database and edge functions)
- **Coral Studio** (agent monitoring)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Competition Details

Built for **RAISE YOUR HACK 2025** - competing for:
- Best use of Groq API
- Best use of Coral Protocol
- Best use of Fetch.ai
- Innovation in Healthcare AI

## 📞 Support

For support and questions:
- 📧 Email: support@medsync.ai
- 💬 Discord: [Join our community]
- 📖 Documentation: [docs.medsync.ai]

---
