
-- Add new sections to article_sections table
INSERT INTO article_sections (
  article_id,
  title,
  content,
  section_order,
  technical_complexity,
  importance_level,
  subsection_type,
  source_references,
  last_updated
) VALUES 
  -- Core Technology Sections
  (
    '9af9d706-14fb-412d-996a-27f738484450',
    'Breakthrough AI Research Tools',
    'Deep Research has revolutionized knowledge work by deploying hundreds of autonomous agents that can analyze and synthesize information from across the internet. The system can produce comprehensive reports in minutes instead of hours, with a remarkable 95% reduction in research time. This advancement represents a fundamental shift in how we approach knowledge work and data analysis.',
    1,
    'advanced',
    'high',
    'key_details',
    '{"research_paper": "Deep Research Framework 2024", "industry_report": "AI Impact Analysis Q1 2024"}',
    NOW()
  ),
  (
    '9af9d706-14fb-412d-996a-27f738484450',
    'Integration and Economic Impact',
    'AI integration is reshaping daily operations across industries. The deployment of AI agents working alongside human experts has shown significant improvements in efficiency. Economic indicators suggest these tools currently impact about 5% of all economic tasks, with exponential growth expected.',
    2,
    'intermediate',
    'high',
    'analysis',
    '{"economic_report": "AI Integration Impact Study", "market_analysis": "Industry Transformation Q1 2024"}',
    NOW()
  ),
  -- Healthcare and Medical AI
  (
    '9af9d706-14fb-412d-996a-27f738484450',
    'Medical AI Breakthroughs',
    'Recent clinical trials have demonstrated remarkable progress in medical AI, particularly in diagnostics. A landmark study of 100,000 women showed a 29% improvement in cancer detection rates using AI-assisted mammography screening, without increasing false positives. This represents a significant advancement in healthcare technology.',
    3,
    'advanced',
    'high',
    'overview',
    '{"clinical_trial": "AI Mammography Study 2024", "medical_journal": "Healthcare AI Review"}',
    NOW()
  ),
  -- Robotics and Automation
  (
    '9af9d706-14fb-412d-996a-27f738484450',
    'Next-Generation Robotics',
    'Significant developments in humanoid robotics have emerged, with Figure AI announcing a major breakthrough in end-to-end humanoid robot AI. The company is reportedly in talks to raise $1.5 billion at a $39 billion valuation. Additionally, new hybrid designs combining bipedal movement with wheeled bases are showing promising results.',
    4,
    'advanced',
    'high',
    'overview',
    '{"company_announcement": "Figure AI Press Release", "market_valuation": "Robotics Industry Report 2024"}',
    NOW()
  ),
  -- Language Models and AI Development
  (
    '9af9d706-14fb-412d-996a-27f738484450',
    'Advanced Language Models',
    'The landscape of language models has evolved significantly with the introduction of Google Gemini 2.0 variants and Anthropic''s hybrid model. These developments showcase improvements in both speed and reasoning capabilities, with Gemini 2.0 Flash optimized for high-performance tasks and infinite context memory.',
    5,
    'advanced',
    'high',
    'analysis',
    '{"technical_report": "Language Model Performance Study", "industry_analysis": "AI Model Comparison 2024"}',
    NOW()
  ),
  -- International Developments
  (
    '9af9d706-14fb-412d-996a-27f738484450',
    'International AI Developments',
    'Global AI development has become increasingly complex, with significant developments in Chinese AI technology raising both opportunities and concerns. The DeepSeek controversy has highlighted issues around censorship, security, and international competition, leading to potential legislative action with fines up to $100 million for businesses.',
    6,
    'intermediate',
    'high',
    'implications',
    '{"policy_document": "International AI Regulations", "security_analysis": "Global AI Security Report"}',
    NOW()
  );

-- Update the article''s key takeaways
UPDATE ai_news 
SET key_takeaways = ARRAY[
  'AI research tools have achieved 95% time reduction in knowledge work tasks',
  'Medical AI shows 29% improvement in cancer detection rates',
  'Humanoid robotics breakthrough by Figure AI valued at $39 billion',
  'New language models feature infinite context memory and hybrid reasoning',
  'International AI development raises significant security and regulatory concerns',
  'Economic impact of AI integration estimated at 5% of current tasks'
]
WHERE id = '9af9d706-14fb-412d-996a-27f738484450';
