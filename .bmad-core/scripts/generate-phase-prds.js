#!/usr/bin/env node

/**
 * BMAD-Powered PRD Generator for NEETAI Educational Platform
 * Generates comprehensive Product Requirements Documents for all development phases
 * Integrates with BMAD agents and educational context
 */

const fs = require('fs').promises;
const path = require('path');

// Simple UUID generation function
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// NEETAI Platform Development Phases
const developmentPhases = {
  phase1: {
    id: "authentication_user_management",
    name: "Authentication & User Management",
    priority: "Critical",
    duration: "6-8 weeks",
    description: "Secure authentication system with multi-role user management for students, parents, teachers, and administrators",
    key_features: [
      "Multi-factor authentication system",
      "Role-based access control (RBAC)",
      "Student profile management with parent oversight",
      "Teacher/coach dashboard and student monitoring",
      "OAuth integration for social logins",
      "Parent-student account linking and permissions",
      "Privacy controls for minors (COPPA compliance)"
    ],
    agents: ["edtech-product-manager", "neet-education-expert", "security-specialist"],
    educational_context: {
      user_types: ["students", "parents", "teachers", "administrators"],
      age_groups: ["16-19 primary", "parents 35-50", "teachers 25-45"],
      privacy_requirements: "COPPA compliance for minors",
      cultural_considerations: "Indian family dynamics and parental involvement"
    }
  },

  phase2: {
    id: "content_management_study_materials",
    name: "Content Management & Study Materials",
    priority: "Critical", 
    duration: "10-12 weeks",
    description: "Comprehensive content management system for NEET study materials with AI-powered organization and delivery",
    key_features: [
      "NEET syllabus-aligned content structure",
      "Multimedia content delivery system",
      "Content versioning and update management",
      "Difficulty-based content categorization",
      "Cross-platform content synchronization",
      "Content recommendation engine",
      "Educational content quality assurance system"
    ],
    agents: ["neet-education-expert", "content-curator", "neet-ai-specialist"],
    educational_context: {
      subjects: ["physics", "chemistry", "biology"],
      content_types: ["video_lessons", "practice_questions", "explanations", "diagrams", "formulas"],
      quality_standards: "100% accuracy, expert-reviewed, curriculum-aligned",
      delivery_optimization: "Mobile-first, low-bandwidth friendly"
    }
  },

  phase3: {
    id: "ai_powered_learning_features", 
    name: "AI-Powered Learning Features",
    priority: "High",
    duration: "8-10 weeks",
    description: "Intelligent learning system with personalization, adaptive testing, and AI-driven insights",
    key_features: [
      "Personalized learning path generation",
      "Adaptive question difficulty adjustment",
      "Intelligent doubt resolution system",
      "Performance prediction algorithms",
      "Learning style identification and adaptation",
      "Smart review scheduling with spaced repetition",
      "AI-powered explanation generation"
    ],
    agents: ["neet-ai-specialist", "neet-education-expert", "data-scientist"],
    educational_context: {
      ai_capabilities: ["GPT-4o integration", "custom educational models", "bias mitigation"],
      personalization_factors: ["learning_pace", "strength_areas", "weakness_patterns", "study_time"],
      ethical_considerations: "Transparent AI, bias-free recommendations, data privacy"
    }
  },

  phase4: {
    id: "gamification_student_engagement",
    name: "Gamification & Student Engagement", 
    priority: "Medium-High",
    duration: "6-8 weeks", 
    description: "Engagement-driven features with educational gamification and motivation systems",
    key_features: [
      "Achievement and badge system aligned with learning goals",
      "Study streak tracking and rewards",
      "Peer learning and study group features",
      "Progress visualization and milestone celebrations",
      "Healthy competition with leaderboards",
      "Study habit formation tools",
      "Motivational messaging and check-ins"
    ],
    agents: ["edtech-product-manager", "neet-education-expert", "behavioral-psychologist"],
    educational_context: {
      motivation_drivers: ["progress_visualization", "peer_recognition", "achievement_unlocking"],
      cultural_sensitivity: "Avoid excessive pressure, promote healthy competition",
      age_appropriate_design: "16-19 year old preferences and behaviors"
    }
  },

  phase5: {
    id: "analytics_performance_tracking",
    name: "Analytics & Performance Tracking",
    priority: "High", 
    duration: "8-10 weeks",
    description: "Comprehensive analytics system for learning insights, performance tracking, and predictive modeling",
    key_features: [
      "Student performance analytics dashboard",
      "Parent progress visibility and reports",
      "Teacher/coach monitoring and intervention tools",
      "Predictive NEET score modeling",
      "Learning outcome measurement and analysis",
      "Engagement pattern analysis",
      "Content effectiveness measurement"
    ],
    agents: ["data-scientist", "neet-education-expert", "edtech-product-manager"],
    educational_context: {
      metrics: ["learning_effectiveness", "engagement_rates", "knowledge_retention", "neet_readiness"],
      stakeholder_views: "Student self-monitoring, parent oversight, teacher guidance",
      privacy_balance: "Useful insights while protecting student privacy"
    }
  },

  phase6: {
    id: "optimization_scaling",
    name: "Optimization & Scaling",
    priority: "Medium",
    duration: "6-8 weeks",
    description: "Performance optimization, scalability improvements, and advanced features for large-scale deployment",
    key_features: [
      "Performance optimization for peak usage periods",
      "Mobile app performance enhancement", 
      "Offline functionality and sync optimization",
      "Load balancing and auto-scaling infrastructure",
      "Advanced caching strategies",
      "Database optimization for educational queries",
      "Mobile data usage optimization"
    ],
    agents: ["performance-engineer", "mobile-specialist", "infrastructure-architect"],
    educational_context: {
      scale_requirements: "100,000+ concurrent users during exam seasons",
      device_constraints: "Low-end Android devices, limited storage",
      network_optimization: "2G/3G network compatibility, data cost awareness"
    }
  }
};

// PRD Section Templates
const prdSections = {
  executive_summary: {
    title: "Executive Summary",
    required: true,
    agent: "edtech-product-manager",
    description: "High-level overview of the product phase, business objectives, and key success metrics"
  },
  
  educational_context: {
    title: "Educational Context & NEET Alignment",
    required: true,
    agent: "neet-education-expert", 
    description: "Educational objectives, NEET exam alignment, and pedagogical considerations"
  },

  user_personas: {
    title: "User Personas & Stakeholders",
    required: true,
    agent: "edtech-product-manager",
    description: "Detailed user personas, use cases, and stakeholder analysis"
  },

  functional_requirements: {
    title: "Functional Requirements",
    required: true,
    agent: "product-analyst",
    description: "Detailed functional specifications and feature requirements"
  },

  technical_requirements: {
    title: "Technical Requirements & Architecture",
    required: true,
    agent: "solution-architect",
    description: "Technical specifications, architecture decisions, and integration requirements"
  },

  ai_integration: {
    title: "AI Integration & Intelligent Features",
    required: false, // Only for phases that include AI features
    agent: "neet-ai-specialist",
    description: "AI capabilities, model specifications, and intelligent feature requirements"
  },

  user_experience: {
    title: "User Experience & Design Requirements",
    required: true,
    agent: "ux-designer",
    description: "User interface design, interaction patterns, and accessibility requirements"
  },

  educational_effectiveness: {
    title: "Educational Effectiveness & Outcomes",
    required: true,
    agent: "neet-education-expert",
    description: "Learning objectives, assessment strategies, and educational impact measurement"
  },

  security_privacy: {
    title: "Security & Privacy Requirements",
    required: true,
    agent: "security-specialist", 
    description: "Security measures, privacy protection, and compliance requirements"
  },

  performance_scalability: {
    title: "Performance & Scalability",
    required: true,
    agent: "performance-engineer",
    description: "Performance requirements, scalability planning, and optimization strategies"
  },

  mobile_considerations: {
    title: "Mobile & Accessibility Considerations", 
    required: true,
    agent: "mobile-specialist",
    description: "Mobile optimization, accessibility standards, and device compatibility"
  },

  success_metrics: {
    title: "Success Metrics & KPIs",
    required: true,
    agent: "data-scientist",
    description: "Key performance indicators, success criteria, and measurement frameworks"
  },

  implementation_plan: {
    title: "Implementation Plan & Milestones",
    required: true,
    agent: "project-manager",
    description: "Development timeline, milestones, dependencies, and resource requirements"
  },

  risk_mitigation: {
    title: "Risk Analysis & Mitigation",
    required: true,
    agent: "risk-analyst",
    description: "Identified risks, impact assessment, and mitigation strategies"
  },

  quality_assurance: {
    title: "Quality Assurance & Testing Strategy",
    required: true,
    agent: "qa-specialist",
    description: "Testing strategies, quality gates, and validation approaches"
  }
};

