
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Calendar, Search, ArrowRight, Settings, Cpu } from "lucide-react";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import ApiCredentialsForm from "@/components/ApiCredentialsForm";
import { analyzeCompetitor } from "@/services/analysisService";
import { toast } from "@/hooks/use-toast";
import { AIModel, AI_MODELS } from "@/types/analysis";
import { getAvailableModels, getDefaultModel, getModelsByProvider } from "@/services/modelService";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCompetitor = searchParams.get("name") || "";
  const { user, isSignedIn } = useUser();
  
  const [competitorName, setCompetitorName] = useState(initialCompetitor);
  const [subreddit, setSubreddit] = useState("");
  const [timeRange, setTimeRange] = useState("3");
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentialsForm, setShowCredentialsForm] = useState(false);
  const [credentialsComplete, setCredentialsComplete] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [models, setModels] = useState<AIModel[]>([]);
  const [modelsByProvider, setModelsByProvider] = useState<Record<string, AIModel[]>>({});

  useEffect(() => {
    // Load available models
    setModels(getAvailableModels());
    setModelsByProvider(getModelsByProvider());
    setSelectedModelId(getDefaultModel().id);
    
    // Check if we have all credentials - first check user metadata, then localStorage
    const checkCredentials = async () => {
      let redditClientId = "";
      let redditClientSecret = "";
      let openRouterApiKey = "";
      let geminiApiKey = "";
      
      if (isSignedIn && user) {
        // Get from user metadata
        const metadata = user.unsafeMetadata as Record<string, string>;
        redditClientId = metadata?.redditClientId || "";
        redditClientSecret = metadata?.redditClientSecret || "";
        openRouterApiKey = metadata?.openRouterApiKey || "";
        geminiApiKey = metadata?.geminiApiKey || "";
      }
      
      // If not found in user metadata, check localStorage
      if (!redditClientId) redditClientId = localStorage.getItem("redditClientId") || "";
      if (!redditClientSecret) redditClientSecret = localStorage.getItem("redditClientSecret") || "";
      if (!openRouterApiKey) openRouterApiKey = localStorage.getItem("openRouterApiKey") || "";
      if (!geminiApiKey) geminiApiKey = localStorage.getItem("geminiApiKey") || "";
      
      const complete = (!!redditClientId && !!redditClientSecret) && 
        (!!openRouterApiKey || !!geminiApiKey);
      
      setCredentialsComplete(complete);
      
      // If no credentials, show the form
      if (!complete) {
        setShowCredentialsForm(true);
      }
    };
    
    checkCredentials();
  }, [isSignedIn, user]);

  const checkApiCredentials = () => {
    // First check user metadata, then localStorage
    let redditClientId = "";
    let redditClientSecret = "";
    let openRouterApiKey = "";
    let geminiApiKey = "";
    
    if (isSignedIn && user) {
      // Get from user metadata
      const metadata = user.unsafeMetadata as Record<string, string>;
      redditClientId = metadata?.redditClientId || "";
      redditClientSecret = metadata?.redditClientSecret || "";
      openRouterApiKey = metadata?.openRouterApiKey || "";
      geminiApiKey = metadata?.geminiApiKey || "";
    }
    
    // If not found in user metadata, check localStorage
    if (!redditClientId) redditClientId = localStorage.getItem("redditClientId") || "";
    if (!redditClientSecret) redditClientSecret = localStorage.getItem("redditClientSecret") || "";
    if (!openRouterApiKey) openRouterApiKey = localStorage.getItem("openRouterApiKey") || "";
    if (!geminiApiKey) geminiApiKey = localStorage.getItem("geminiApiKey") || "";
    
    // Check if selected model is from OpenAI/DeepSeek or Google and verify corresponding API key
    const selectedModel = models.find(model => model.id === selectedModelId);
    if (selectedModel) {
      if (selectedModel.provider === 'google' && !geminiApiKey) {
        toast.error("Missing API key", {
          description: "Google Gemini API key is required for this model"
        });
        return false;
      }
      
      if ((selectedModel.provider === 'openai' || selectedModel.provider === 'deepseek') && !openRouterApiKey) {
        toast.error("Missing API key", {
          description: "OpenRouter API key is required for this model"
        });
        return false;
      }
    }
    
    return !!redditClientId && !!redditClientSecret;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!competitorName.trim()) {
      toast.error("Please enter a competitor name");
      return;
    }
    
    // Check if we have the required credentials
    if (!checkApiCredentials()) {
      setShowCredentialsForm(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get selected model info for display
      const selectedModel = models.find(model => model.id === selectedModelId);
      
      // Call our analysis service
      const result = await analyzeCompetitor(
        competitorName.trim(),
        subreddit.trim(),
        timeRange,
        selectedModelId
      );
      
      // Store result in sessionStorage for the insights page to use
      sessionStorage.setItem("analysisResult", JSON.stringify(result));
      sessionStorage.setItem("analysisModel", selectedModelId);
      
      // If user is signed in, save this scan to their history
      if (isSignedIn && user) {
        try {
          // Get existing scan history
          const metadata = user.unsafeMetadata as Record<string, any>;
          const scanHistory = metadata?.scanHistory || [];
          
          // Add new scan to history
          const newScan = {
            id: Date.now().toString(),
            competitorName: competitorName.trim(),
            date: new Date().toISOString(),
            modelId: selectedModelId,
            subreddit: subreddit.trim() || "all"
          };
          
          // Update user metadata with new scan history
          await user.update({
            unsafeMetadata: {
              ...metadata,
              scanHistory: [newScan, ...scanHistory.slice(0, 9)]  // Keep last 10 scans
            }
          });
        } catch (error) {
          console.error("Error saving scan history:", error);
        }
      }
      
      // Navigate to insights page
      navigate(`/insights?name=${encodeURIComponent(competitorName.trim())}`);
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed", {
        description: error.message || "Could not complete the analysis"
      });
      setIsLoading(false);
    }
  };

  const toggleCredentialsForm = () => {
    setShowCredentialsForm(!showCredentialsForm);
  };

  const selectedModel = models.find(model => model.id === selectedModelId);

  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'openai': return 'OpenAI Models';
      case 'google': return 'Google Gemini Models';
      case 'deepseek': return 'Free Models';
      default: return `${provider.charAt(0).toUpperCase()}${provider.slice(1)} Models`;
    }
  };

  return (
    <Layout>
      {isLoading && <LoadingScreen 
        text={`Analyzing ${competitorName} pain points using ${selectedModel?.name || 'AI'}...`} 
      />}
      
      <section className="py-16">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Scan Competitor Pain Points</h1>
            <p className="text-lg text-foreground/70">
              Enter your competitor's name and we'll analyze Reddit to find their users' biggest complaints.
            </p>
          </div>
          
          <div className="mb-6 flex justify-end">
            <button
              onClick={toggleCredentialsForm}
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              <Settings size={16} />
              {credentialsComplete ? "Update API Keys" : "Add API Keys"}
            </button>
          </div>
          
          {showCredentialsForm && (
            <div className="mb-8">
              <ApiCredentialsForm />
            </div>
          )}
          
          <div className="bg-card border rounded-lg p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="competitor-name" className="block text-sm font-medium">
                  Competitor Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                  <input
                    id="competitor-name"
                    type="text"
                    placeholder="e.g., Notion, Trello, Figma"
                    value={competitorName}
                    onChange={(e) => setCompetitorName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subreddit" className="block text-sm font-medium">
                  Specific Subreddit (Optional)
                </label>
                <input
                  id="subreddit"
                  type="text"
                  placeholder="e.g., productivity, webdev"
                  value={subreddit}
                  onChange={(e) => setSubreddit(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <p className="text-xs text-foreground/60">
                  Leave empty to search across all of Reddit
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="time-range" className="block text-sm font-medium">
                    Time Range
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                    <select
                      id="time-range"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="1">Last 1 Month</option>
                      <option value="3">Last 3 Months</option>
                      <option value="6">Last 6 Months</option>
                      <option value="12">Last Year</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="model" className="block text-sm font-medium">
                    AI Model
                  </label>
                  <div className="relative">
                    <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                      <SelectTrigger className="w-full pl-10 pr-4 py-6 h-auto">
                        <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(modelsByProvider).map(([provider, providerModels]) => (
                          <SelectGroup key={provider}>
                            <SelectLabel>{getProviderDisplayName(provider)}</SelectLabel>
                            {providerModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
                                <div className="flex flex-col">
                                  <span className="flex items-center">
                                    {model.name}
                                    {model.isFree && (
                                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Free</span>
                                    )}
                                  </span>
                                  <span className="text-xs text-foreground/60">{model.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                disabled={!credentialsComplete}
              >
                Start Scanning <ArrowRight size={18} />
              </button>
              
              {!credentialsComplete && (
                <p className="text-sm text-destructive text-center">
                  Please add your API credentials before scanning
                </p>
              )}

              {!isSignedIn && credentialsComplete && (
                <p className="text-sm text-muted-foreground text-center">
                  <a href="/sign-in" className="text-primary hover:underline">Sign in</a> to save your scan history and API credentials to your account
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ScanPage;
