
import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Download, Link as LinkIcon, FileText, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import PainPointCard from "@/components/PainPointCard";
import TagCloud from "@/components/TagCloud";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/types/analysis";
import { analyzeCompetitor } from "@/services/analysisService";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const InsightsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const competitorName = searchParams.get("name") || "Competitor";
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        // First check if we have data in sessionStorage
        const storedData = sessionStorage.getItem("analysisResult");
        
        if (storedData) {
          setData(JSON.parse(storedData));
          setLoading(false);
        } else {
          // If no stored data, check if we have API credentials
          const redditClientId = localStorage.getItem("redditClientId");
          const redditClientSecret = localStorage.getItem("redditClientSecret");
          const openRouterApiKey = localStorage.getItem("openRouterApiKey");
          
          if (!redditClientId || !redditClientSecret || !openRouterApiKey) {
            // Redirect to scan page if missing credentials
            toast.error("API credentials missing", {
              description: "Please add your API credentials before analyzing competitors."
            });
            navigate("/scan");
            return;
          }
          
          // If we have credentials but no stored data, run the analysis
          if (competitorName !== "Competitor") {
            const result = await analyzeCompetitor(competitorName);
            setData(result);
          } else {
            // No competitor name, redirect to scan page
            navigate("/scan");
            return;
          }
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
        toast.error("Could not load analysis", {
          description: error.message || "Something went wrong"
        });
        navigate("/scan");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [competitorName, navigate, toast]);

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
    if (!data) return;
    
    toast({
      title: "Generating PDF",
      description: `The ${competitorName} pain point report is being generated...`,
    });
    
    try {
      // Create PDF document
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text(`${competitorName} Pain Points Analysis`, 15, 20);
      
      doc.setFontSize(12);
      doc.text("Summary:", 15, 35);
      
      // Add summary text with wrapping
      const splitSummary = doc.splitTextToSize(data.summary, 180);
      doc.text(splitSummary, 15, 45);
      
      // Add tags
      doc.text("Common Issues:", 15, 65);
      const tags = data.tags.join(", ");
      doc.text(tags, 15, 75);
      
      // Add pain points
      doc.text("Pain Points:", 15, 90);
      
      let yPosition = 100;
      data.painPoints.forEach((point, index) => {
        // Add pain point title and count
        doc.setFont(undefined, 'bold');
        doc.text(`${point.icon} ${point.title} (${point.count} mentions)`, 15, yPosition);
        doc.setFont(undefined, 'normal');
        
        // Add quotes
        yPosition += 10;
        point.quotes.forEach((quote, qIndex) => {
          const quoteSplit = doc.splitTextToSize(`"${quote.text}"`, 170);
          doc.text(quoteSplit, 20, yPosition);
          yPosition += quoteSplit.length * 6;
          
          // Add reddit url
          doc.setTextColor(0, 0, 255);
          doc.text(`Source: ${quote.url}`, 20, yPosition);
          doc.setTextColor(0, 0, 0);
          
          yPosition += 10;
        });
        
        yPosition += 10;
        
        // Add a new page if we're running out of space
        if (yPosition > 250 && index < data.painPoints.length - 1) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      // Add footer with date
      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generated by RoastRadar on ${currentDate}`, 15, doc.internal.pageSize.height - 10);
      
      // Save the PDF
      doc.save(`${competitorName.toLowerCase()}-pain-points.pdf`);
      
      toast.success("PDF downloaded", {
        description: "Your report has been saved to your downloads folder."
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Could not generate PDF", {
        description: "An error occurred while creating your PDF."
      });
    }
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
              <Link to="/scan" className="text-sm text-foreground/60 hover:text-primary transition-colors flex items-center gap-1">
                <ArrowLeft size={14} />
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
              <FileText size={16} />
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
                <TagCloud tags={data.tags} onTagClick={handleTagClick} selectedTag={selectedTag} />
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
