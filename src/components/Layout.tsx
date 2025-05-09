
import React from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-primary rounded-full opacity-60 animate-pulse-ring"></div>
              <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-radar-scan"></div>
              </div>
            </div>
            <span className="font-bold text-xl">RoastRadar</span>
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/scan" className="text-foreground/80 hover:text-foreground transition-colors">
                  New Scan
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-6 mt-10">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-foreground/70">
              &copy; {new Date().getFullYear()} RoastRadar. All rights reserved.
            </div>
            <div className="bg-muted rounded-lg p-4 max-w-md w-full">
              <h4 className="font-medium mb-2 text-center">Discover the top 3 reasons users quit your competitor</h4>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter competitor name" 
                  className="flex-1 px-3 py-2 rounded-md border" 
                />
                <Link 
                  to="/scan" 
                  className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Go
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
