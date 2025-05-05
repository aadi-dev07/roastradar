
import React from "react";
import { Link } from "react-router-dom";
import RadarAnimation from "@/components/RadarAnimation";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <RadarAnimation size="lg" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-foreground/70 mb-6">
          Oops! We couldn't find the page you're looking for
        </p>
        <Link 
          to="/" 
          className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
