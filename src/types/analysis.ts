
import { RedditPost } from "./reddit";

export interface Quote {
  text: string;
  url: string;
  author?: string;
  subreddit?: string;
  created_utc?: number;
}

export interface PainPoint {
  icon: string;
  title: string;
  count: number;
  quotes: Quote[];
}

export interface AnalysisResult {
  summary: string;
  tags: string[];
  painPoints: PainPoint[];
}

export interface RawRedditData {
  posts: RedditPost[];
}

export type AIModel = {
  id: string;
  name: string;
  provider: 'openai' | 'google' | 'anthropic';
  maxTokens: number;
  description: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    maxTokens: 1500,
    description: 'Powerful but may require more credits'
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    maxTokens: 1000,
    description: 'Faster and more affordable'
  },
  {
    id: 'google/gemini-pro',
    name: 'Google Gemini Pro',
    provider: 'google',
    maxTokens: 2000,
    description: 'Google\'s advanced LLM'
  }
];
