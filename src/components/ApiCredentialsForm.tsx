
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { KeyRound, Save } from "lucide-react";

const ApiCredentialsForm: React.FC = () => {
  const [redditClientId, setRedditClientId] = useState("");
  const [redditClientSecret, setRedditClientSecret] = useState("");
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Load stored credentials on mount
    const storedRedditClientId = localStorage.getItem("redditClientId") || "";
    const storedRedditClientSecret = localStorage.getItem("redditClientSecret") || "";
    const storedOpenRouterApiKey = localStorage.getItem("openRouterApiKey") || "";
    
    setRedditClientId(storedRedditClientId);
    setRedditClientSecret(storedRedditClientSecret);
    setOpenRouterApiKey(storedOpenRouterApiKey);
    
    // Check if we have all credentials
    setIsComplete(
      !!storedRedditClientId && 
      !!storedRedditClientSecret && 
      !!storedOpenRouterApiKey
    );
  }, []);

  const handleSave = () => {
    // Store the API credentials
    localStorage.setItem("redditClientId", redditClientId);
    localStorage.setItem("redditClientSecret", redditClientSecret);
    localStorage.setItem("openRouterApiKey", openRouterApiKey);
    
    setIsComplete(!!redditClientId && !!redditClientSecret && !!openRouterApiKey);
    
    toast.success("API credentials saved", {
      description: "Your credentials have been saved securely in local storage."
    });
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
          <Label htmlFor="openRouterApiKey">OpenRouter API Key</Label>
          <Input
            id="openRouterApiKey"
            value={openRouterApiKey}
            onChange={(e) => setOpenRouterApiKey(e.target.value)}
            placeholder="Enter your OpenRouter API Key"
            type="password"
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          className="w-full flex items-center gap-2"
        >
          <Save size={16} />
          Save Credentials
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