// PRD Content Generator Class
class NEETAIPRDGenerator {
  constructor(config = {}) {
    this.config = {
      outputDirectory: config.outputDirectory || '.bmad-core/prds',
      includeTemplates: config.includeTemplates !== false,
      generateMarkdown: config.generateMarkdown !== false,
      ...config
    };
  }

  async generatePRD(phaseId, options = {}) {
    const phase = developmentPhases[phaseId];
    if (!phase) {
      throw new Error(`Unknown phase: ${phaseId}`);
    }

    const prdId = generateId();
    const timestamp = new Date().toISOString();
    
    const prd = {
      id: prdId,
      phase: phase,
      version: "1.0",
      status: "draft",
      created: timestamp,
      updated: timestamp,
      metadata: {
        project: "NEETAI Educational Platform",
        domain: "Educational Technology",
        target_exam: "NEET (National Eligibility cum Entrance Test)",
        methodology: "BMAD-METHOD Integration"
      },
      sections: await this.generatePRDSections(phase, options),
      bmad_integration: this.generateBMADIntegration(phase),
      appendices: this.generateAppendices(phase)
    };

    return prd;
  }

  async generatePRDSections(phase, options) {
    const sections = {};
    
    for (const [sectionId, sectionTemplate] of Object.entries(prdSections)) {
      // Skip optional sections based on phase requirements
      if (!sectionTemplate.required && !this.shouldIncludeSection(sectionId, phase)) {
        continue;
      }
      
      sections[sectionId] = await this.generateSection(sectionId, sectionTemplate, phase, options);
    }
    
    return sections;
  }

  shouldIncludeSection(sectionId, phase) {
    const aiPhases = ["phase3"]; // Phases that include AI integration
    
    if (sectionId === "ai_integration") {
      return aiPhases.includes(phase.id);
    }
    
    return true; // Include all other sections by default
  }

  async generateSection(sectionId, template, phase, options) {
    const sectionGenerators = {
      executive_summary: () => this.generateExecutiveSummary(phase),
      educational_context: () => this.generateEducationalContext(phase),
      user_personas: () => this.generateUserPersonas(phase),
      functional_requirements: () => this.generateFunctionalRequirements(phase),
      technical_requirements: () => this.generateTechnicalRequirements(phase),
      ai_integration: () => this.generateAIIntegration(phase),
      user_experience: () => this.generateUserExperience(phase),
      educational_effectiveness: () => this.generateEducationalEffectiveness(phase),
      security_privacy: () => this.generateSecurityPrivacy(phase),
      performance_scalability: () => this.generatePerformanceScalability(phase),
      mobile_considerations: () => this.generateMobileConsiderations(phase),
      success_metrics: () => this.generateSuccessMetrics(phase),
      implementation_plan: () => this.generateImplementationPlan(phase),
      risk_mitigation: () => this.generateRiskMitigation(phase),
      quality_assurance: () => this.generateQualityAssurance(phase)
    };

    const generator = sectionGenerators[sectionId];
    if (!generator) {
      return {
        title: template.title,
        agent: template.agent,
        description: template.description,
        status: "placeholder",
        requires_agent_input: true
      };
    }

    return {
      title: template.title,
      agent: template.agent,
      description: template.description,
      content: generator(),
      status: "generated"
    };
  }

  generateExecutiveSummary(phase) {
    return {
      overview: `${phase.name} represents a ${phase.priority.toLowerCase()} priority phase in the NEETAI educational platform development, focusing on ${phase.description.toLowerCase()}.`,
      
      business_objectives: [
        `Deliver comprehensive ${phase.name.toLowerCase()} capabilities for NEET preparation`,
        "Ensure scalable and maintainable architecture for educational features",
        "Optimize user experience for 16-19 year old students and their parents",
        "Maintain highest standards of educational content accuracy and alignment"
      ],
      
      key_deliverables: phase.key_features.map(feature => ({
        deliverable: feature,
        business_value: `Enhanced student learning experience and NEET preparation effectiveness`,
        success_metric: "User engagement and learning outcome improvement"
      })),
      
      estimated_timeline: phase.duration,
      
      success_criteria: [
        "All functional requirements implemented and tested",
        "Educational effectiveness validated through user testing",
        "Performance benchmarks met for mobile and web platforms",
        "Security and privacy requirements fully satisfied",
        "Accessibility standards (WCAG 2.1 AA) compliance achieved"
      ],
      
      budget_considerations: {
        development_effort: `${phase.duration} with cross-functional team`,
        infrastructure_costs: "Cloud hosting and AI service integration costs",
        third_party_services: "Authentication services, content delivery, AI APIs",
        educational_content: "Subject matter expert consultation and content validation"
      }
    };
  }

