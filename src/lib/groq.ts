import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || 'dummy-key-for-development',
  dangerouslyAllowBrowser: true
})

export interface SymptomAnalysis {
  diagnosis: string
  medications: string[]
  naturalRemedies: string[]
  foods: string[]
  exercises: string[]
  causes: string[]
  prevention: string[]
  disclaimer: string
}

export class GroqService {
  static async analyzeSymptoms(symptoms: string): Promise<SymptomAnalysis> {
    try {
      const prompt = `As an AI medical assistant, analyze these symptoms: "${symptoms}"

Provide a structured response in JSON format with the following fields:
- diagnosis: Brief preliminary diagnosis
- medications: Array of OTC medication suggestions with dosage
- naturalRemedies: Array of natural remedy suggestions
- foods: Array of beneficial foods to consume
- exercises: Array of recommended exercises (if applicable)
- causes: Array of possible causes
- prevention: Array of preventive strategies
- disclaimer: Medical disclaimer

Format as valid JSON only.`

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 1024
      })

      const response = completion.choices[0]?.message?.content
      if (!response) throw new Error('No response from Groq')

      try {
        return JSON.parse(response)
      } catch {
        // Fallback if JSON parsing fails
        return {
          diagnosis: response.substring(0, 200),
          medications: ['Consult a healthcare provider'],
          naturalRemedies: ['Rest and hydration'],
          foods: ['Balanced diet'],
          exercises: ['Light activity as tolerated'],
          causes: ['Various factors'],
          prevention: ['Healthy lifestyle'],
          disclaimer: 'This is not professional medical advice. Consult a healthcare provider.'
        }
      }
    } catch (error) {
      console.error('Groq API error:', error)
      throw new Error('Failed to analyze symptoms')
    }
  }

  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{
          role: 'user',
          content: `Translate the following medical text to ${targetLanguage}. Only provide the translation:\n\n${text}`
        }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.3,
        max_tokens: 512
      })

      return completion.choices[0]?.message?.content || text
    } catch (error) {
      console.error('Translation error:', error)
      return text
    }
  }

  static async generateHealthTips(): Promise<string[]> {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{
          role: 'user',
          content: 'Generate 5 concise, actionable health tips for daily well-being. Return as JSON array of strings.'
        }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.8,
        max_tokens: 256
      })

      const response = completion.choices[0]?.message?.content
      if (!response) return []

      try {
        return JSON.parse(response)
      } catch {
        return response.split('\n').filter(tip => tip.trim()).slice(0, 5)
      }
    } catch (error) {
      console.error('Health tips error:', error)
      return []
    }
  }
}