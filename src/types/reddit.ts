
export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  permalink: string;
  author: string;
  created_utc: number;
  subreddit: string;
  score: number;
}

export interface RedditSearchResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
  };
}

export interface RedditSearchParams {
  query: string;
  subreddit?: string;
  timeRange: string;
  limit?: number;
}