  generateEducationalContext(phase) {
    const educationalContexts = {
      phase1: {
        learning_objectives: [
          "Students can securely access their personalized learning environment",
          "Parents can monitor student progress while respecting privacy boundaries",
          "Teachers can manage student cohorts and track learning outcomes",
          "Students understand digital citizenship and privacy protection"
        ],
        neet_alignment: "Secure access to NEET preparation materials and progress tracking",
        pedagogical_considerations: [
          "Age-appropriate privacy controls and digital literacy education",
          "Family involvement in learning journey with appropriate boundaries",
          "Cultural sensitivity to Indian family dynamics in education",
          "Building trust and safety for online learning environment"
        ]
      },
      
      phase2: {
        learning_objectives: [
          "Students access curriculum-aligned content for all NEET subjects",
          "Content delivery adapts to individual learning pace and style",
          "Students can navigate and search educational content effectively",
          "Multimedia content enhances understanding of complex concepts"
        ],
        neet_alignment: "100% NCERT and NEET syllabus coverage with expert validation",
        pedagogical_considerations: [
          "Content sequencing follows cognitive learning progression",
          "Multiple representation modes for diverse learning styles",
          "Chunking complex topics into manageable learning units",
          "Integration of conceptual and procedural knowledge"
        ]
      },
      
      phase3: {
        learning_objectives: [
          "Students receive personalized learning recommendations",
          "Adaptive systems identify and address individual learning gaps",
          "Students benefit from AI-powered explanations and doubt resolution",
          "Learning efficiency improves through intelligent content delivery"
        ],
        neet_alignment: "AI-optimized preparation pathways for NEET success",
        pedagogical_considerations: [
          "Bloom's taxonomy integration in AI content recommendations",
          "Mastery learning approach with competency-based progression",
          "Metacognitive skill development through learning analytics",
          "Ethical AI use with transparent recommendation reasoning"
        ]
      },
      
      phase4: {
        learning_objectives: [
          "Students develop consistent study habits and motivation",
          "Healthy competition promotes learning without excessive stress",
          "Social learning enhances understanding through peer interaction",
          "Achievement recognition builds confidence and persistence"
        ],
        neet_alignment: "Motivation maintenance throughout intensive NEET preparation",
        pedagogical_considerations: [
          "Intrinsic motivation development over external rewards",
          "Collaborative learning with individual accountability", 
          "Cultural appropriateness of competition and achievement",
          "Stress management and mental health considerations"
        ]
      },
      
      phase5: {
        learning_objectives: [
          "Students gain insights into their learning patterns and progress",
          "Data-driven decisions improve study effectiveness",
          "Parents receive meaningful progress updates",
          "Teachers identify students needing additional support"
        ],
        neet_alignment: "Predictive analytics for NEET readiness assessment",
        pedagogical_considerations: [
          "Learning analytics for self-regulation and metacognition",
          "Formative assessment integrated with learning process",
          "Privacy-preserving analytics with educational benefit",
          "Actionable insights for learning improvement"
        ]
      },
      
      phase6: {
        learning_objectives: [
          "Students experience consistent performance across all devices",
          "Learning continues seamlessly in offline environments",
          "Platform scales to support peak usage during exam seasons",
          "System reliability supports critical learning activities"
        ],
        neet_alignment: "Reliable access during crucial NEET preparation periods",
        pedagogical_considerations: [
          "Uninterrupted learning flow for sustained engagement",
          "Equitable access regardless of device or network limitations",
          "Performance optimization supports cognitive focus",
          "Reliable platform builds trust in digital learning tools"
        ]
      }
    };

    const context = educationalContexts[phase.id] || {
      learning_objectives: ["Phase-specific learning objectives to be defined"],
      neet_alignment: "NEET preparation alignment to be specified",
      pedagogical_considerations: ["Educational approach to be detailed"]
    };

    return {
      ...context,
      target_demographics: phase.educational_context,
      curriculum_standards: {
        primary: "NEET (UG) Syllabus - Physics, Chemistry, Biology",
        secondary: "NCERT Curriculum Grades 11 and 12", 
        assessment_framework: "Competency-based evaluation with NEET alignment"
      },
      learning_theories: [
        "Constructivist learning for deep understanding",
        "Spaced repetition for long-term retention",
        "Active learning with immediate feedback",
        "Social cognitive theory for peer learning"
      ]
    };
  }

  generateUserPersonas(phase) {
    return {
      primary_personas: [
        {
          name: "Arjun - First-time NEET Aspirant",
          age: 17,
          background: "Class 12 student from tier-2 city, motivated but overwhelmed by NEET syllabus",
          goals: [
            "Understand complex concepts clearly",
            "Track progress and identify weak areas", 
            "Build confidence for NEET exam",
            "Balance board exams with NEET preparation"
          ],
          pain_points: [
            "Information overload from multiple sources",
            "Lack of personalized guidance",
            "Difficulty in time management",
            "Unclear about preparation strategy"
          ],
          technology_comfort: "Medium - comfortable with smartphones and basic apps",
          phase_specific_needs: this.getPhaseSpecificNeeds(phase.id, "student")
        },
        
        {
          name: "Priya - Repeat NEET Aspirant", 
          age: 19,
          background: "Second attempt, knows weak areas, high pressure to succeed",
          goals: [
            "Focus on specific weak subjects/topics",
            "Improve time management during exam",
            "Build mental resilience and confidence",
            "Achieve target score for desired college"
          ],
          pain_points: [
            "Demotivation from previous failure",
            "Time pressure and stress",
            "Need for targeted improvement",
            "Balancing revision with new learning"
          ],
          technology_comfort: "High - experienced with online learning platforms",
          phase_specific_needs: this.getPhaseSpecificNeeds(phase.id, "repeat_student")
        },
        
        {
          name: "Sunita - Concerned Parent",
          age: 45, 
          background: "Mother of NEET aspirant, wants to support child's education",
          goals: [
            "Monitor child's progress without being intrusive",
            "Understand child's strengths and weaknesses", 
            "Provide appropriate support and motivation",
            "Ensure child's mental health and wellbeing"
          ],
          pain_points: [
            "Limited understanding of NEET complexity",
            "Balancing support with independence",
            "Anxiety about child's future",
            "Difficulty understanding educational technology"
          ],
          technology_comfort: "Low-Medium - basic smartphone usage",
          phase_specific_needs: this.getPhaseSpecificNeeds(phase.id, "parent")
        },
        
        {
          name: "Dr. Rajesh - NEET Coach/Teacher",
          age: 35,
          background: "Experienced NEET coaching teacher, manages multiple student batches", 
          goals: [
            "Track student progress across batches",
            "Identify students needing additional support",
            "Optimize teaching strategies based on data",
            "Communicate effectively with parents"
          ],
          pain_points: [
            "Managing large number of students individually",
            "Limited time for personalized attention",
            "Difficulty in tracking progress accurately",
            "Communication challenges with parents"
          ],
          technology_comfort: "Medium-High - comfortable with educational tools",
          phase_specific_needs: this.getPhaseSpecificNeeds(phase.id, "teacher")
        }
      ],
      
      user_journey_maps: this.generateUserJourneyMaps(phase),
      accessibility_considerations: [
        "Screen reader compatibility for visually impaired users",
        "High contrast modes for better visibility",
        "Keyboard navigation support",
        "Multiple language support (English/Hindi)",
        "Simplified interfaces for users with learning disabilities"
      ]
    };
  }

  getPhaseSpecificNeeds(phaseId, userType) {
    const needs = {
      phase1: {
        student: ["Secure login process", "Profile setup guidance", "Privacy control understanding"],
        parent: ["Account linking with child", "Privacy settings control", "Progress visibility options"],
        teacher: ["Batch management", "Student roster access", "Parent communication tools"]
      },
      phase2: {
        student: ["Easy content navigation", "Bookmark and favorites", "Offline access"],
        parent: ["Content overview", "Study time tracking", "Progress in syllabus coverage"],
        teacher: ["Content assignment", "Usage analytics", "Performance insights"]
      },
      phase3: {
        student: ["Personalized study plan", "AI tutoring", "Adaptive practice"],
        parent: ["AI explanation transparency", "Personalization insights", "Performance predictions"],
        teacher: ["AI-generated insights", "Student clustering", "Intervention recommendations"]
      },
      phase4: {
        student: ["Achievement tracking", "Peer interaction", "Motivation tools"],
        parent: ["Healthy competition monitoring", "Achievement celebration", "Stress level indicators"],
        teacher: ["Group management", "Engagement tracking", "Behavioral insights"]
      },
      phase5: {
        student: ["Personal analytics dashboard", "Progress trends", "Performance insights"],
        parent: ["Progress reports", "Comparative analysis", "Recommendation summaries"],
        teacher: ["Class analytics", "Individual progress", "Intervention alerts"]
      },
      phase6: {
        student: ["Fast loading", "Offline sync", "Reliable access"],
        parent: ["Consistent experience", "Data usage awareness", "Performance updates"],
        teacher: ["Scalable dashboard", "Reliable reporting", "System status updates"]
      }
    };
    
    return needs[phaseId]?.[userType] || ["Phase-specific needs to be defined"];
  }

