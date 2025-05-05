
import React from "react";

interface TagCloudProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

const TagCloud: React.FC<TagCloudProps> = ({ tags, onTagClick }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <button
          key={index}
          onClick={() => onTagClick?.(tag)}
          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm hover:bg-primary/20 transition-colors animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagCloud;
