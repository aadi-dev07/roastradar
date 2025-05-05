
import React from "react";
import { cn } from "@/lib/utils";

interface CompetitorChipProps {
  name: string;
  onClick?: () => void;
  active?: boolean;
}

const CompetitorChip: React.FC<CompetitorChipProps> = ({ name, onClick, active = false }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full border text-sm font-medium transition-all",
        active 
          ? "bg-primary text-white border-primary" 
          : "bg-background hover:bg-muted border-border hover:border-primary/50"
      )}
    >
      {name}
    </button>
  );
};

export default CompetitorChip;
