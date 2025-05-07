
import { AnalysisResult, RawRedditData } from "@/types/analysis";
import { RedditSearchParams } from "@/types/reddit";
import { extractNegativePosts, searchReddit } from "./redditService";
import { analyzeRedditContent } from "./openRouterService";
import { toast } from "@/components/ui/sonner";

// Main function to analyze competitor pain points
export const analyzeCompetitor = async (
  competitor: string,
  subreddit: string = "",
  timeRange: string = "3"
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
    
    // Step 3: Analyze the posts using OpenRouter's AI
    const rawData: RawRedditData = {
      posts: negativePosts,
    };
    
    const analysisResult = await analyzeRedditContent(rawData);
    return analysisResult;
    
  } catch (error: any) {
    console.error("Error analyzing competitor:", error);
    toast.error("Analysis failed", {
      description: error.message || "Something went wrong",
    });
    throw error;
  }
};
