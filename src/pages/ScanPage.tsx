
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Search, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCompetitor = searchParams.get("name") || "";
  
  const [competitorName, setCompetitorName] = useState(initialCompetitor);
  const [subreddit, setSubreddit] = useState("");
  const [timeRange, setTimeRange] = useState("3");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (competitorName.trim()) {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/insights?name=${encodeURIComponent(competitorName.trim())}`);
      }, 3000);
    }
  };

  return (
    <Layout>
      {isLoading && <LoadingScreen />}
      
      <section className="py-16">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Scan Competitor Pain Points</h1>
            <p className="text-lg text-foreground/70">
              Enter your competitor's name and we'll analyze Reddit to find their users' biggest complaints.
            </p>
          </div>
          
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
              
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Start Scanning <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ScanPage;