  generateUserJourneyMaps(phase) {
    // Simplified user journey maps for each phase
    return {
      student_journey: [
        "Discovery and registration",
        "Onboarding and profile setup",
        "Daily learning activities", 
        "Progress tracking and assessment",
        "Goal achievement and graduation"
      ],
      parent_journey: [
        "Child account setup assistance",
        "Initial monitoring and familiarization",
        "Regular progress check-ins",
        "Intervention and support provision",
        "Outcome evaluation and planning"
      ],
      teacher_journey: [
        "Platform integration and setup",
        "Student batch management",
        "Teaching content delivery",
        "Progress monitoring and analysis",
        "Performance reporting and communication"
      ]
    };
  }

  generateFunctionalRequirements(phase) {
    const functionalRequirements = {
      phase1: {
        core_features: [
          {
            feature: "Multi-Factor Authentication",
            description: "Secure login with SMS/Email OTP for all user types",
            acceptance_criteria: [
              "Users can register with mobile/email",
              "OTP verification within 5 minutes",
              "Account lockout after 5 failed attempts",
              "Password reset functionality available"
            ],
            priority: "Critical"
          },
          {
            feature: "Role-Based Access Control",
            description: "Different access levels for students, parents, teachers, admins",
            acceptance_criteria: [
              "Role assignment during registration",
              "Feature access based on user role",
              "Role modification by administrators",
              "Audit trail for role changes"
            ],
            priority: "Critical"
          },
          {
            feature: "Student Profile Management",
            description: "Comprehensive student profiles with educational history",
            acceptance_criteria: [
              "Profile creation with educational details",
              "Parent permission for minors",
              "Academic history tracking",
              "Privacy controls for sensitive information"
            ],
            priority: "High"
          }
        ],
        integration_requirements: [
          "OAuth integration with Google/Facebook",
          "SMS gateway for OTP delivery", 
          "Email service for notifications",
          "Database encryption for sensitive data"
        ]
      },
      
      phase2: {
        core_features: [
          {
            feature: "Content Management System",
            description: "Hierarchical organization of NEET study materials",
            acceptance_criteria: [
              "Three-tier content structure (Subject > Chapter > Topic)",
              "Content tagging and categorization",
              "Version control for content updates",
              "Bulk content upload and management"
            ],
            priority: "Critical"
          },
          {
            feature: "Multimedia Content Delivery",
            description: "Optimized delivery of videos, images, and interactive content",
            acceptance_criteria: [
              "Adaptive video quality based on bandwidth",
              "Image optimization for mobile devices",
              "Interactive diagrams and simulations",
              "Content caching for offline access"
            ],
            priority: "High"
          },
          {
            feature: "Content Search and Discovery",
            description: "Intelligent search across all educational content",
            acceptance_criteria: [
              "Full-text search across content",
              "Filter by subject, difficulty, content type",
              "Search result ranking by relevance",
              "Search history and suggestions"
            ],
            priority: "Medium"
          }
        ],
        integration_requirements: [
          "Content Delivery Network (CDN) integration",
          "Video streaming service integration",
          "Search engine (Elasticsearch) integration",
          "Content versioning system"
        ]
      }
    };

    // Continue pattern for other phases...
    return functionalRequirements[phase.id] || {
      core_features: phase.key_features.map(feature => ({
        feature: feature,
        description: `Implementation of ${feature.toLowerCase()}`,
        acceptance_criteria: ["Functional implementation", "User acceptance testing", "Performance validation"],
        priority: "High"
      })),
      integration_requirements: ["Third-party service integrations", "API development", "Database design"]
    };
  }

  generateTechnicalRequirements(phase) {
    return {
      architecture_decisions: [
        "Microservices architecture for scalability",
        "React-based web application with TypeScript",
        "React Native mobile applications",
        "Node.js backend services with Express.js", 
        "PostgreSQL for relational data",
        "Redis for caching and session management",
        "AWS cloud infrastructure with auto-scaling"
      ],
      
      performance_requirements: {
        response_time: "< 2 seconds for educational interactions",
        throughput: "10,000+ concurrent users during peak hours",
        availability: "99.9% uptime SLA",
        mobile_performance: "< 3 seconds app launch time",
        data_usage: "Optimized for 2G/3G networks"
      },
      
      security_requirements: [
        "HTTPS encryption for all communications",
        "JWT token-based authentication",
        "Rate limiting to prevent abuse",
        "Input validation and sanitization",
        "SQL injection and XSS protection",
        "Regular security audits and penetration testing"
      ],
      
      scalability_planning: {
        horizontal_scaling: "Auto-scaling groups based on CPU/memory usage",
        database_scaling: "Read replicas for query optimization",
        cdn_usage: "Global content distribution for faster access",
        caching_strategy: "Multi-layer caching (browser, CDN, application, database)"
      },
      
      integration_apis: [
        "Authentication service APIs",
        "Content management APIs", 
        "Analytics and tracking APIs",
        "Payment processing APIs (if applicable)",
        "Third-party educational service APIs"
      ]
    };
  }

  generateAIIntegration(phase) {
    if (phase.id !== "phase3") {
      return null; // Only applicable to AI-powered features phase
    }

    return {
      ai_capabilities: [
        {
          capability: "Personalized Learning Path Generation",
          description: "AI algorithms to create customized study plans",
          ai_models: ["GPT-4o for content analysis", "Custom ML models for pattern recognition"],
          data_requirements: ["Student performance history", "Learning preference data", "Time availability"],
          success_metrics: ["Path completion rate >80%", "Learning outcome improvement >25%"]
        },
        {
          capability: "Intelligent Doubt Resolution",
          description: "Conversational AI for student question answering",
          ai_models: ["GPT-4o for natural language understanding", "NEET-specific knowledge base"],
          data_requirements: ["Question-answer pairs", "NEET topic taxonomy", "Student context"],
          success_metrics: ["Question resolution accuracy >90%", "Student satisfaction >4.5/5"]
        },
        {
          capability: "Adaptive Assessment System",
          description: "Dynamic difficulty adjustment based on performance",
          ai_models: ["Item Response Theory models", "Real-time performance analysis"],
          data_requirements: ["Question difficulty data", "Student response patterns", "Time taken per question"],
          success_metrics: ["Optimal difficulty matching >85%", "Engagement retention >90%"]
        }
      ],
      
      ethical_ai_considerations: [
        "Transparent AI decision-making with explanations",
        "Bias detection and mitigation in recommendations",
        "Student data privacy and consent management",
        "Fair and inclusive AI responses for diverse learners",
        "Human oversight of AI-generated educational content"
      ],
      
      ai_infrastructure: {
        model_hosting: "AWS SageMaker for custom models",
        api_integration: "OpenAI API for GPT-4o access",
        data_pipeline: "Real-time data processing for personalization",
        model_versioning: "MLflow for model lifecycle management",
        monitoring: "AI model performance and bias monitoring"
      }
    };
  }

