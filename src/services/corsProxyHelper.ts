
import { toast } from "@/hooks/use-toast";

/**
 * Temporary helper to explain CORS issues to users
 */
export const displayCorsErrorHelp = () => {
  toast({
    title: "CORS Error Detected",
    description: 
      "Reddit API requires a backend proxy. Until deployed, try using a browser extension that disables CORS for testing.",
    duration: 8000,
  });

  console.log(`
    =======================================================
    CORS Error Resolution Guide:
    =======================================================
    
    The Reddit API doesn't allow direct browser requests due to CORS restrictions.
    
    Temporary solutions for development:
    
    1. Use a browser extension like "CORS Unblock" (Chrome) or "CORS Everywhere" (Firefox)
    
    2. For production, deploy the provided Cloudflare Worker script in src/services/redditProxy.js
       to https://workers.cloudflare.com/ and update the PROXY_URL in redditService.ts
       
    3. Alternatively, you could set up a Node.js/Express server to handle the Reddit API requests
    
    =======================================================
  `);
};

/**
 * Update your Reddit service to display helpful messages on error
 */
export const handleCorsError = (error: any): never => {
  // Detect if this might be a CORS error
  if (error.message?.includes('Failed to fetch') || 
      error.message?.includes('NetworkError') ||
      error.message?.includes('Network request failed')) {
    displayCorsErrorHelp();
  }
  
  throw error;
};
