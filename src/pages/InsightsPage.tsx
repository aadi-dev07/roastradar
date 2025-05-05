
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Download, Link as LinkIcon } from "lucide-react";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import PainPointCard from "@/components/PainPointCard";
import TagCloud from "@/components/TagCloud";
import { useToast } from "@/hooks/use-toast";

const mockData = {
  summary: "Most Redditors complain about Notion's mobile speed, confusing templates, and syncing issues across devices. Many users also mention challenges with the steep learning curve and describe difficulty with database relationships.",
  tags: [
    "UX Issues", "Mobile Performance", "Templates", "Organization", 
    "Syncing Problems", "Learning Curve", "Database Complexity", "Pricing"
  ],
  painPoints: [
    {
      icon: "📱",
      title: "Slow Mobile App",
      count: 78,
      quotes: [
        { 
          text: "The mobile app is so slow it's basically unusable for quick notes. I've switched to Apple Notes just for this reason.",
          url: "https://reddit.com/r/Notion" 
        },
        { 
          text: "When I need to check something quickly on my phone, Notion takes forever to load. Very frustrating experience.",
          url: "https://reddit.com/r/Notion" 
        }
      ]
    },
    {
      icon: "🧩",
      title: "Steep Learning Curve",
      count: 64,
      quotes: [
        { 
          text: "It took me weeks to understand how to use Notion effectively. Not intuitive at all for beginners.",
          url: "https://reddit.com/r/productivity" 
        },
        { 
          text: "The documentation isn't great. Spent hours watching YouTube tutorials just to do basic things.",
          url: "https://reddit.com/r/NotionSo" 
        }
      ]
    },
    {
      icon: "🔄",
      title: "Syncing Issues",
      count: 52,
      quotes: [
        { 
          text: "Lost an hour of work because Notion didn't sync between my devices. This happens at least once a week.",
          url: "https://reddit.com/r/NotionSo" 
        },
        { 
          text: "Offline mode barely works. Can't rely on it when I'm traveling or have spotty connection.",
          url: "https://reddit.com/r/productivity" 
        }
      ]
    },
    {
      icon: "💰",
      title: "Pricing Confusion",
      count: 37,
      quotes: [
        { 
          text: "Their pricing model is confusing. I can't tell if I need Personal or Team plan for my small business.",
          url: "https://reddit.com/r/smallbusiness" 
        },
        { 
          text: "They keep changing what's included in each plan. Features I was using suddenly required an upgrade.",
          url: "https://reddit.com/r/NotionSo" 
        }
      ]
    }
  ]
};

const InsightsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const competitorName = searchParams.get("name") || "Competitor";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof mockData | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, [competitorName]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Link to this report has been copied to clipboard",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Downloading report",
      description: `The ${competitorName} pain point report is being generated...`,
    });
  };

  if (loading) {
    return <LoadingScreen text={`Analyzing ${competitorName} pain points...`} />;
  }

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/scan" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                New Scan
              </Link>
              <span className="text-foreground/40">•</span>
              <span className="text-sm text-foreground/60">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl font-bold mt-2">{competitorName} Pain Points</h1>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleShareLink}
              className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted transition-colors"
            >
              <LinkIcon size={16} />
              <span>Share Link</span>
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
        
        {data && (
          <>
            <div className="bg-card border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-medium mb-4">Summary</h2>
              <p className="text-lg text-foreground/80">{data.summary}</p>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-foreground/60 mb-3">Common Issues</h3>
                <TagCloud tags={data.tags} onTagClick={handleTagClick} />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-6">Clustered Pain Points</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {data.painPoints
                .filter(point => !selectedTag || data.tags.includes(selectedTag))
                .map((point, index) => (
                  <PainPointCard 
                    key={index}
                    icon={point.icon}
                    title={point.title}
                    count={point.count}
                    quotes={point.quotes}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default InsightsPage;
