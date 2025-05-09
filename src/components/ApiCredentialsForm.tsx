
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { KeyRound, Save } from "lucide-react";

const ApiCredentialsForm: React.FC = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [redditClientId, setRedditClientId] = useState("");
  const [redditClientSecret, setRedditClientSecret] = useState("");
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load stored credentials from localStorage first
    const storedRedditClientId = localStorage.getItem("redditClientId") || "";
    const storedRedditClientSecret = localStorage.getItem("redditClientSecret") || "";
    const storedOpenRouterApiKey = localStorage.getItem("openRouterApiKey") || "";
    const storedGeminiApiKey = localStorage.getItem("geminiApiKey") || "";
    
    setRedditClientId(storedRedditClientId);
    setRedditClientSecret(storedRedditClientSecret);
    setOpenRouterApiKey(storedOpenRouterApiKey);
    setGeminiApiKey(storedGeminiApiKey);
    
    // Then try to load from user metadata if available
    if (isUserLoaded && user) {
      const userRedditClientId = user.publicMetadata.redditClientId as string;
      const userRedditClientSecret = user.publicMetadata.redditClientSecret as string;
      const userOpenRouterApiKey = user.publicMetadata.openRouterApiKey as string;
      const userGeminiApiKey = user.publicMetadata.geminiApiKey as string;
      
      if (userRedditClientId) setRedditClientId(userRedditClientId);
      if (userRedditClientSecret) setRedditClientSecret(userRedditClientSecret);
      if (userOpenRouterApiKey) setOpenRouterApiKey(userOpenRouterApiKey);
      if (userGeminiApiKey) setGeminiApiKey(userGeminiApiKey);
    }
    
    // Check if we have all required credentials
    setIsComplete(
      !!redditClientId && 
      !!redditClientSecret && 
      (!!openRouterApiKey || !!geminiApiKey)
    );
  }, [isUserLoaded, user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save to localStorage for immediate use
      localStorage.setItem("redditClientId", redditClientId);
      localStorage.setItem("redditClientSecret", redditClientSecret);
      localStorage.setItem("openRouterApiKey", openRouterApiKey);
      localStorage.setItem("geminiApiKey", geminiApiKey);
      
      // Also save to user metadata if user is logged in
      if (isUserLoaded && user) {
        await user.update({
          publicMetadata: {
            ...user.publicMetadata,
            redditClientId,
            redditClientSecret,
            openRouterApiKey,
            geminiApiKey,
          },
        });
      }
      
      setIsComplete(
        !!redditClientId && 
        !!redditClientSecret && 
        (!!openRouterApiKey || !!geminiApiKey)
      );
      
      toast.success("API credentials saved", {
        description: "Your credentials have been saved securely."
      });
    } catch (error: any) {
      console.error("Error saving credentials:", error);
      toast.error("Failed to save credentials", {
        description: error.message || "Please try again later"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-5 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound size={20} className="text-primary" />
        <h3 className="text-lg font-medium">API Credentials</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="redditClientId">Reddit Client ID</Label>
          <Input
            id="redditClientId"
            value={redditClientId}
            onChange={(e) => setRedditClientId(e.target.value)}
            placeholder="Enter your Reddit Client ID"
            type="password"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="redditClientSecret">Reddit Client Secret</Label>
          <Input
            id="redditClientSecret"
            value={redditClientSecret}
            onChange={(e) => setRedditClientSecret(e.target.value)}
            placeholder="Enter your Reddit Client Secret"
            type="password"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="openRouterApiKey">OpenRouter API Key (Optional if using Gemini)</Label>
          <Input
            id="openRouterApiKey"
            value={openRouterApiKey}
            onChange={(e) => setOpenRouterApiKey(e.target.value)}
            placeholder="Enter your OpenRouter API Key"
            type="password"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="geminiApiKey">Google Gemini API Key (Optional if using OpenRouter)</Label>
          <Input
            id="geminiApiKey"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder="Enter your Google Gemini API Key"
            type="password"
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          className="w-full flex items-center gap-2"
          disabled={isSaving}
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save Credentials"}
        </Button>
        
        {isComplete && (
          <p className="text-sm text-foreground/70">
            ✓ All credentials are set up and ready to use
          </p>
        )}
      </div>
    </div>
  );
};

export default ApiCredentialsForm;
