
import React from "react";
import { Share } from "lucide-react";

interface Quote {
  text: string;
  url: string;
}

interface PainPointCardProps {
  icon: string;
  title: string;
  count: number;
  quotes: Quote[];
}

const PainPointCard: React.FC<PainPointCardProps> = ({
  icon,
  title,
  count,
  quotes
}) => {
  return (
    <div className="bg-card rounded-lg border p-5 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <span className="text-xl mr-2">{icon}</span>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
          {count} mentions
        </span>
      </div>
      
      <div className="space-y-3 mt-4">
        {quotes.map((quote, i) => (
          <div key={i} className="border-l-2 border-primary/50 pl-3 py-0.5 animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <p className="text-sm text-foreground/80 italic">"{quote.text}"</p>
            <div className="flex items-center justify-between mt-2">
              <a 
                href={quote.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs flex items-center text-foreground/60 hover:text-primary transition-colors"
              >
                <img src="https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png" alt="Reddit" className="w-4 h-4 mr-1.5" />
                View on Reddit
              </a>
              <button className="text-foreground/60 hover:text-primary transition-colors">
                <Share size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PainPointCard;
