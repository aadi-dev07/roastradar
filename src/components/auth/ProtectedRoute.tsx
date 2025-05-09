
import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userId, isLoaded } = useAuth();

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-[50vh]">Loading...</div>;
  }

  // If not authenticated, redirect to sign in
  if (!userId) {
    toast.error("Authentication required", {
      description: "Please sign in to access this page"
    });
    
    return <Navigate to="/signin" replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
