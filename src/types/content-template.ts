
import { ContentCategory, TechnicalComplexity, ArticleImpact } from './blog';

export interface ContentTemplateSection {
  title: string;
  required_fields: {
    content: boolean;
    key_details: boolean;
    implications: boolean;
    source_references: boolean;
    technical_complexity: boolean;
  };
  suggested_length: {
    min_words: number;
    max_words: number;
  };
  importance_level: 'high' | 'medium' | 'low';
  subsection_type: 'overview' | 'analysis' | 'technical' | 'impact' | 'conclusion';
  guidelines: string[];
}

export interface ContentTemplate {
  metadata: {
    required: {
      title: boolean;
      description: boolean;
      category: ContentCategory;
      technical_complexity: TechnicalComplexity;
      impact: ArticleImpact;
      source: boolean;
      date: boolean;
    };
    optional: {
      image_url: boolean;
      tags: boolean;
      related_articles: boolean;
      technical_details: boolean;
    };
  };
  sections: ContentTemplateSection[];
  ai_analysis_requirements: {
    key_insights: boolean;
    market_impact: boolean;
    tech_predictions: boolean;
    related_technologies: boolean;
    business_implications: boolean;
  };
  quality_checks: {
    minimum_sections: number;
    required_sources: number;
    needs_technical_review: boolean;
    needs_editorial_review: boolean;
  };
}

export const DEFAULT_TEMPLATE: ContentTemplate = {
  metadata: {
    required: {
      title: true,
      description: true,
      category: 'breakthrough_technologies',
      technical_complexity: 'intermediate',
      impact: 'medium',
      source: true,
      date: true
    },
    optional: {
      image_url: true,
      tags: true,
      related_articles: true,
      technical_details: true
    }
  },
  sections: [
    {
      title: "Overview",
      required_fields: {
        content: true,
        key_details: true,
        implications: true,
        source_references: true,
        technical_complexity: true
      },
      suggested_length: {
        min_words: 150,
        max_words: 300
      },
      importance_level: 'high',
      subsection_type: 'overview',
      guidelines: [
        "Start with a clear, concise summary of the technology or development",
        "Highlight key innovations or breakthroughs",
        "Include relevant context and background",
        "Specify the primary stakeholders or affected parties"
      ]
    },
    {
      title: "Technical Analysis",
      required_fields: {
        content: true,
        key_details: true,
        implications: true,
        source_references: true,
        technical_complexity: true
      },
      suggested_length: {
        min_words: 300,
        max_words: 600
      },
      importance_level: 'high',
      subsection_type: 'technical',
      guidelines: [
        "Detail the technical specifications and functionality",
        "Compare with existing technologies",
        "Explain the underlying architecture or methodology",
        "Include relevant code snippets or technical diagrams"
      ]
    },
    {
      title: "Market Impact",
      required_fields: {
        content: true,
        key_details: true,
        implications: true,
        source_references: true,
        technical_complexity: false
      },
      suggested_length: {
        min_words: 200,
        max_words: 400
      },
      importance_level: 'medium',
      subsection_type: 'impact',
      guidelines: [
        "Analyze potential market disruption",
        "Identify affected industries and sectors",
        "Discuss competitive advantages",
        "Include market size estimates and growth projections"
      ]
    },
    {
      title: "Implementation Insights",
      required_fields: {
        content: true,
        key_details: true,
        implications: true,
        source_references: true,
        technical_complexity: true
      },
      suggested_length: {
        min_words: 250,
        max_words: 500
      },
      importance_level: 'medium',
      subsection_type: 'analysis',
      guidelines: [
        "Outline implementation requirements",
        "Discuss potential challenges and solutions",
        "Include resource requirements",
        "Provide timeline estimates"
      ]
    },
    {
      title: "Future Implications",
      required_fields: {
        content: true,
        key_details: false,
        implications: true,
        source_references: true,
        technical_complexity: false
      },
      suggested_length: {
        min_words: 200,
        max_words: 400
      },
      importance_level: 'medium',
      subsection_type: 'conclusion',
      guidelines: [
        "Project long-term impact on industry",
        "Discuss potential future developments",
        "Consider regulatory implications",
        "Address societal impact"
      ]
    }
  ],
  ai_analysis_requirements: {
    key_insights: true,
    market_impact: true,
    tech_predictions: true,
    related_technologies: true,
    business_implications: true
  },
  quality_checks: {
    minimum_sections: 3,
    required_sources: 2,
    needs_technical_review: true,
    needs_editorial_review: true
  }
};

export const validateContentAgainstTemplate = (
  content: any, 
  template: ContentTemplate = DEFAULT_TEMPLATE
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate required metadata
  Object.entries(template.metadata.required).forEach(([field, required]) => {
    if (required && !content[field]) {
      errors.push(`Missing required metadata: ${field}`);
    }
  });

  // Validate sections
  if (!content.sections || content.sections.length < template.quality_checks.minimum_sections) {
    errors.push(`Minimum ${template.quality_checks.minimum_sections} sections required`);
  }

  // Validate content sections against template
  content.sections?.forEach((section: any, index: number) => {
    const templateSection = template.sections[index];
    if (templateSection) {
      Object.entries(templateSection.required_fields).forEach(([field, required]) => {
        if (required && !section[field]) {
          errors.push(`Missing required field "${field}" in section "${section.title}"`);
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};
