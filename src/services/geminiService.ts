
import { RawRedditData, AnalysisResult } from "@/types/analysis";

export const analyzeWithGemini = async (data: RawRedditData): Promise<AnalysisResult> => {
  try {
    const apiKey = localStorage.getItem('geminiApiKey') || '';
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    // Prepare the posts for analysis - with Gemini we can send more posts
    const limitedPosts = data.posts.slice(0, 30);
    
    const postsForAnalysis = limitedPosts.map(post => ({
      title: post.title,
      content: post.selftext.substring(0, 500), // Limit content length
      url: `https://reddit.com${post.permalink}`,
      subreddit: post.subreddit
    }));

    // Extract model version from the model ID
    const selectedModel = localStorage.getItem('selectedModel') || 'google/gemini-1.0-pro';
    
    // Get just the model name without the provider prefix
    const modelName = selectedModel.split('/')[1] || 'gemini-1.0-pro';

    // Create prompt for the AI - same as OpenRouter for consistency
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

    // Make the API call to Google Gemini with the correct API version (v1)
    // and proper model format in the URL
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2000,
          topP: 0.95,
          topK: 40
        }
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(`Gemini API error: ${result.error.message || 'Unknown error'}`);
    }

    // Extract the JSON from the model's response
    try {
      // The response structure is different from OpenRouter
      const content = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (!content) {
        throw new Error('Empty response from Gemini API');
      }
      
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
      console.error('Error parsing Gemini response:', e);
      throw new Error('Failed to parse analysis result from Gemini');
    }
  } catch (error) {
    console.error('Error analyzing content with Gemini:', error);
    throw error;
  }
};
