
import { AnalysisResult, RawRedditData, AIModel } from "@/types/analysis";
import { RedditSearchParams } from "@/types/reddit";
import { extractNegativePosts, searchReddit } from "./redditService";
import { analyzeRedditContent } from "./openRouterService";
import { analyzeWithGemini } from "./geminiService";
import { getModelById } from "./modelService";
import { toast } from "@/hooks/use-toast";
import { displayCorsErrorHelp } from "./corsProxyHelper";

// Main function to analyze competitor pain points
export const analyzeCompetitor = async (
  competitor: string,
  subreddit: string = "",
  timeRange: string = "3",
  modelId: string = "google/gemini-1.0-pro"
): Promise<AnalysisResult> => {
  try {
    // Step 1: Search Reddit for posts about the competitor
    const searchParams: RedditSearchParams = {
      query: `${competitor} AND (issue OR problem OR bug OR hate OR frustrated OR annoying)`,
      subreddit,
      timeRange,
      limit: 100,
    };
    
    const searchResponse = await searchReddit(searchParams);
    
    // Step 2: Extract negative posts about the competitor
    const negativePosts = extractNegativePosts(searchResponse);
    
    if (negativePosts.length === 0) {
      throw new Error(`No posts found about ${competitor}`);
    }
    
    // Step 3: Analyze the posts using selected AI model
    const rawData: RawRedditData = {
      posts: negativePosts,
    };
    
    // Get model details
    const selectedModel = getModelById(modelId);
    if (!selectedModel) {
      throw new Error(`Invalid model selected: ${modelId}`);
    }
    
    // Store selected model for potential use in service files
    localStorage.setItem('selectedModel', modelId);
    
    let analysisResult: AnalysisResult;

    // Route to appropriate service based on provider
    switch (selectedModel.provider) {
      case 'google':
        analysisResult = await analyzeWithGemini(rawData);
        break;
      case 'deepseek':
      case 'openai':
      default:
        analysisResult = await analyzeRedditContent(rawData, selectedModel);
        break;
    }

    return analysisResult;
    
  } catch (error: any) {
    console.error("Error analyzing competitor:", error);
    
    // Check if it might be a CORS error
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('NetworkError') ||
        error.message?.includes('Network request failed') ||
        error.message?.includes('CORS')) {
      displayCorsErrorHelp();
      toast.error("API Connection Error", {
        description: "Reddit API requires a proxy server. See console for details.",
      });
    } else {
      toast.error("Analysis failed", {
        description: error.message || "Something went wrong",
      });
    }
    
    throw error;
  }
};
