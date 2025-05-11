
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { KeyRound, Save } from "lucide-react";

const ApiCredentialsForm: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const [redditClientId, setRedditClientId] = useState("");
  const [redditClientSecret, setRedditClientSecret] = useState("");
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load stored credentials from user metadata if signed in, otherwise from localStorage
    const loadCredentials = async () => {
      try {
        if (isSignedIn && user) {
          // Get from user metadata
          const metadata = user.unsafeMetadata as Record<string, string> || {};
          setRedditClientId(metadata.redditClientId || "");
          setRedditClientSecret(metadata.redditClientSecret || "");
          setOpenRouterApiKey(metadata.openRouterApiKey || "");
          setGeminiApiKey(metadata.geminiApiKey || "");
        } else {
          // Fall back to localStorage
          const storedRedditClientId = localStorage.getItem("redditClientId") || "";
          const storedRedditClientSecret = localStorage.getItem("redditClientSecret") || "";
          const storedOpenRouterApiKey = localStorage.getItem("openRouterApiKey") || "";
          const storedGeminiApiKey = localStorage.getItem("geminiApiKey") || "";
          
          setRedditClientId(storedRedditClientId);
          setRedditClientSecret(storedRedditClientSecret);
          setOpenRouterApiKey(storedOpenRouterApiKey);
          setGeminiApiKey(storedGeminiApiKey);
        }
      } catch (error) {
        console.error("Error loading credentials:", error);
      }
    };
    
    loadCredentials();
  }, [isSignedIn, user]);

  // Check completion status whenever any credential changes
  useEffect(() => {
    const complete = (!!redditClientId && !!redditClientSecret) && 
      (!!openRouterApiKey || !!geminiApiKey);
    setIsComplete(complete);
  }, [redditClientId, redditClientSecret, openRouterApiKey, geminiApiKey]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Always store in localStorage as fallback
      localStorage.setItem("redditClientId", redditClientId);
      localStorage.setItem("redditClientSecret", redditClientSecret);
      localStorage.setItem("openRouterApiKey", openRouterApiKey);
      localStorage.setItem("geminiApiKey", geminiApiKey);
      
      if (isSignedIn && user) {
        // Store credentials in user metadata
        const currentMetadata = user.unsafeMetadata as Record<string, any> || {};
        await user.update({
          unsafeMetadata: {
            ...currentMetadata,
            redditClientId,
            redditClientSecret,
            openRouterApiKey,
            geminiApiKey,
          },
        });
      }
      
      toast.success("API credentials saved", {
        description: isSignedIn 
          ? "Your credentials have been saved to your account." 
          : "Your credentials have been saved securely in local storage."
      });
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast.error("Failed to save credentials", {
        description: "There was an error saving your credentials. Please try again."
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
      
      {isSignedIn && (
        <p className="text-sm text-muted-foreground mb-4">
          Your API credentials will be securely stored in your account.
        </p>
      )}
      
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
