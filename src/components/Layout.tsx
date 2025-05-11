
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { isLoaded } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    signOut(() => {
      navigate("/");
    });
  };
  
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
          <nav className="flex items-center gap-6">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={isSignedIn ? "/scan" : "/sign-in"} className="text-foreground/80 hover:text-foreground transition-colors">
                  New Scan
                </Link>
              </li>
            </ul>
            
            {isLoaded && (
              <div className="flex items-center gap-4">
                {isSignedIn ? (
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <button className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors">
                        {user?.imageUrl ? (
                          <img src={user.imageUrl} alt="Profile" className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs text-primary font-medium">
                            {(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}
                          </div>
                        )}
                        <span className="text-sm">{user?.firstName || "User"}</span>
                      </button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border overflow-hidden invisible group-hover:visible z-50">
                        <div className="py-1">
                          <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                            Profile
                          </Link>
                          <button 
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors text-destructive"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/sign-in" className="text-sm font-medium hover:underline">
                      Sign in
                    </Link>
                    <Link to="/sign-up" className="bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            )}
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
                  to={isSignedIn ? "/scan" : "/sign-in"}
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
