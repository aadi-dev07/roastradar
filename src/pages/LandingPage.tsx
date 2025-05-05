
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import Layout from "@/components/Layout";
import RadarAnimation from "@/components/RadarAnimation";
import CompetitorChip from "@/components/CompetitorChip";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [competitorName, setCompetitorName] = useState("");
  const [examples] = useState(["Notion", "Trello", "Figma", "Slack"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (competitorName.trim()) {
      navigate(`/scan?name=${encodeURIComponent(competitorName.trim())}`);
    }
  };

  const handleExampleClick = (name: string) => {
    setCompetitorName(name);
    navigate(`/scan?name=${encodeURIComponent(name)}`);
  };

  return (
    <Layout>
      <section className="pt-16 pb-20">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Uncover What Users <span className="text-gradient">Really Hate</span> About Your Competitors
              </h1>
              
              <p className="text-xl text-foreground/70">
                Scan Reddit and get instant pain point insights with AI. Make data-driven decisions that give you the competitive edge.
              </p>
              
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" size={18} />
                  <input
                    type="text"
                    placeholder="Enter competitor name"
                    value={competitorName}
                    onChange={(e) => setCompetitorName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-r-lg font-medium transition-colors flex items-center gap-2"
                >
                  Scan Now <ArrowRight size={18} />
                </button>
              </form>
              
              <div className="pt-2">
                <div className="text-sm text-foreground/60 mb-2">Try an example:</div>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <CompetitorChip 
                      key={example} 
                      name={example} 
                      onClick={() => handleExampleClick(example)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
                <div className="relative bg-card border shadow-lg rounded-xl p-6 max-w-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold">Notion Pain Points</h3>
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">Fresh insights</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">UX Issues</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">Mobile Performance</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">Templates</span>
                  </div>
                  
                  <div className="text-sm mb-4">
                    <p className="text-foreground/80">Most Redditors complain about Notion's mobile speed, confusing templates, and syncing issues across devices.</p>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    <p className="italic text-foreground/70">"The mobile app is so slow it's basically unusable for quick notes..."</p>
                    <div className="mt-2 text-xs flex justify-between">
                      <div className="flex items-center">
                        <img src="https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png" alt="Reddit" className="w-4 h-4 mr-1" />
                        <span className="text-foreground/50">r/NotionSo</span>
                      </div>
                      <span className="text-foreground/50">2 days ago</span>
                    </div>
                  </div>
                  
                  <RadarAnimation size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-muted">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How RoastRadar Works</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              We scan Reddit for conversations about your competitors, then use AI to identify patterns and extract actionable insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Search className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Enter a Competitor</h3>
              <p className="text-foreground/70">
                Simply input the name of any competitor you want to analyze.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <RadarAnimation size="sm" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. AI Analysis</h3>
              <p className="text-foreground/70">
                Our AI scans Reddit for pain points, complaints, and critiques.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <ArrowRight className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">3. Get Insights</h3>
              <p className="text-foreground/70">
                View organized pain points with real user quotes and actionable data.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
