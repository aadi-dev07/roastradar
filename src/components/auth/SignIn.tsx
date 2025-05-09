
import React from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, KeyRound } from "lucide-react";

const SignIn: React.FC = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) {
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Welcome back!");
        navigate("/");
      } else {
        console.error("Unexpected result status", result);
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error("Sign-in failed", {
        description: error.errors?.[0]?.message || "Please check your credentials and try again"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (isLoaded && signIn) {
      signIn.create({ 
        identifier: email || '' 
      }).then(() => {
        navigate('/reset-password');
        toast.success("Password reset email sent", {
          description: "Check your inbox for further instructions"
        });
      }).catch((err) => {
        toast.error("Failed to initiate password reset", {
          description: err.errors?.[0]?.message || "Please try again"
        });
      });
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-foreground/70">Sign in to continue to RoastRadar</p>
      </div>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isLoaded}
          >
            {isLoading ? "Signing in..." : "Sign in"} 
            <ArrowRight size={16} className="ml-2" />
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-foreground/70">Don't have an account? </span>
            <button 
              type="button"
              onClick={() => navigate("/signup")} 
              className="text-primary hover:underline"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
