#!/usr/bin/env node

/**
 * Enhanced BMAD Development Story Generator for Educational Platform
 * Generates comprehensive development stories with NEET preparation context
 * Integrates with BMAD agent workflow and educational objectives
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Educational context data specific to NEET preparation
const NEETContexts = {
  subjects: {
    physics: {
      name: 'Physics',
      chapters: [
        'Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics',
        'Oscillations and Waves', 'Gravitation', 'Fluid Mechanics', 'Kinetic Theory'
      ],
      difficulty_patterns: ['conceptual understanding', 'numerical problem solving', 'application based'],
      common_mistakes: ['unit conversions', 'sign conventions', 'approximations', 'formula applications']
    },
    chemistry: {
      name: 'Chemistry', 
      chapters: [
        'Atomic Structure', 'Chemical Bonding', 'States of Matter', 'Thermodynamics',
        'Equilibrium', 'Redox Reactions', 'Electrochemistry', 'Chemical Kinetics',
        'Surface Chemistry', 'General Principles and Processes of Isolation of Elements',
        'p-Block Elements', 'd and f Block Elements', 'Coordination Compounds',
        'Haloalkanes and Haloarenes', 'Alcohols Phenols and Ethers', 'Aldehydes Ketones and Carboxylic Acids',
        'Organic Compounds containing Nitrogen', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'
      ],
      difficulty_patterns: ['memorization heavy', 'reaction mechanisms', 'organic synthesis', 'inorganic properties'],
      common_mistakes: ['nomenclature errors', 'reaction conditions', 'stereochemistry', 'exception cases']
    },
    biology: {
      name: 'Biology',
      chapters: [
        'Diversity of Living Organisms', 'Structural Organisation in Animals and Plants',
        'Cell Structure and Function', 'Plant Physiology', 'Human Physiology',
        'Reproduction', 'Genetics and Evolution', 'Biology and Human Welfare',
        'Biotechnology and its Applications', 'Ecology and Environment'
      ],
      difficulty_patterns: ['diagram based', 'factual recall', 'process understanding', 'application scenarios'],
      common_mistakes: ['terminology confusion', 'process sequences', 'exception organisms', 'quantitative aspects']
    }
  },
  
  learner_profiles: {
    first_time_aspirant: {
      characteristics: ['new to NEET', 'building foundation', 'high motivation', 'needs guidance'],
      challenges: ['vast syllabus intimidation', 'time management', 'study strategy', 'concept clarity'],
      learning_preferences: ['structured approach', 'step-by-step guidance', 'frequent assessments', 'motivation tracking']
    },
    repeat_aspirant: {
      characteristics: ['previous attempt experience', 'targeted improvement', 'time pressure', 'specific weaknesses'],
      challenges: ['motivation maintenance', 'overcoming past mistakes', 'focused preparation', 'stress management'],
      learning_preferences: ['weakness analysis', 'targeted practice', 'performance tracking', 'efficient revision']
    },
    foundation_student: {
      characteristics: ['11th/12th current student', 'building fundamentals', 'board exam pressure', 'long-term preparation'],
      challenges: ['dual preparation pressure', 'syllabus coordination', 'time allocation', 'concept depth vs breadth'],
      learning_preferences: ['curriculum integration', 'gradual difficulty increase', 'concept building', 'regular assessment']
    },
    advanced_student: {
      characteristics: ['strong foundation', 'aiming for high scores', 'competitive mindset', 'efficiency focused'],
      challenges: ['maintaining edge', 'avoiding overconfidence', 'time optimization', 'advanced problem solving'],
      learning_preferences: ['challenging content', 'efficiency tools', 'peer comparison', 'advanced analytics']
    }
  },

  learning_methodologies: {
    spaced_repetition: {
      principle: 'Review information at increasing intervals',
      neet_application: 'Formula recall, reaction mechanisms, biological processes',
      implementation: 'Smart flashcards, timed reviews, retention analytics'
    },
    active_recall: {
      principle: 'Retrieve information from memory without looking',
      neet_application: 'Concept testing, blank diagram filling, explanation practice',
      implementation: 'Quiz modes, explanation challenges, peer teaching'
    },
    interleaved_practice: {
      principle: 'Mix different types of problems within study sessions',
      neet_application: 'Mixed topic questions, cross-subject connections, varied problem types',
      implementation: 'Randomized practice sets, topic mixing algorithms, comprehensive tests'
    },
    elaborative_interrogation: {
      principle: 'Generate explanations for why stated facts are true',
      neet_application: 'Why-based questions, mechanism explanations, cause-effect relationships',
      implementation: 'Explanation prompts, reasoning challenges, conceptual connections'
    },
    dual_coding: {
      principle: 'Combine verbal and visual information processing',
      neet_application: 'Diagram annotations, visual mnemonics, process flowcharts',
      implementation: 'Interactive diagrams, visual associations, multimedia content'
    }
  },

  assessment_types: {
    diagnostic: {
      purpose: 'Identify knowledge gaps and learning readiness',
      timing: 'Beginning of learning journey, before topic start',
      characteristics: ['comprehensive coverage', 'adaptive questioning', 'detailed analysis']
    },
    formative: {
      purpose: 'Provide ongoing feedback during learning process',
      timing: 'Throughout learning sessions, after concept blocks',
      characteristics: ['immediate feedback', 'learning oriented', 'non-punitive']
    },
    summative: {
      purpose: 'Evaluate final learning achievement and readiness',
      timing: 'End of topics, modules, or preparation phases',
      characteristics: ['comprehensive evaluation', 'grade-oriented', 'NEET-like format']
    },
    adaptive: {
      purpose: 'Adjust difficulty based on learner performance',
      timing: 'Continuous throughout learning experience',
      characteristics: ['personalized difficulty', 'efficient assessment', 'targeted feedback']
    }
  }
};

// Story templates with educational contexts
const storyTemplates = {
  feature_development: {
    title: "Educational Feature Development Story",
    sections: [
      'educational_context',
      'learning_objectives', 
      'user_personas',
      'technical_requirements',
      'pedagogical_approach',
      'assessment_integration',
      'success_metrics'
    ]
  },
  
  content_creation: {
    title: "Educational Content Creation Story", 
    sections: [
      'content_specifications',
      'subject_matter_requirements',
      'pedagogical_design',
      'quality_assurance',
      'accessibility_considerations',
      'engagement_elements',
      'validation_process'
    ]
  },

  ai_integration: {
    title: "AI-Enhanced Learning Feature Story",
    sections: [
      'ai_educational_objectives',
      'personalization_requirements',
      'content_generation_needs',
      'performance_analytics',
      'ethical_considerations',
      'bias_mitigation',
      'evaluation_framework'
    ]
  },

  assessment_system: {
    title: "Assessment System Development Story",
    sections: [
      'assessment_objectives',
      'neet_alignment_requirements', 
      'psychometric_considerations',
      'adaptive_mechanisms',
      'reporting_framework',
      'security_measures',
      'validation_methods'
    ]
  },

  mobile_optimization: {
    title: "Mobile Learning Experience Story",
    sections: [
      'mobile_learning_context',
      'device_constraints',
      'offline_capabilities',
      'performance_requirements',
      'accessibility_mobile',
      'engagement_mobile',
      'analytics_mobile'
    ]
  }
};

// Enhanced story generation with educational AI integration
class EducationalStoryGenerator {
  constructor(config = {}) {
    this.config = {
      outputDirectory: config.outputDirectory || '.bmad-core/stories',
      agentIntegration: config.agentIntegration !== false,
      aiModels: config.aiModels || {
        primary: 'gpt-4o',
        fallback: 'gpt-4o-mini'
      },
      ...config
    };
    
    this.agents = [
      'neet-education-expert',
      'edtech-product-manager', 
      'neet-ai-specialist'
    ];
  }

  async generateStory(storyType, parameters = {}) {
    const template = storyTemplates[storyType];
    if (!template) {
      throw new Error(`Unknown story type: ${storyType}`);
    }

    const storyId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const story = {
      id: storyId,
      type: storyType,
      title: template.title,
      created: timestamp,
      updated: timestamp,
      parameters: parameters,
      educational_context: this.generateEducationalContext(parameters),
      sections: await this.generateStorySections(template.sections, parameters),
      bmad_integration: {
        agents: this.selectRelevantAgents(storyType),
        workflow_steps: this.generateWorkflowSteps(storyType, parameters),
        quality_gates: this.generateQualityGates(storyType),
        deliverables: this.generateDeliverables(storyType)
      },
      success_criteria: this.generateSuccessCriteria(storyType, parameters),
      validation_framework: this.generateValidationFramework(storyType)
    };

    return story;
  }

  generateEducationalContext(parameters) {
    const context = {
      domain: 'medical_entrance_examination',
      exam_focus: 'neet',
      target_subjects: parameters.subjects || ['physics', 'chemistry', 'biology'],
      learner_profiles: parameters.learner_profiles || ['first_time_aspirant', 'repeat_aspirant'],
      educational_objectives: []
    };

    // Generate specific educational objectives based on subjects
    context.target_subjects.forEach(subject => {
      const subjectData = NEETContexts.subjects[subject];
      if (subjectData) {
        context.educational_objectives.push({
          subject: subject,
          chapters: subjectData.chapters.slice(0, 5), // First 5 chapters as example
          difficulty_focus: subjectData.difficulty_patterns,
          common_challenges: subjectData.common_mistakes
        });
      }
    });

    return context;
  }

  async generateStorySections(sections, parameters) {
    const generatedSections = {};
    
    for (const sectionName of sections) {
      generatedSections[sectionName] = await this.generateSection(sectionName, parameters);
    }
    
    return generatedSections;
  }

  async generateSection(sectionName, parameters) {
    const sectionGenerators = {
      educational_context: () => ({
        description: "Educational context and NEET preparation alignment",
        requirements: [
          "Align with NEET syllabus and examination pattern",
          "Support diverse learner profiles and learning styles", 
          "Integrate evidence-based pedagogical approaches",
          "Ensure cultural and regional appropriateness for Indian students"
        ],
        considerations: [
          "Age group: 16-19 years (primarily)",
          "Language: English and Hindi support",
          "Device constraints: Android-first, low-data scenarios",
          "Study patterns: After school, weekend intensive sessions"
        ]
      }),

      learning_objectives: () => ({
        description: "Specific, measurable learning outcomes aligned with NEET requirements",
        objectives: [
          {
            cognitive_level: "Knowledge",
            description: "Students will recall key concepts, formulas, and facts",
            measurement: "Accuracy in factual questions >85%"
          },
          {
            cognitive_level: "Comprehension", 
            description: "Students will explain concepts in their own words",
            measurement: "Quality of explanations rated >4.0/5.0"
          },
          {
            cognitive_level: "Application",
            description: "Students will solve NEET-style problems accurately",
            measurement: "Problem-solving accuracy >75%"
          },
          {
            cognitive_level: "Analysis", 
            description: "Students will analyze complex scenarios and multi-step problems",
            measurement: "Complex problem accuracy >65%"
          }
        ]
      }),

      user_personas: () => ({
        description: "Detailed user personas for educational feature development",
        personas: Object.keys(NEETContexts.learner_profiles).map(profile => ({
          name: profile,
          characteristics: NEETContexts.learner_profiles[profile].characteristics,
          challenges: NEETContexts.learner_profiles[profile].challenges,
          learning_preferences: NEETContexts.learner_profiles[profile].learning_preferences,
          success_metrics: [
            "Engagement rate >80%",
            "Learning objective achievement >85%", 
            "Satisfaction score >4.5/5.0"
          ]
        }))
      }),

      technical_requirements: () => ({
        description: "Technical specifications for educational platform features",
        performance: {
          response_time: "<2 seconds for educational interactions",
          mobile_optimization: "Optimized for Android 8+ devices",
          offline_capability: "Core features available without internet",
          scalability: "Support 10,000+ concurrent users during peak hours"
        },
        integration: {
          learning_management: "LMS integration for progress tracking",
          analytics: "Educational analytics and learning insights",
          ai_services: "Integration with GPT-4o for intelligent features",
          assessment: "Comprehensive assessment and reporting system"
        },
        security: {
          data_protection: "COPPA compliance for student data",
          authentication: "Secure multi-factor authentication",
          privacy: "Privacy-first design with consent management"
        }
      }),

      pedagogical_approach: () => ({
        description: "Educational methodology and pedagogical framework",
        methodologies: Object.keys(NEETContexts.learning_methodologies).map(method => ({
          name: method,
          principle: NEETContexts.learning_methodologies[method].principle,
          neet_application: NEETContexts.learning_methodologies[method].neet_application,
          implementation: NEETContexts.learning_methodologies[method].implementation
        })),
        assessment_integration: Object.keys(NEETContexts.assessment_types).map(type => ({
          type: type,
          purpose: NEETContexts.assessment_types[type].purpose,
          timing: NEETContexts.assessment_types[type].timing,
          characteristics: NEETContexts.assessment_types[type].characteristics
        }))
      }),

      assessment_integration: () => ({
        description: "Comprehensive assessment framework integration",
        assessment_types: ["diagnostic", "formative", "summative", "adaptive"],
        neet_alignment: {
          question_patterns: "Match NEET examination question patterns",
          difficulty_distribution: "Align with NEET difficulty levels",
          time_constraints: "Practice within NEET time limits",
          subject_weightage: "Reflect NEET subject-wise weightage"
        },
        analytics: {
          performance_tracking: "Individual and cohort performance analysis",
          weakness_identification: "Automated weak area identification",
          improvement_recommendations: "Personalized study recommendations",
          predictive_modeling: "NEET score prediction based on performance"
        }
      }),

      success_metrics: () => ({
        description: "Measurable success criteria for educational effectiveness",
        learning_outcomes: {
          concept_mastery: ">80% students achieve proficiency in core concepts",
          knowledge_retention: ">85% retention rate after 30 days",
          skill_transfer: ">75% apply learning to new problem contexts",
          neet_preparedness: "Average improvement of 15-25 marks in mock tests"
        },
        engagement_metrics: {
          session_duration: "45-60 minutes average study session",
          feature_adoption: ">70% adoption rate for core features", 
          return_rate: ">85% monthly active retention",
          completion_rate: ">80% completion rate for started activities"
        },
        satisfaction_metrics: {
          student_satisfaction: ">4.5/5 rating from students",
          parent_satisfaction: ">80% parents report visible progress",
          educator_approval: ">90% expert validation score",
          net_promoter_score: ">70 NPS from user community"
        }
      }),

      // Additional section generators for other story types...
      ai_educational_objectives: () => ({
        description: "AI-powered educational feature objectives",
        capabilities: [
          "Personalized learning path generation based on performance",
          "Intelligent doubt resolution with context-aware explanations", 
          "Adaptive content difficulty adjustment in real-time",
          "Predictive analytics for performance forecasting"
        ],
        ai_models: {
          primary: "GPT-4o for complex reasoning and explanations",
          fallback: "GPT-4o-mini for cost-optimized interactions",
          specialized: "Domain-specific models for subject matter expertise"
        }
      }),

      content_specifications: () => ({
        description: "Educational content creation and validation requirements",
        quality_standards: {
          accuracy: "100% factual accuracy verified by subject matter experts",
          curriculum_alignment: "Complete alignment with NCERT and NEET syllabus",
          pedagogical_soundness: "Evidence-based learning design principles",
          cultural_appropriateness: "Suitable for Indian educational context"
        },
        content_types: [
          "Interactive lessons with multimedia elements",
          "Practice questions with detailed explanations",
          "Video tutorials with visual demonstrations", 
          "Assessment modules with instant feedback"
        ]
      }),

      mobile_learning_context: () => ({
        description: "Mobile-first educational experience design",
        constraints: {
          device_limitations: "Optimized for 2GB RAM Android devices",
          network_conditions: "Functional on 3G network speeds",
          battery_efficiency: "Minimal battery drain during study sessions",
          storage_optimization: "Efficient local storage utilization"
        },
        mobile_specific_features: [
          "Offline content synchronization for uninterrupted study",
          "Touch-optimized interactions for mathematical input",
          "Responsive design for various screen sizes",
          "Mobile-friendly assessment interfaces"
        ]
      })
    };

    const generator = sectionGenerators[sectionName];
    if (!generator) {
      return {
        description: `Generated section: ${sectionName}`,
        placeholder: true,
        requires_manual_input: true
      };
    }

    return generator();
  }

  selectRelevantAgents(storyType) {
    const agentMapping = {
      feature_development: ['neet-education-expert', 'edtech-product-manager', 'neet-ai-specialist'],
      content_creation: ['neet-education-expert', 'edtech-product-manager'],
      ai_integration: ['neet-ai-specialist', 'neet-education-expert'],
      assessment_system: ['neet-education-expert', 'neet-ai-specialist'],
      mobile_optimization: ['edtech-product-manager', 'neet-ai-specialist']
    };

    return agentMapping[storyType] || this.agents;
  }

  generateWorkflowSteps(storyType, parameters) {
    const commonSteps = [
      {
        step: "Requirements Analysis",
        agent: "edtech-product-manager", 
        description: "Analyze educational requirements and define success criteria",
        deliverables: ["requirements_document.md", "success_metrics.md"]
      },
      {
        step: "Educational Design",
        agent: "neet-education-expert",
        description: "Design pedagogical approach and learning methodology",
        deliverables: ["pedagogical_framework.md", "assessment_strategy.md"]
      },
      {
        step: "Technical Implementation",
        agent: "neet-ai-specialist",
        description: "Implement technical solutions with AI integration",
        deliverables: ["technical_specification.md", "implementation_guide.md"]
      },
      {
        step: "Quality Validation",
        agent: "neet-education-expert",
        description: "Validate educational effectiveness and accuracy",
        deliverables: ["validation_report.md", "quality_certification.md"]
      }
    ];

    return commonSteps;
  }

  generateQualityGates(storyType) {
    return [
      {
        gate: "Educational Quality Gate",
        criteria: [
          "Learning objectives clearly defined and measurable",
          "Content accuracy verified by subject matter experts",
          "Pedagogical approach validated against best practices",
          "Accessibility requirements met (WCAG 2.1 AA)"
        ],
        approvers: ["neet-education-expert"]
      },
      {
        gate: "Technical Quality Gate", 
        criteria: [
          "Performance requirements met (<2s response time)",
          "Mobile optimization validated on target devices",
          "Security and privacy requirements implemented",
          "Integration testing completed successfully"
        ],
        approvers: ["neet-ai-specialist"]
      },
      {
        gate: "Product Quality Gate",
        criteria: [
          "User experience meets design standards",
          "Success metrics tracking implemented",
          "Stakeholder acceptance criteria satisfied",
          "Documentation complete and reviewed"
        ],
        approvers: ["edtech-product-manager"]
      }
    ];
  }

  generateDeliverables(storyType) {
    const commonDeliverables = [
      "Educational feature specification",
      "Technical implementation guide", 
      "Quality assurance reports",
      "User acceptance testing results",
      "Documentation and training materials"
    ];

    const specificDeliverables = {
      content_creation: [
        "Content validation reports",
        "Subject matter expert reviews",
        "Accessibility compliance documentation"
      ],
      ai_integration: [
        "AI model performance metrics",
        "Ethical AI compliance reports", 
        "Personalization algorithm documentation"
      ],
      assessment_system: [
        "Psychometric validation results",
        "NEET alignment verification",
        "Assessment security documentation"
      ]
    };

    return [
      ...commonDeliverables,
      ...(specificDeliverables[storyType] || [])
    ];
  }

  generateSuccessCriteria(storyType, parameters) {
    return {
      educational_effectiveness: {
        learning_outcomes: ">85% achievement of defined learning objectives",
        knowledge_retention: ">80% retention after 30 days",
        student_engagement: ">4.2/5 average engagement score",
        neet_preparation: ">90% alignment with NEET examination requirements"
      },
      technical_performance: {
        response_time: "<2 seconds for educational interactions",
        availability: ">99.5% uptime during peak hours",
        mobile_performance: ">4.0 app store rating for mobile experience",
        error_rate: "<1% technical error rate"
      },
      user_satisfaction: {
        student_satisfaction: ">4.5/5 rating from students",
        parent_satisfaction: ">80% parents report visible improvement",
        educator_approval: ">90% approval from education experts",
        recommendation_rate: ">70% Net Promoter Score"
      }
    };
  }

  generateValidationFramework(storyType) {
    return {
      validation_phases: [
        {
          phase: "Design Validation",
          methods: ["Expert review", "Pedagogical assessment", "Accessibility audit"],
          timeline: "Pre-development phase"
        },
        {
          phase: "Implementation Validation", 
          methods: ["Code review", "Integration testing", "Performance testing"],
          timeline: "Development phase"
        },
        {
          phase: "Educational Validation",
          methods: ["Student testing", "Learning outcome measurement", "Engagement analysis"],
          timeline: "Pre-launch phase"
        },
        {
          phase: "Deployment Validation",
          methods: ["Production monitoring", "User feedback analysis", "Success metrics tracking"],
          timeline: "Post-launch phase"
        }
      ],
      success_gates: [
        "All validation phases completed successfully",
        "Educational effectiveness criteria met",
        "Technical performance standards achieved", 
        "User satisfaction targets reached"
      ]
    };
  }

  async saveStory(story) {
    await fs.mkdir(this.config.outputDirectory, { recursive: true });
    
    const filename = `${story.type}_${story.id.split('-')[0]}_${Date.now()}.json`;
    const filepath = path.join(this.config.outputDirectory, filename);
    
    await fs.writeFile(filepath, JSON.stringify(story, null, 2), 'utf8');
    
    // Also create a markdown version for better readability
    const markdownContent = this.generateMarkdownStory(story);
    const markdownPath = path.join(this.config.outputDirectory, filename.replace('.json', '.md'));
    await fs.writeFile(markdownPath, markdownContent, 'utf8');
    
    return filepath;
  }

  generateMarkdownStory(story) {
    let markdown = `# ${story.title}\n\n`;
    markdown += `**Story ID:** ${story.id}\n`;
    markdown += `**Type:** ${story.type}\n`;
    markdown += `**Created:** ${story.created}\n\n`;
    
    markdown += `## Educational Context\n\n`;
    markdown += `- **Domain:** ${story.educational_context.domain}\n`;
    markdown += `- **Exam Focus:** ${story.educational_context.exam_focus.toUpperCase()}\n`;
    markdown += `- **Target Subjects:** ${story.educational_context.target_subjects.join(', ')}\n`;
    markdown += `- **Learner Profiles:** ${story.educational_context.learner_profiles.join(', ')}\n\n`;
    
    // Generate sections
    Object.entries(story.sections).forEach(([sectionName, sectionContent]) => {
      markdown += `## ${sectionName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;
      
      if (typeof sectionContent === 'object') {
        if (sectionContent.description) {
          markdown += `${sectionContent.description}\n\n`;
        }
        
        Object.entries(sectionContent).forEach(([key, value]) => {
          if (key === 'description') return;
          
          markdown += `### ${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n`;
          
          if (Array.isArray(value)) {
            value.forEach(item => {
              if (typeof item === 'object') {
                Object.entries(item).forEach(([itemKey, itemValue]) => {
                  markdown += `- **${itemKey}:** ${itemValue}\n`;
                });
                markdown += '\n';
              } else {
                markdown += `- ${item}\n`;
              }
            });
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => {
              markdown += `- **${subKey}:** ${subValue}\n`;
            });
          } else {
            markdown += `${value}\n`;
          }
          markdown += '\n';
        });
      } else {
        markdown += `${sectionContent}\n\n`;
      }
    });
    
    // BMAD Integration
    markdown += `## BMAD Integration\n\n`;
    markdown += `### Assigned Agents\n`;
    story.bmad_integration.agents.forEach(agent => {
      markdown += `- ${agent}\n`;
    });
    markdown += '\n';
    
    markdown += `### Workflow Steps\n`;
    story.bmad_integration.workflow_steps.forEach((step, index) => {
      markdown += `${index + 1}. **${step.step}** (${step.agent})\n`;
      markdown += `   - ${step.description}\n`;
      markdown += `   - Deliverables: ${step.deliverables.join(', ')}\n\n`;
    });
    
    markdown += `### Quality Gates\n`;
    story.bmad_integration.quality_gates.forEach((gate, index) => {
      markdown += `${index + 1}. **${gate.gate}**\n`;
      gate.criteria.forEach(criterion => {
        markdown += `   - ${criterion}\n`;
      });
      markdown += `   - Approvers: ${gate.approvers.join(', ')}\n\n`;
    });
    
    return markdown;
  }

  async generateMultipleStories(storyConfigs) {
    const results = [];
    
    for (const config of storyConfigs) {
      try {
        const story = await this.generateStory(config.type, config.parameters);
        const filepath = await this.saveStory(story);
        results.push({ success: true, story: story, filepath: filepath });
      } catch (error) {
        results.push({ success: false, error: error.message, config: config });
      }
    }
    
    return results;
  }
}

// CLI interface and main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Educational Story Generator for BMAD Integration

Usage:
  node generate-educational-stories.js <story-type> [options]

Story Types:
  - feature_development: Educational feature development stories
  - content_creation: Educational content creation stories  
  - ai_integration: AI-enhanced learning feature stories
  - assessment_system: Assessment system development stories
  - mobile_optimization: Mobile learning experience stories
  
Options:
  --subjects: Comma-separated list of subjects (physics,chemistry,biology)
  --learners: Comma-separated list of learner profiles
  --output: Output directory for generated stories
  
Examples:
  node generate-educational-stories.js feature_development --subjects=physics,chemistry
  node generate-educational-stories.js content_creation --subjects=biology --learners=first_time_aspirant
  node generate-educational-stories.js ai_integration --output=./custom-stories
    `);
    return;
  }

  const storyType = args[0];
  const parameters = {};
  
  // Parse command line options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--subjects=')) {
      parameters.subjects = arg.split('=')[1].split(',');
    } else if (arg.startsWith('--learners=')) {
      parameters.learner_profiles = arg.split('=')[1].split(',');
    } else if (arg.startsWith('--output=')) {
      parameters.outputDirectory = arg.split('=')[1];
    }
  }

  try {
    const generator = new EducationalStoryGenerator(parameters);
    const story = await generator.generateStory(storyType, parameters);
    const filepath = await generator.saveStory(story);
    
    console.log(`✅ Educational story generated successfully!`);
    console.log(`Story Type: ${story.type}`);
    console.log(`Story ID: ${story.id}`);
    console.log(`File Path: ${filepath}`);
    console.log(`\n📊 Story Summary:`);
    console.log(`- Agents: ${story.bmad_integration.agents.join(', ')}`);
    console.log(`- Workflow Steps: ${story.bmad_integration.workflow_steps.length}`);
    console.log(`- Quality Gates: ${story.bmad_integration.quality_gates.length}`);
    console.log(`- Educational Context: ${story.educational_context.exam_focus.toUpperCase()}`);
    console.log(`- Target Subjects: ${story.educational_context.target_subjects.join(', ')}`);
    
  } catch (error) {
    console.error(`❌ Error generating story: ${error.message}`);
    process.exit(1);
  }
}

// Export for use as module
module.exports = { EducationalStoryGenerator, NEETContexts };

// Run CLI if called directly
if (require.main === module) {
  main();
}
