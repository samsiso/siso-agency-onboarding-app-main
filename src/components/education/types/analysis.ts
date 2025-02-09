
export interface VideoChapter {
  timestamp: string;
  title: string;
  summary: string;
}

export interface CodeSegment {
  language: string;
  timestamp: string;
  snippet_preview: string;
}

export interface ExternalResource {
  type: 'Documentation' | 'GitHub' | 'Article';
  url: string;
  description: string;
}

export interface VisualAid {
  timestamp: string;
  type: 'Demo' | 'Diagram' | 'Code' | 'Slides';
  description: string;
}

export interface SentimentAnalysis {
  overall_score: number;
  key_sentiments: string[];
  engagement_prediction: number;
}

export interface VideoAnalysis {
  id: string;
  video_id: string;
  chapters: VideoChapter[];
  complexity_score: number;
  prerequisites: string[];
  technologies_mentioned: string[];
  code_segments: CodeSegment[];
  key_concepts: string[];
  learning_outcomes: string[];
  estimated_completion_time: number;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  external_resources: ExternalResource[];
  sentiment_analysis: SentimentAnalysis;
  visual_aids: VisualAid[];
}