  generateUserExperience(phase) {
    return {
      design_principles: [
        "Mobile-first responsive design",
        "Accessibility as a core requirement (WCAG 2.1 AA)",
        "Age-appropriate design for 16-19 year olds",
        "Cultural sensitivity for Indian users",
        "Cognitive load optimization for learning focus"
      ],
      
      interface_requirements: {
        color_scheme: "High contrast, education-friendly color palette",
        typography: "Readable fonts optimized for screen reading",
        navigation: "Intuitive navigation with clear information architecture",
        feedback: "Immediate feedback for all user actions",
        error_handling: "Clear, helpful error messages with recovery options"
      },
      
      interaction_patterns: [
        "Swipe gestures for mobile content navigation",
        "Touch-friendly buttons and controls (minimum 44px)",
        "Keyboard shortcuts for power users",
        "Voice input capabilities for accessibility",
        "Drag-and-drop for interactive learning activities"
      ],
      
      responsive_design: {
        breakpoints: ["Mobile: 320-768px", "Tablet: 768-1024px", "Desktop: 1024px+"],
        mobile_optimization: "Progressive web app (PWA) capabilities",
        cross_platform: "Consistent experience across web and mobile apps"
      },
      
      usability_testing_plan: [
        "User testing with target age group (16-19 years)",
        "Accessibility testing with assistive technologies",
        "Cross-device usability validation",
        "Cultural appropriateness testing with Indian users",
        "Iterative design improvement based on feedback"
      ]
    };
  }

  generateEducationalEffectiveness(phase) {
    return {
      learning_outcome_measurement: {
        pre_post_assessment: "Before and after learning measurement",
        knowledge_retention: "30-day and 90-day retention testing",
        skill_transfer: "Application of learning to new contexts",
        engagement_metrics: "Time on task, completion rates, return visits"
      },
      
      assessment_strategies: [
        "Formative assessment integrated into learning activities",
        "Summative assessment at topic and chapter completion",
        "Peer assessment for collaborative learning activities",
        "Self-assessment for metacognitive skill development"
      ],
      
      pedagogical_validation: {
        expert_review: "Subject matter expert validation of educational content",
        pilot_testing: "Small-scale testing with target student groups",
        learning_analytics: "Data-driven insights into learning effectiveness",
        continuous_improvement: "Iterative enhancement based on learning outcomes"
      },
      
      neet_preparation_alignment: {
        syllabus_coverage: "100% NEET syllabus coverage verification",
        question_pattern_matching: "Practice questions aligned with NEET format",
        difficulty_progression: "Gradual difficulty increase matching NEET levels",
        time_management: "Time-bound practice aligned with NEET time constraints"
      },
      
      success_validation: [
        "Student learning objective achievement >85%",
        "Knowledge retention after 30 days >80%",
        "Student satisfaction with learning experience >4.5/5",
        "Parent satisfaction with progress visibility >80%",
        "Teacher effectiveness improvement >20%"
      ]
    };
  }

  generateSecurityPrivacy(phase) {
    return {
      data_protection: {
        student_data_privacy: "COPPA compliance for users under 18",
        data_minimization: "Collect only necessary data for educational purposes",
        consent_management: "Clear, understandable consent processes",
        data_retention: "Automated data deletion after retention period",
        right_to_deletion: "User ability to delete account and associated data"
      },
      
      authentication_security: [
        "Multi-factor authentication for all users",
        "Strong password requirements with complexity validation",
        "Account lockout policies after failed login attempts",
        "Regular password reset requirements",
        "Session management with automatic timeout"
      ],
      
      application_security: [
        "Input validation and sanitization",
        "SQL injection prevention",
        "Cross-site scripting (XSS) protection", 
        "Cross-site request forgery (CSRF) protection",
        "Secure API endpoints with rate limiting"
      ],
      
      data_encryption: {
        data_at_rest: "AES-256 encryption for database storage",
        data_in_transit: "TLS 1.3 for all network communications",
        key_management: "AWS KMS for encryption key management",
        backup_encryption: "Encrypted backups with separate key storage"
      },
      
      privacy_by_design: [
        "Privacy impact assessments for all features",
        "Default privacy settings favoring user protection",
        "Clear, understandable privacy policies",
        "Regular privacy audits and assessments",
        "User control over data sharing and visibility"
      ],
      
      compliance_requirements: [
        "COPPA compliance for minors",
        "General Data Protection Regulation (GDPR) readiness",
        "Indian Personal Data Protection Act compliance",
        "Educational privacy standards adherence",
        "Regular compliance audits and certifications"
      ]
    };
  }

  generatePerformanceScalability(phase) {
    return {
      performance_benchmarks: {
        page_load_time: "< 2 seconds on 3G network",
        api_response_time: "< 500ms for educational queries",
        mobile_app_launch: "< 3 seconds cold start",
        video_streaming: "< 5 seconds to start playback",
        search_response: "< 1 second for content search"
      },
      
      scalability_architecture: {
        horizontal_scaling: "Auto-scaling based on demand metrics",
        load_balancing: "Distributed load across multiple servers",
        database_optimization: "Read replicas and query optimization",
        caching_strategy: "Multi-tier caching (CDN, application, database)",
        microservices: "Independent scaling of service components"
      },
      
      capacity_planning: {
        concurrent_users: "Support for 100,000+ concurrent users",
        peak_traffic: "3x normal capacity during exam seasons",
        data_storage: "Petabyte-scale content and analytics storage",
        bandwidth: "Global CDN for optimized content delivery",
        processing_power: "Auto-scaling compute resources"
      },
      
      monitoring_alerting: [
        "Real-time performance monitoring",
        "Automated alerting for performance degradation",
        "User experience monitoring with synthetic testing",
        "Infrastructure health monitoring",
        "Capacity utilization tracking and forecasting"
      ],
      
      optimization_strategies: [
        "Code splitting and lazy loading for web applications",
        "Image and video compression optimization",
        "Database query optimization and indexing",
        "Content delivery network (CDN) utilization",
        "Progressive web app (PWA) implementation for mobile"
      ]
    };
  }

  generateMobileConsiderations(phase) {
    return {
      mobile_first_design: {
        responsive_layout: "Mobile-optimized layouts with touch-friendly interactions",
        progressive_web_app: "PWA capabilities for app-like experience",
        offline_functionality: "Core features available without internet connection",
        data_efficiency: "Optimized for limited data plans and slow networks",
        battery_optimization: "Efficient resource usage for extended study sessions"
      },
      
      device_compatibility: {
        android_support: "Android 8.0+ with backwards compatibility",
        ios_support: "iOS 12+ with regular updates",
        low_end_devices: "Optimized for devices with 2GB RAM and limited storage",
        screen_sizes: "Support for 4-inch to tablet-sized screens",
        hardware_integration: "Camera, microphone, and sensor integration where needed"
      },
      
      accessibility_mobile: [
        "Voice-over and talk-back support",
        "Large text and high contrast modes",
        "Touch gesture alternatives for motor impairments",
        "Simplified navigation for cognitive accessibility",
        "Multiple language support with right-to-left text"
      ],
      
      performance_mobile: {
        app_size: "< 50MB initial download with incremental updates",
        startup_time: "< 3 seconds cold start on target devices",
        memory_usage: "< 150MB RAM usage during normal operation",
        network_efficiency: "Intelligent data usage with offline caching",
        battery_life: "< 5% battery drain per hour of active use"
      },
      
      mobile_specific_features: [
        "Push notifications for study reminders and updates",
        "Background sync for content updates",
        "Share functionality for collaborative learning",
        "Deep linking for direct content access",
        "Biometric authentication where supported"
      ]
    };
  }

