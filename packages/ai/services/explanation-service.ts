import { openai } from '@ai-sdk/openai'
import { generateObject, streamText } from 'ai'
import { z } from 'zod'
import type { StudentAbilityProfile, MultimodalExplanation, QueryContext } from '../types'

// PRD v3 Specification: Next-Generation AI Explanations
// GPT-4o powered explanation system with multimodal output and cultural context

const ExplanationSchema = z.object({
  correctAnswerReasoning: z.string().describe('2-3 sentences explaining why the correct answer is right with Indian context'),
  incorrectOptionsAnalysis: z.array(z.object({
    option: z.enum(['A', 'B', 'C', 'D']),
    reason: z.string().describe('Why this option is incorrect with common student mistakes')
  })),
  conceptReview: z.string().describe('Key concepts with NCERT references and real-world Indian examples'),
  memoryTip: z.string().optional().describe('Mnemonic or memory technique using Indian cultural references'),
  relatedTopics: z.array(z.string()).describe('Related topics for further study'),
  difficulty: z.enum(['basic', 'intermediate', 'advanced']),
  confidence: z.number().min(0).max(1).describe('AI confidence in the explanation'),
  culturalAdaptation: z.object({
    indianExamples: z.array(z.string()).describe('Examples using Indian festivals, food, geography'),
    vernacularSupport: z.boolean().describe('Whether explanation supports regional language translation'),
    parentCommunicationTips: z.string().optional().describe('How parents can help with this concept')
  })
})

export type Explanation = z.infer<typeof ExplanationSchema>

export class ExplanationService {
  private readonly model = openai('gpt-4o-2024-11-20') // PRD v3 specified model

  /**
   * Generate comprehensive AI explanation aligned with PRD v3 requirements
   * Includes cultural context, emotional intelligence, and multi-format delivery
   */
  async generateExplanation(
    questionText: string,
    options: Record<string, string>,
    correctOption: string,
    subject: 'Physics' | 'Chemistry' | 'Biology',
    studentProfile?: StudentAbilityProfile,
    culturalContext: string = 'Indian',
    language: string = 'English'
  ): Promise<Explanation> {
    const culturalPrompt = this.buildCulturalContext(culturalContext)
    const personalizedPrompt = this.buildPersonalizedContext(studentProfile)
    
    const systemPrompt = `You are NEET Buddy 3.0, India's most advanced AI tutor for ${subject}. 
    
You have deep understanding of:
- Indian education system and NCERT curriculum
- Regional cultural contexts and examples
- Common mistakes Indian students make
- Effective teaching methods for Indian learners
- Emotional support and motivation techniques

${culturalPrompt}
${personalizedPrompt}

Provide explanations that are:
- Culturally relevant with Indian examples
- Emotionally supportive and encouraging
- Pedagogically sound with step-by-step reasoning
- Connected to real-world applications in Indian context`

    const userPrompt = `Explain this ${subject} question for a NEET student:

Question: ${questionText}

Options:
${Object.entries(options).map(([key, value]) => `${key}: ${value}`).join('\n')}

Correct Answer: ${correctOption}

Student Level: ${studentProfile?.overallAbility ? this.getStudentLevelDescription(studentProfile.overallAbility) : 'intermediate'}
Language: ${language}
Cultural Context: ${culturalContext}`

    const { object } = await generateObject({
      model: this.model,
      system: systemPrompt,
      prompt: userPrompt,
      schema: ExplanationSchema,
      temperature: 0.3, // Lower temperature for accuracy
    })

    return object
  }

  /**
   * Handle follow-up questions with conversation context
   * PRD v3: Follow-up conversation capability
   */
  async handleFollowUpQuery(
    originalExplanation: Explanation,
    followUpQuery: string,
    conversationHistory: any[],
    studentProfile?: StudentAbilityProfile
  ): Promise<string> {
    const conversationContext = conversationHistory.slice(-3) // Last 3 exchanges
    
    const systemPrompt = `Continue the conversation as NEET Buddy 3.0. 
    Previous explanation context: ${originalExplanation.conceptReview}
    
    Maintain:
    - Encouraging and supportive tone
    - Indian cultural references
    - Connection to previous explanation
    - Student's emotional state consideration`

    const { textStream } = await streamText({
      model: this.model,
      system: systemPrompt,
      prompt: `Previous conversation: ${JSON.stringify(conversationContext)}
      
      Student's follow-up question: ${followUpQuery}`,
      temperature: 0.5
    })

    let response = ''
    for await (const chunk of textStream) {
      response += chunk
    }
    
    return response
  }

  /**
   * Generate study plan based on weak areas
   * PRD v3: AI-generated personalized study schedules
   */
  async generateStudyPlan(
    weakAreas: string[],
    timeAvailable: number, // hours per day
    targetScore: number,
    currentLevel: Record<string, number>,
    studentProfile?: StudentAbilityProfile
  ): Promise<any> {
    // Implementation for AI-generated study plans
    const prompt = `Create a personalized NEET study plan for an Indian student:
    
    Weak Areas: ${weakAreas.join(', ')}
    Available Study Time: ${timeAvailable} hours/day
    Target NEET Score: ${targetScore}
    Current Performance: ${JSON.stringify(currentLevel)}
    
    Consider:
    - Indian academic calendar
    - Regional exam patterns
    - Cultural festivals and holidays
    - Student's emotional and stress levels
    - NCERT curriculum alignment`

    const { textStream } = await streamText({
      model: this.model,
      prompt,
      temperature: 0.4
    })

    let plan = ''
    for await (const chunk of textStream) {
      plan += chunk
    }
    
    return JSON.parse(plan)
  }

  private buildCulturalContext(culturalContext: string): string {
    return `Cultural Context Guidelines:
- Use examples from Indian festivals (Diwali, Holi, etc.), food (dal, rice, etc.), and geography
- Reference familiar Indian brands, landmarks, and cultural practices
- Consider joint family structures and parental expectations
- Use appropriate respect levels when parents might be listening
- Include region-specific examples when relevant (${culturalContext})`
  }

  private buildPersonalizedContext(studentProfile?: StudentAbilityProfile): string {
    if (!studentProfile) return ''
    
    return `Student Profile:
- Learning Style: ${this.getLearningStyleDescription(studentProfile.learningStyle)}
- Current Stress Level: ${studentProfile.emotionalState.stressLevel}
- Confidence Level: ${studentProfile.emotionalState.confidenceLevel}
- Attention Span: ${studentProfile.learningStyle.attentionSpan} minutes

Adjust explanation style accordingly - use more visual aids for visual learners, include motivational support for low confidence, etc.`
  }

  private getStudentLevelDescription(ability: number): string {
    if (ability < -1) return 'beginner - needs foundational concepts'
    if (ability < 0) return 'intermediate - building on basics'
    if (ability < 1) return 'advanced - ready for complex applications'
    return 'expert - preparing for top percentile'
  }

  private getLearningStyleDescription(learningStyle: any): string {
    const styles = []
    if (learningStyle.visualLearner > 0.7) styles.push('visual')
    if (learningStyle.auditoryLearner > 0.7) styles.push('auditory')
    if (learningStyle.kinestheticLearner > 0.7) styles.push('kinesthetic')
    if (learningStyle.readingWritingLearner > 0.7) styles.push('reading/writing')
    return styles.join(', ') || 'mixed'
  }
}

export const explanationService = new ExplanationService()
