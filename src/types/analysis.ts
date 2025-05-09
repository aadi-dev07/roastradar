
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
  provider: 'openai' | 'google' | 'anthropic' | 'deepseek';
  maxTokens: number;
  description: string;
  isFree?: boolean;
}

export const AI_MODELS: AIModel[] = [
  // OpenAI Models
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
  
  // Google Gemini Models
  {
    id: 'google/gemini-1.0-pro',
    name: 'Gemini 1.0 Pro',
    provider: 'google',
    maxTokens: 2000,
    description: 'Google\'s standard LLM'
  },
  {
    id: 'google/gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    maxTokens: 2500,
    description: 'Google\'s advanced LLM with enhanced capabilities'
  },
  {
    id: 'google/gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    maxTokens: 1800,
    description: 'Faster and more efficient Google LLM'
  },
  
  // Free OpenRouter Models
  {
    id: 'deepseek/deepseek-chat-v3-0324',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    maxTokens: 1200,
    description: 'Free alternative with good performance',
    isFree: true
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'deepseek',
    maxTokens: 1000,
    description: 'Fast free general purpose model',
    isFree: true
  }
];