  generateSuccessMetrics(phase) {
    return {
      educational_metrics: {
        learning_effectiveness: [
          "Learning objective achievement rate >85%",
          "Knowledge retention after 30 days >80%",
          "Skill transfer to new contexts >75%",
          "Concept mastery improvement >70%"
        ],
        engagement_metrics: [
          "Daily active users >70% of registered students",
          "Session duration 45-60 minutes average",
          "Feature adoption rate >70% for core features",
          "Monthly retention rate >85%"
        ],
        neet_preparation: [
          "Mock test score improvement >15-25 marks",
          "Topic confidence increase >70%",
          "Study plan completion rate >80%",
          "Time management skill improvement >60%"
        ]
      },
      
      user_satisfaction: {
        student_satisfaction: ">4.5/5 overall platform rating",
        parent_satisfaction: ">80% report visible progress in child",
        teacher_satisfaction: ">90% approval for educational effectiveness",
        net_promoter_score: ">70 indicating strong recommendation likelihood"
      },
      
      technical_metrics: {
        performance: [
          "Page load time <2 seconds on 3G",
          "API response time <500ms",
          "Mobile app crash rate <1%",
          "System uptime >99.9%"
        ],
        quality: [
          "Bug escape rate <1% to production",
          "Test coverage >90% for critical features",
          "Security vulnerability score: Zero critical/high",
          "Accessibility compliance: WCAG 2.1 AA"
        ]
      },
      
      business_metrics: {
        growth: [
          "User acquisition rate month-over-month",
          "User retention cohort analysis",
          "Feature usage patterns and trends",
          "Content consumption analytics"
        ],
        efficiency: [
          "Development velocity and sprint completion",
          "Bug resolution time <48 hours average",
          "Support ticket resolution <24 hours",
          "Release frequency and stability"
        ]
      },
      
      measurement_framework: {
        data_collection: "Automated analytics with privacy protection",
        reporting_cadence: "Weekly performance dashboards, monthly business reviews",
        success_reviews: "Quarterly success metric evaluation and adjustment",
        continuous_improvement: "Data-driven feature enhancement and optimization"
      }
    };
  }

  generateImplementationPlan(phase) {
    return {
      development_phases: [
        {
          phase: "Planning & Design",
          duration: "2 weeks",
          activities: [
            "Requirements finalization and stakeholder alignment",
            "Technical architecture design and review",
            "UI/UX design and prototyping",
            "Development team setup and tool configuration"
          ],
          deliverables: [
            "Finalized PRD with stakeholder sign-off",
            "Technical architecture document",
            "UI/UX mockups and prototypes",
            "Development environment setup"
          ]
        },
        {
          phase: "Core Development",
          duration: `${Math.ceil(parseInt(phase.duration.split('-')[0]) * 0.6)} weeks`,
          activities: [
            "Backend API development and testing",
            "Frontend component development",
            "Database design and implementation",
            "Integration with third-party services"
          ],
          deliverables: [
            "Core feature implementation",
            "API documentation and testing",
            "Database schema and migrations",
            "Basic integration testing"
          ]
        },
        {
          phase: "Integration & Testing",
          duration: `${Math.ceil(parseInt(phase.duration.split('-')[0]) * 0.25)} weeks`,
          activities: [
            "System integration testing",
            "User acceptance testing with stakeholders",
            "Performance testing and optimization",
            "Security testing and vulnerability assessment"
          ],
          deliverables: [
            "Integration test results",
            "User acceptance test sign-off",
            "Performance benchmark validation",
            "Security assessment report"
          ]
        },
        {
          phase: "Deployment & Launch",
          duration: "1 week",
          activities: [
            "Production deployment and configuration",
            "Production smoke testing",
            "User training and documentation",
            "Go-live monitoring and support"
          ],
          deliverables: [
            "Production deployment",
            "User training materials",
            "Go-live checklist completion",
            "Post-launch monitoring setup"
          ]
        }
      ],
      
      dependencies: [
        "Completion of previous phase deliverables",
        "Third-party service integrations and approvals",
        "Educational content creation and validation",
        "Infrastructure setup and security clearances"
      ],
      
      resource_requirements: {
        development_team: [
          "1 Product Manager",
          "1 Technical Lead/Architect",
          "3-4 Full-stack Developers",
          "1 Mobile Developer (if applicable)",
          "1 UI/UX Designer",
          "1 QA Engineer",
          "1 DevOps Engineer"
        ],
        educational_experts: [
          "1 NEET Subject Matter Expert",
          "1 Educational Technology Specialist",
          "1 Content Quality Reviewer"
        ],
        infrastructure: [
          "Development and staging environments",
          "CI/CD pipeline setup",
          "Monitoring and logging tools",
          "Security testing tools"
        ]
      },
      
      risk_mitigation_timeline: [
        "Weekly risk assessment and mitigation review",
        "Bi-weekly stakeholder alignment check-ins",
        "Monthly timeline and scope review",
        "Continuous integration and automated testing"
      ]
    };
  }

  generateRiskMitigation(phase) {
    return {
      identified_risks: [
        {
          risk: "Educational Content Accuracy Issues",
          probability: "Medium",
          impact: "High",
          mitigation: [
            "Multi-level expert review process",
            "Automated content validation tools",
            "Regular curriculum alignment audits",
            "User feedback integration for content correction"
          ],
          contingency: "Rollback to previous content version if critical errors found"
        },
        {
          risk: "Performance Issues During Peak Usage",
          probability: "Medium",
          impact: "High",
          mitigation: [
            "Load testing with 3x expected capacity",
            "Auto-scaling infrastructure setup",
            "Performance monitoring and alerting",
            "CDN optimization for content delivery"
          ],
          contingency: "Emergency scaling and traffic routing procedures"
        },
        {
          risk: "User Adoption Lower Than Expected",
          probability: "Medium",
          impact: "Medium",
          mitigation: [
            "User research and feedback integration",
            "Iterative UI/UX improvement",
            "Student and parent engagement strategies",
            "Teacher training and support programs"
          ],
          contingency: "Feature prioritization adjustment based on user feedback"
        },
        {
          risk: "Security Breach or Data Privacy Issues",
          probability: "Low",
          impact: "Critical",
          mitigation: [
            "Regular security audits and penetration testing",
            "Comprehensive data encryption at rest and in transit",
            "Staff security training and access controls",
            "Privacy by design implementation"
          ],
          contingency: "Incident response plan with immediate containment and notification"
        },
        {
          risk: "Third-Party Service Dependencies",
          probability: "Medium",
          impact: "Medium",
          mitigation: [
            "Multiple vendor options and fallback services",
            "Service level agreement monitoring",
            "Local caching and offline capabilities",
            "Regular dependency health checks"
          ],
          contingency: "Rapid vendor switching procedures and temporary workarounds"
        }
      ],
      
      monitoring_framework: {
        early_warning_systems: [
          "Performance degradation alerts",
          "User engagement drop notifications",
          "Error rate threshold monitoring",
          "Security anomaly detection"
        ],
        response_procedures: [
          "Escalation matrix for different risk levels",
          "Communication protocols for stakeholders",
          "Technical response team activation",
          "User communication and transparency"
        ]
      },
      
      quality_gates: [
        {
          gate: "Content Quality Gate",
          criteria: [
            "Subject matter expert approval",
            "Automated accuracy validation",
            "User acceptance testing completion",
            "Accessibility compliance verification"
          ]
        },
        {
          gate: "Technical Quality Gate", 
          criteria: [
            "Performance benchmark achievement",
            "Security vulnerability assessment pass",
            "Integration testing completion",
            "Production deployment readiness"
          ]
        },
        {
          gate: "Educational Effectiveness Gate",
          criteria: [
            "Learning objective validation",
            "Pedagogical approach approval", 
            "Student testing feedback incorporation",
            "NEET alignment verification"
          ]
        }
      ]
    };
  }

