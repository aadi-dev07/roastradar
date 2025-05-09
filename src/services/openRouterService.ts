
import { RawRedditData } from "@/types/analysis";
import { AnalysisResult, AIModel } from "@/types/analysis";

// OpenRouter API call to analyze Reddit content
export const analyzeRedditContent = async (
  data: RawRedditData, 
  model: AIModel = { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 1500, description: '' }
): Promise<AnalysisResult> => {
  try {
    const apiKey = localStorage.getItem('openRouterApiKey') || '';
    if (!apiKey) {
      throw new Error('OpenRouter API key not found');
    }

    // Prepare the posts for analysis - adjust based on model
    const postLimit = model.provider === 'deepseek' ? 15 : 
                       model.id.includes('gpt-3.5') ? 10 : 20;
                       
    const limitedPosts = data.posts.slice(0, postLimit);
    
    const postsForAnalysis = limitedPosts.map(post => ({
      title: post.title,
      content: post.selftext.substring(0, 500), // Limit content length
      url: `https://reddit.com${post.permalink}`,
      subreddit: post.subreddit
    }));

    // Create prompt for the AI
    const prompt = `
    You are an expert at analyzing customer feedback and identifying product pain points.
    
    Analyze these Reddit posts about a competitor product and:
    1. Write a brief summary (1-2 sentences) of the main complaints
    2. Extract 5-8 tags/categories representing common issues
    3. Group similar complaints into 3-5 distinct pain point clusters with appropriate emoji icons
    4. For each cluster, provide 2 representative quotes

    Format your response as a valid JSON object with the following structure:
    {
      "summary": "Brief summary of main issues...",
      "tags": ["UX Issues", "Mobile Performance", ...],
      "painPoints": [
        {
          "icon": "📱",
          "title": "Pain point title",
          "count": number_of_mentions,
          "quotes": [
            { 
              "text": "Actual quote from a post...",
              "url": "URL to the Reddit post"
            },
            ...
          ]
        },
        ...
      ]
    }

    Here are the posts to analyze:
    ${JSON.stringify(postsForAnalysis)}
    `;

    // Make the API call to OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: model.id,
        messages: [
          { 
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: model.maxTokens,
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || 'Error from OpenRouter API');
    }

    // Extract the JSON from the model's response
    const content = result.choices?.[0]?.message?.content || '';
    
    // Parse the JSON response
    try {
      // Extract JSON from the response (handling potential markdown code blocks)
      let jsonString = content;
      if (content.includes('```json')) {
        jsonString = content.split('```json')[1].split('```')[0].trim();
      } else if (content.includes('```')) {
        jsonString = content.split('```')[1].split('```')[0].trim();
      }
      
      const analysisResult = JSON.parse(jsonString);
      return analysisResult;
    } catch (e) {
      console.error('Error parsing OpenRouter response:', e);
      throw new Error('Failed to parse analysis result');
    }
  } catch (error) {
    console.error('Error analyzing content with OpenRouter:', error);
    throw error;
  }
};
