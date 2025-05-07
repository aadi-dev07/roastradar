
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
