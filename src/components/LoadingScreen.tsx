
import React from "react";
import RadarAnimation from "./RadarAnimation";

interface LoadingScreenProps {
  text?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  text = "We're analyzing Reddit for rants and frustrations..." 
}) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <RadarAnimation size="lg" />
      <p className="mt-6 text-xl max-w-md text-center">{text}</p>
      <div className="mt-8 flex space-x-2">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i}
            className="w-2 h-2 bg-primary rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