  generateQualityAssurance(phase) {
    return {
      testing_strategy: {
        test_levels: [
          {
            level: "Unit Testing",
            coverage: ">90% code coverage",
            responsibility: "Developers",
            automation: "Fully automated with CI/CD integration"
          },
          {
            level: "Integration Testing", 
            coverage: "All API endpoints and service integrations",
            responsibility: "QA Engineers and Developers",
            automation: "Automated API testing with manual exploratory testing"
          },
          {
            level: "System Testing",
            coverage: "End-to-end user workflows",
            responsibility: "QA Team",
            automation: "Automated E2E testing with manual validation"
          },
          {
            level: "User Acceptance Testing",
            coverage: "Real user scenarios with target demographics",
            responsibility: "Educational Experts and Users",
            automation: "Manual testing with user feedback collection"
          }
        ],
        
        specialized_testing: [
          {
            type: "Educational Content Testing",
            description: "Validation of educational accuracy and pedagogical effectiveness",
            methods: [
              "Subject matter expert review",
              "Pedagogical approach validation",
              "NEET curriculum alignment check",
              "Age-appropriateness assessment"
            ]
          },
          {
            type: "Accessibility Testing",
            description: "Ensuring platform accessibility for all users",
            methods: [
              "Screen reader compatibility testing",
              "Keyboard navigation validation",
              "Color contrast and visual accessibility",
              "Cognitive accessibility assessment"
            ]
          },
          {
            type: "Performance Testing",
            description: "Validation of performance under various conditions",
            methods: [
              "Load testing with expected user volumes",
              "Stress testing with peak capacity",
              "Network condition simulation (2G/3G/4G)",
              "Device performance testing on target hardware"
            ]
          },
          {
            type: "Security Testing",
            description: "Comprehensive security vulnerability assessment",
            methods: [
              "Penetration testing by security experts",
              "Vulnerability scanning and assessment", 
              "Authentication and authorization testing",
              "Data privacy and protection validation"
            ]
          }
        ]
      },
      
      quality_metrics: [
        "Defect density: <1 defect per 1000 lines of code",
        "Test coverage: >90% for critical educational features",
        "User acceptance: >95% of acceptance criteria met",
        "Performance: 100% of performance benchmarks achieved",
        "Security: Zero critical or high-severity vulnerabilities"
      ],
      
      continuous_quality: {
        automated_checks: [
          "Continuous integration with automated testing",
          "Code quality analysis with static analysis tools",
          "Security scanning in CI/CD pipeline",
          "Performance monitoring in staging environment"
        ],
        quality_reviews: [
          "Daily code reviews with educational context consideration",
          "Weekly quality metrics review and improvement planning",
          "Sprint retrospectives with quality focus",
          "Monthly stakeholder quality review meetings"
        ]
      },
      
      validation_framework: {
        educational_validation: [
          "Learning objective achievement measurement",
          "Student engagement and satisfaction validation",
          "Parent and teacher feedback incorporation",
          "Long-term learning outcome tracking"
        ],
        technical_validation: [
          "Cross-browser and cross-device compatibility",
          "API performance and reliability validation", 
          "Data accuracy and integrity verification",
          "Scalability and performance under load"
        ]
      }
    };
  }

  generateBMADIntegration(phase) {
    return {
      agent_assignments: phase.agents.map(agent => ({
        agent: agent,
        responsibilities: this.getAgentResponsibilities(agent, phase),
        deliverables: this.getAgentDeliverables(agent, phase)
      })),
      
      workflow_coordination: {
        collaboration_patterns: [
          "Daily stand-ups with cross-agent communication",
          "Weekly agent coordination meetings",
          "Sprint planning with agent-specific task assignment",
          "Cross-functional review sessions for quality assurance"
        ],
        decision_frameworks: [
          "Educational decisions: neet-education-expert leads",
          "Technical decisions: solution-architect leads with input from specialists",
          "Product decisions: edtech-product-manager leads with stakeholder input",
          "Security decisions: security-specialist leads with compliance focus"
        ]
      },
      
      quality_gates: [
        {
          gate: "Educational Quality Assurance",
          responsible_agents: ["neet-education-expert", "content-curator"],
          criteria: [
            "Learning objectives clearly defined and measurable",
            "Content accuracy verified by subject matter experts",
            "Pedagogical approach validated against best practices",
            "NEET curriculum alignment confirmed"
          ]
        },
        {
          gate: "Technical Architecture Review", 
          responsible_agents: ["solution-architect", "performance-engineer"],
          criteria: [
            "Scalability requirements addressed",
            "Performance benchmarks achievable",
            "Security measures implemented",
            "Integration patterns validated"
          ]
        },
        {
          gate: "User Experience Validation",
          responsible_agents: ["ux-designer", "edtech-product-manager"],
          criteria: [
            "User journey optimization completed",
            "Accessibility standards met",
            "Mobile-first design implemented",
            "User testing feedback incorporated"
          ]
        }
      ],
      
      continuous_improvement: {
        feedback_loops: [
          "User feedback integration into agent decision making",
          "Performance data analysis for optimization recommendations",
          "Educational outcome measurement for pedagogy refinement",
          "Market research integration for product strategy adjustment"
        ],
        learning_mechanisms: [
          "Agent knowledge base updates based on project learnings",
          "Best practice documentation for future phases",
          "Cross-phase learning integration and optimization",
          "Industry trend monitoring and adaptation"
        ]
      }
    };
  }

  getAgentResponsibilities(agent, phase) {
    const responsibilities = {
      "neet-education-expert": [
        "Educational content accuracy validation",
        "Learning objective definition and measurement",
        "Pedagogical approach design and optimization",
        "NEET curriculum alignment verification"
      ],
      "edtech-product-manager": [
        "Product strategy and roadmap alignment",
        "User experience optimization and validation",
        "Stakeholder communication and alignment", 
        "Business requirement definition and prioritization"
      ],
      "neet-ai-specialist": [
        "AI feature design and implementation",
        "Machine learning model selection and optimization",
        "Personalization algorithm development",
        "AI ethics and bias mitigation"
      ],
      "solution-architect": [
        "Technical architecture design and documentation",
        "System integration planning and execution",
        "Performance optimization and scalability planning",
        "Technology selection and evaluation"
      ],
      "security-specialist": [
        "Security requirement definition and implementation",
        "Privacy protection and compliance assurance",
        "Vulnerability assessment and mitigation",
        "Data protection and encryption strategy"
      ]
    };
    
    return responsibilities[agent] || ["Agent-specific responsibilities to be defined"];
  }

