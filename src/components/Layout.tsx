
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useAuth, SignOutButton } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { 
  LogIn, 
  UserRound,
  LogOut,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
    });
    navigate("/");
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
          
          <nav className="flex items-center space-x-4">
            <ul className="flex space-x-4 items-center">
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
              {isSignedIn ? (
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                          <AvatarFallback>
                            {user.firstName?.charAt(0) || ""}{user.lastName?.charAt(0) || ""}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.fullName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <UserRound className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/signin" className="text-foreground/80 hover:text-foreground transition-colors flex items-center">
                      <LogIn className="mr-1 h-4 w-4" />
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                      Sign up
                    </Link>
                  </li>
                </>
              )}
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
