import { GroqService } from './groq'
import { supabase } from './supabase'

export interface AgentSession {
  id: string
  userId: string
  agentType: string
  inputText: string
  outputText: string
  startedAt: string
  endedAt?: string
  metadata?: any
}

export class AgentOrchestrator {
  static async createSession(
    userId: string,
    agentType: string,
    inputText: string
  ): Promise<string> {
    const { data, error } = await supabase
      .from('agent_sessions')
      .insert({
        user_id: userId,
        agent_type: agentType,
        input_text: inputText,
        output_text: '',
        started_at: new Date().toISOString(),
        metadata: {}
      })
      .select('id')
      .single()

    if (error) throw error
    return data.id
  }

  static async updateSession(
    sessionId: string,
    outputText: string,
    metadata?: any
  ): Promise<void> {
    const { error } = await supabase
      .from('agent_sessions')
      .update({
        output_text: outputText,
        ended_at: new Date().toISOString(),
        metadata
      })
      .eq('id', sessionId)

    if (error) throw error
  }

  static async processSymptoms(userId: string, symptoms: string) {
    const sessionId = await this.createSession(userId, 'symptom_checker', symptoms)
    
    try {
      const analysis = await GroqService.analyzeSymptoms(symptoms)
      await this.updateSession(sessionId, JSON.stringify(analysis), { analysis })
      return analysis
    } catch (error) {
      await this.updateSession(sessionId, 'Error processing symptoms', { error: error.message })
      throw error
    }
  }

  static async getUserSessions(userId: string): Promise<AgentSession[]> {
    const { data, error } = await supabase
      .from('agent_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export class HealthCoachAgent {
  static async generatePersonalizedPlan(userId: string, healthGoals: string[]) {
    const sessionId = await AgentOrchestrator.createSession(
      userId,
      'health_coach',
      `Health goals: ${healthGoals.join(', ')}`
    )

    try {
      const tips = await GroqService.generateHealthTips()
      const plan = {
        dailyTips: tips,
        goals: healthGoals,
        recommendations: [
          'Track your daily water intake',
          'Maintain regular sleep schedule',
          'Practice mindfulness for 10 minutes daily'
        ]
      }

      await AgentOrchestrator.updateSession(sessionId, JSON.stringify(plan), { plan })
      return plan
    } catch (error) {
      await AgentOrchestrator.updateSession(sessionId, 'Error generating plan', { error: error.message })
      throw error
    }
  }
}

export class TranslationAgent {
  static async translateMedicalText(
    userId: string,
    text: string,
    targetLanguage: string
  ) {
    const sessionId = await AgentOrchestrator.createSession(
      userId,
      'translation',
      `Translate to ${targetLanguage}: ${text.substring(0, 100)}...`
    )

    try {
      const translation = await GroqService.translateText(text, targetLanguage)
      await AgentOrchestrator.updateSession(sessionId, translation, {
        originalText: text,
        targetLanguage,
        translation
      })
      return translation
    } catch (error) {
      await AgentOrchestrator.updateSession(sessionId, 'Translation failed', { error: error.message })
      throw error
    }
  }
}