
import { RedditSearchParams, RedditSearchResponse } from "@/types/reddit";

// Basic auth for Reddit API
const getAuthHeaders = () => {
  const clientId = localStorage.getItem('redditClientId') || '';
  const clientSecret = localStorage.getItem('redditClientSecret') || '';
  
  // Using Basic Auth for Reddit API
  const token = btoa(`${clientId}:${clientSecret}`);
  
  return {
    'Authorization': `Basic ${token}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
};

// Get access token
const getAccessToken = async (): Promise<string> => {
  try {
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting Reddit access token:', error);
    throw error;
  }
};

// Build search URL
const buildSearchUrl = (params: RedditSearchParams): string => {
  const { query, subreddit, timeRange, limit = 100 } = params;
  
  // Convert timeRange to Reddit's format
  const timeFilter = timeRangeToRedditFormat(timeRange);
  
  // Build the base URL
  let url = `https://oauth.reddit.com/search.json?q=${encodeURIComponent(query)}`;
  
  // Add subreddit filter if provided
  if (subreddit) {
    url += `+subreddit:${encodeURIComponent(subreddit)}`;
  }
  
  // Add time filter and other parameters
  url += `&sort=relevance&t=${timeFilter}&limit=${limit}`;
  
  return url;
};

// Convert our time range to Reddit's format
const timeRangeToRedditFormat = (timeRange: string): string => {
  switch (timeRange) {
    case '1':
      return 'month';
    case '3':
      return 'quarter';
    case '6':
      return 'year'; // Reddit doesn't have a 6-month option, so we use year
    case '12':
      return 'year';
    default:
      return 'quarter'; // Default to 3 months
  }
};

// Search for posts that mention the competitor
export const searchReddit = async (params: RedditSearchParams): Promise<RedditSearchResponse> => {
  try {
    const accessToken = await getAccessToken();
    const url = buildSearchUrl(params);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching Reddit:', error);
    throw error;
  }
};

// Extract posts with negative sentiment
export const extractNegativePosts = (response: RedditSearchResponse) => {
  // In a real app, we'd implement sentiment analysis here
  // For now, we'll just return all posts
  return response.data.children.map(child => child.data);
};
