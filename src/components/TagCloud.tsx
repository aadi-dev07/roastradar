
import React from "react";
import { cn } from "@/lib/utils";

interface TagCloudProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
  selectedTag?: string | null;
}

const TagCloud: React.FC<TagCloudProps> = ({ tags, onTagClick, selectedTag = null }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <button
          key={index}
          onClick={() => onTagClick?.(tag)}
          className={cn(
            "px-3 py-1 rounded-full text-sm hover:bg-primary/20 transition-colors animate-fade-in",
            selectedTag === tag 
              ? "bg-primary text-primary-foreground" 
              : "bg-primary/10 text-primary"
          )}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagCloud;
