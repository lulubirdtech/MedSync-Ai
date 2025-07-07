import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Enhanced error handling with fallback responses
const handleApiError = (error: any, fallbackMessage: string) => {
  console.error('AI API Error:', error);
  return fallbackMessage;
};

export const analyzeSymptoms = async (symptoms: string): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Dr. MedSync, an expert AI medical assistant. Analyze symptoms and provide comprehensive medical insights in a structured format. Use clear headings and bullet points. Avoid using asterisks (**) in your response. Always recommend consulting healthcare professionals for serious concerns."
        },
        {
          role: "user",
          content: `Please analyze these symptoms and provide a comprehensive medical assessment: ${symptoms}

Format your response with clear sections:
- Likely Condition
- Natural Remedies  
- Healing Foods & Diet
- Recommended Medications
- How to Take Treatment
- Important Warning`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content || "Unable to analyze symptoms at this time.";
    return response.replace(/\*\*/g, ''); // Remove asterisks
  } catch (error) {
    return handleApiError(error, "I'm currently experiencing connectivity issues. Please try again in a moment. For immediate medical concerns, please consult a healthcare professional.");
  }
};

export const analyzeMedicalImage = async (imageDescription: string, annotations: string): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Dr. MedSync, a medical imaging specialist AI. Analyze medical images based on descriptions and computer vision annotations. Provide detailed insights about detected anomalies and body parts. Use clear formatting without asterisks."
        },
        {
          role: "user",
          content: `Analyze this medical image:

Image Description: ${imageDescription}
Computer Vision Annotations: ${annotations}

Please provide:
1. Body Part Identification
2. Detected Anomalies
3. Clinical Observations
4. Recommended Actions
5. Important Disclaimers

Remember: This is preliminary analysis only. Professional medical evaluation is essential.`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 1200,
    });

    const response = completion.choices[0]?.message?.content || "Unable to analyze image at this time.";
    return response.replace(/\*\*/g, '');
  } catch (error) {
    return handleApiError(error, "Image analysis is temporarily unavailable. Please try again later or consult with a healthcare professional for proper medical image evaluation.");
  }
};

export const checkMedication = async (medication: string): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Dr. MedSync, a pharmaceutical specialist AI. Provide comprehensive medication information including interactions, dosages, and safety guidelines. Use clear formatting without asterisks."
        },
        {
          role: "user",
          content: `Provide detailed information about this medication: ${medication}

Include:
- Medication Overview
- Common Uses
- Dosage Guidelines
- Potential Side Effects
- Drug Interactions
- Safety Precautions
- When to Consult Doctor`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 1200,
    });

    const response = completion.choices[0]?.message?.content || "Unable to check medication at this time.";
    return response.replace(/\*\*/g, '');
  } catch (error) {
    return handleApiError(error, "Medication information is temporarily unavailable. Please consult your pharmacist or healthcare provider for accurate medication guidance.");
  }
};

export const explainMedicalTerm = async (term: string): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Dr. MedSync, a medical education specialist. Explain medical terms in simple, understandable language with practical examples. Use clear formatting without asterisks."
        },
        {
          role: "user",
          content: `Please explain this medical term in simple language: ${term}

Include:
- Simple Definition
- What It Means for Patients
- Common Causes
- Related Symptoms
- When to Be Concerned
- Practical Examples`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || "Unable to explain term at this time.";
    return response.replace(/\*\*/g, '');
  } catch (error) {
    return handleApiError(error, "Medical term explanation is temporarily unavailable. Please try again later or consult medical resources.");
  }
};

export const generateHealthCoaching = async (userProfile: any, goals: string): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Dr. MedSync, a certified health coach and wellness expert. Create personalized health plans with specific, actionable recommendations. Use clear formatting without asterisks. Provide practical, evidence-based advice."
        },
        {
          role: "user",
          content: `Create a personalized health coaching plan for these goals: ${goals}

User Profile: ${JSON.stringify(userProfile)}

Please provide:
- Personalized Health Assessment
- Daily Action Plan
- Nutrition Recommendations
- Exercise Guidelines
- Lifestyle Modifications
- Progress Tracking Tips
- Motivational Strategies
- Weekly Milestones

Make recommendations specific and actionable with real-world examples.`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content || "Unable to provide coaching at this time.";
    return response.replace(/\*\*/g, '');
  } catch (error) {
    return handleApiError(error, "Health coaching is temporarily unavailable. Please try again later. In the meantime, focus on basic healthy habits like regular exercise, balanced nutrition, and adequate sleep.");
  }
};

export const generateReportSummary = async (medicalData: any): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Dr. MedSync, a medical report specialist. Generate comprehensive health summaries from medical data with clear insights and recommendations. Use clear formatting without asterisks."
        },
        {
          role: "user",
          content: `Generate a comprehensive health report summary from this data: ${JSON.stringify(medicalData)}

Include:
- Overall Health Assessment
- Vital Signs Analysis
- Risk Factors Identified
- Health Trends
- Recommendations
- Follow-up Actions
- Lifestyle Suggestions
- When to Seek Medical Care`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content || "Unable to generate report at this time.";
    return response.replace(/\*\*/g, '');
  } catch (error) {
    return handleApiError(error, "Health report generation is temporarily unavailable. Please try again later or consult with your healthcare provider for a comprehensive health assessment.");
  }
};

export const generateAIDoctorConsultation = async (patientInput: string, medicalHistory?: any): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Dr. MedSync AI, a General Physician AI Doctor conducting a live voice consultation with a patient. 

Your role:
- Listen to patient concerns with empathy
- Ask relevant follow-up questions
- Classify ailments accurately
- Explain causes and prevention
- Recommend specific treatments including:
  * Healing foods (specific fruits, vegetables with quantities)
  * Exercises (with clear step-by-step instructions)
  * Medications (with exact dosage, frequency, and interaction warnings)
- Provide voice-friendly responses
- Use clear, conversational language without asterisks
- Give practical, real-world examples
- Consider medication interactions and contraindications

Always prioritize patient safety and recommend professional medical care when needed.`
        },
        {
          role: "user",
          content: `Patient says: "${patientInput}"

Medical History: ${JSON.stringify(medicalHistory || {})}

Please respond as an AI doctor conducting a live consultation. Provide:
1. Empathetic acknowledgment
2. Relevant questions or assessment
3. Preliminary diagnosis/classification
4. Specific treatment recommendations:
   - Healing foods with exact quantities (e.g., "Eat 2 medium oranges daily for Vitamin C, 1 cup of spinach for iron")
   - Exercises with detailed instructions (e.g., "Walk briskly for 30 minutes twice daily, do 10 deep breathing exercises")
   - Medications with complete details (e.g., "Paracetamol 500mg every 8 hours after meals, maximum 3 grams per day. Avoid alcohol.")
5. Prevention advice
6. When to seek immediate care

Provide real-world, practical examples and be specific about quantities, timing, and precautions.`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
      max_tokens: 1200,
    });

    const response = completion.choices[0]?.message?.content || "I'm having trouble processing your request right now. Please try again.";
    return response.replace(/\*\*/g, '');
  } catch (error) {
    return handleApiError(error, "I'm experiencing connectivity issues. For immediate medical concerns, please contact emergency services or visit your nearest healthcare facility.");
  }
};