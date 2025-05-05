
import React from "react";

interface RadarAnimationProps {
  size?: "sm" | "md" | "lg";
}

const RadarAnimation: React.FC<RadarAnimationProps> = ({ size = "md" }) => {
  const sizeClass = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className={`relative ${sizeClass[size]}`}>
      <div className="absolute inset-0 bg-primary rounded-full opacity-30"></div>
      <div className="absolute inset-0 bg-primary/40 rounded-full animate-pulse-ring"></div>
      <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center">
        <div className="w-1/2 h-1/2 border-2 border-white border-t-transparent rounded-full animate-radar-scan"></div>
      </div>
    </div>
  );
};

export default RadarAnimation;
