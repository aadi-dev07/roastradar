import { RedditSearchParams, RedditSearchResponse } from "@/types/reddit";
import { handleCorsError } from "./corsProxyHelper";

// Proxy server URL - replace this with your deployed Cloudflare Worker URL
const PROXY_URL = "https://your-worker-url.workers.dev";

// Get access token via proxy
const getAccessToken = async (): Promise<string> => {
  try {
    const clientId = localStorage.getItem('redditClientId') || '';
    const clientSecret = localStorage.getItem('redditClientSecret') || '';
    
    if (!clientId || !clientSecret) {
      throw new Error("Missing Reddit API credentials");
    }
    
    const response = await fetch(`${PROXY_URL}/reddit/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clientId, clientSecret }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.access_token;
  } catch (error) {
    console.error('Error getting Reddit access token:', error);
    return handleCorsError(error);
  }
};

// Build search URL parameters for the proxy
const buildSearchParams = (params: RedditSearchParams): URLSearchParams => {
  const { query, subreddit, timeRange, limit = 100 } = params;
  
  // Convert timeRange to Reddit's format
  const timeFilter = timeRangeToRedditFormat(timeRange);
  
  // Build search parameters
  const searchParams = new URLSearchParams();
  searchParams.append('q', query);
  
  // Add subreddit filter if provided
  if (subreddit) {
    searchParams.append('subreddit', subreddit);
  }
  
  // Add time filter and other parameters
  searchParams.append('sort', 'relevance');
  searchParams.append('t', timeFilter);
  searchParams.append('limit', limit.toString());
  
  return searchParams;
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

// Search for posts that mention the competitor through our proxy
export const searchReddit = async (params: RedditSearchParams): Promise<RedditSearchResponse> => {
  try {
    const accessToken = await getAccessToken();
    const searchParams = buildSearchParams(params);
    
    const url = `${PROXY_URL}/reddit/search?${searchParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'X-Reddit-Access-Token': accessToken,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search Reddit');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching Reddit:', error);
    return handleCorsError(error);
  }
};

// Extract posts with negative sentiment - keep this unchanged
export const extractNegativePosts = (response: RedditSearchResponse) => {
  // In a real app, we'd implement sentiment analysis here
  // For now, we'll just return all posts
  return response.data.children.map(child => child.data);
};