  getAgentDeliverables(agent, phase) {
    const deliverables = {
      "neet-education-expert": [
        "Educational effectiveness validation report",
        "Learning objective achievement metrics",
        "Pedagogical approach documentation",
        "Content quality assurance certification"
      ],
      "edtech-product-manager": [
        "Product requirements specification",
        "User experience design documentation",
        "Stakeholder alignment summary",
        "Success metrics and KPI framework"
      ],
      "neet-ai-specialist": [
        "AI feature specification and implementation guide",
        "Machine learning model documentation",
        "Personalization algorithm performance analysis",
        "AI ethics compliance report"
      ]
    };
    
    return deliverables[agent] || ["Agent-specific deliverables to be defined"];
  }

  generateAppendices(phase) {
    return {
      technical_specifications: {
        api_documentation: "Detailed API specification for all endpoints",
        database_schema: "Complete database design and relationships",
        integration_guides: "Third-party service integration documentation",
        deployment_procedures: "Step-by-step deployment and configuration guide"
      },
      
      educational_resources: {
        curriculum_mapping: "NEET syllabus coverage and alignment documentation",
        learning_frameworks: "Educational theory and methodology references",
        assessment_rubrics: "Criteria for evaluating educational effectiveness",
        content_guidelines: "Standards for educational content creation and review"
      },
      
      user_documentation: {
        user_manuals: "Comprehensive guides for students, parents, and teachers",
        training_materials: "Onboarding and training resources",
        troubleshooting_guides: "Common issues and resolution procedures",
        accessibility_guides: "Instructions for users with diverse needs"
      },
      
      compliance_documentation: {
        privacy_policy: "Comprehensive privacy protection and data usage policies",
        terms_of_service: "User agreement and service terms",
        accessibility_statement: "WCAG compliance and accessibility commitment",
        security_certifications: "Security audit results and compliance certificates"
      }
    };
  }

  async savePRD(prd) {
    await fs.mkdir(this.config.outputDirectory, { recursive: true });
    
    const filename = `PRD_${prd.phase.id}_v${prd.version}_${Date.now()}.json`;
    const filepath = path.join(this.config.outputDirectory, filename);
    
    await fs.writeFile(filepath, JSON.stringify(prd, null, 2), 'utf8');
    
    if (this.config.generateMarkdown) {
      const markdownContent = this.generateMarkdownPRD(prd);
      const markdownPath = path.join(this.config.outputDirectory, filename.replace('.json', '.md'));
      await fs.writeFile(markdownPath, markdownContent, 'utf8');
    }
    
    return filepath;
  }

  generateMarkdownPRD(prd) {
    let markdown = `# ${prd.phase.name} - Product Requirements Document\n\n`;
    markdown += `**Phase ID:** ${prd.phase.id}\n`;
    markdown += `**Version:** ${prd.version}\n`;
    markdown += `**Status:** ${prd.status}\n`;
    markdown += `**Created:** ${prd.created}\n`;
    markdown += `**Priority:** ${prd.phase.priority}\n`;
    markdown += `**Estimated Duration:** ${prd.phase.duration}\n\n`;
    
    markdown += `## Phase Overview\n\n${prd.phase.description}\n\n`;
    
    markdown += `### Key Features\n`;
    prd.phase.key_features.forEach(feature => {
      markdown += `- ${feature}\n`;
    });
    markdown += '\n';
    
    // Generate all sections
    Object.entries(prd.sections).forEach(([sectionId, section]) => {
      markdown += `## ${section.title}\n\n`;
      markdown += `**Responsible Agent:** ${section.agent}\n\n`;
      markdown += `${section.description}\n\n`;
      
      if (section.content) {
        this.renderSectionContent(section.content, markdown);
      }
      
      markdown += '\n---\n\n';
    });
    
    return markdown;
  }

  renderSectionContent(content, markdown) {
    // This is a simplified version - would need more sophisticated rendering
    // for complex nested objects
    if (typeof content === 'object') {
      Object.entries(content).forEach(([key, value]) => {
        markdown += `### ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;
        if (Array.isArray(value)) {
          value.forEach(item => markdown += `- ${JSON.stringify(item, null, 2)}\n`);
        } else if (typeof value === 'object') {
          markdown += `${JSON.stringify(value, null, 2)}\n`;
        } else {
          markdown += `${value}\n`;
        }
        markdown += '\n';
      });
    }
  }

  async generateAllPRDs() {
    const results = [];
    
    for (const phaseId of Object.keys(developmentPhases)) {
      try {
        const prd = await this.generatePRD(phaseId);
        const filepath = await this.savePRD(prd);
        results.push({ 
          success: true, 
          phase: phaseId, 
          filepath: filepath,
          prd: prd
        });
      } catch (error) {
        results.push({ 
          success: false, 
          phase: phaseId, 
          error: error.message 
        });
      }
    }
    
    return results;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
NEETAI PRD Generator - BMAD Integration

Usage:
  node generate-phase-prds.js <phase-id|all> [options]

Phase IDs:
  - phase1: Authentication & User Management
  - phase2: Content Management & Study Materials  
  - phase3: AI-Powered Learning Features
  - phase4: Gamification & Student Engagement
  - phase5: Analytics & Performance Tracking
  - phase6: Optimization & Scaling
  - all: Generate PRDs for all phases

Options:
  --output: Output directory for generated PRDs
  --no-markdown: Skip markdown generation
  
Examples:
  node generate-phase-prds.js phase1
  node generate-phase-prds.js all --output=./prds
  node generate-phase-prds.js phase3 --no-markdown
    `);
    return;
  }

  const phaseId = args[0];
  const options = {};
  
  // Parse options
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--output=')) {
      options.outputDirectory = args[i].split('=')[1];
    } else if (args[i] === '--no-markdown') {
      options.generateMarkdown = false;
    }
  }

  try {
    const generator = new NEETAIPRDGenerator(options);
    
    if (phaseId === 'all') {
      console.log('🚀 Generating PRDs for all phases...');
      const results = await generator.generateAllPRDs();
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      console.log(`\n✅ Successfully generated ${successful.length} PRDs:`);
      successful.forEach(result => {
        console.log(`  - ${result.phase}: ${result.filepath}`);
      });
      
      if (failed.length > 0) {
        console.log(`\n❌ Failed to generate ${failed.length} PRDs:`);
        failed.forEach(result => {
          console.log(`  - ${result.phase}: ${result.error}`);
        });
      }
      
    } else {
      console.log(`🚀 Generating PRD for ${phaseId}...`);
      const prd = await generator.generatePRD(phaseId);
      const filepath = await generator.savePRD(prd);
      
      console.log(`✅ PRD generated successfully!`);
      console.log(`Phase: ${prd.phase.name}`);
      console.log(`File: ${filepath}`);
      console.log(`\n📊 PRD Summary:`);
      console.log(`- Sections: ${Object.keys(prd.sections).length}`);
      console.log(`- Agents: ${prd.phase.agents.join(', ')}`);
      console.log(`- Priority: ${prd.phase.priority}`);
      console.log(`- Duration: ${prd.phase.duration}`);
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Export for module usage
module.exports = { NEETAIPRDGenerator, developmentPhases };

// Run CLI if called directly
if (require.main === module) {
  main();
}
