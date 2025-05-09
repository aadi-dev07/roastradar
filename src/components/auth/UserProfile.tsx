
import React, { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  UserRound, 
  Mail, 
  Save, 
  KeyRound,
  Shield 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfile: React.FC = () => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [redditClientId, setRedditClientId] = useState("");
  const [redditClientSecret, setRedditClientSecret] = useState("");
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
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
      const userRedditClientId = user.unsafeMetadata.redditClientId as string;
      const userRedditClientSecret = user.unsafeMetadata.redditClientSecret as string;
      const userOpenRouterApiKey = user.unsafeMetadata.openRouterApiKey as string;
      const userGeminiApiKey = user.unsafeMetadata.geminiApiKey as string;
      
      if (userRedditClientId) setRedditClientId(userRedditClientId);
      if (userRedditClientSecret) setRedditClientSecret(userRedditClientSecret);
      if (userOpenRouterApiKey) setOpenRouterApiKey(userOpenRouterApiKey);
      if (userGeminiApiKey) setGeminiApiKey(userGeminiApiKey);
    }
  }, [isUserLoaded, user]);

  const handleSaveCredentials = async () => {
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
          unsafeMetadata: {
            redditClientId,
            redditClientSecret,
            openRouterApiKey,
            geminiApiKey,
          },
        });
      }
      
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

  if (!isUserLoaded) {
    return <div className="py-8 text-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="py-8 text-center">Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-foreground/70">Manage your account settings and API credentials</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col items-center mb-4">
              <Avatar className="w-20 h-20 mb-4">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>{user.firstName?.charAt(0) || ""}{user.lastName?.charAt(0) || ""}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-foreground/70">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => user.update({})}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <KeyRound size={20} className="text-primary" />
              <h3 className="text-lg font-medium">API Credentials</h3>
            </div>
            
            <div className="space-y-6">
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
                onClick={handleSaveCredentials} 
                className="w-full flex items-center gap-2"
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Credentials"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
