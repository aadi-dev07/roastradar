
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import Layout from "@/components/Layout";
import { toast } from "@/hooks/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  return (
    <Layout>
      <div className="container max-w-md mx-auto my-16 p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign In to RoastRadar</h1>
        <div className="bg-card shadow-lg rounded-lg overflow-hidden">
          <ClerkSignIn 
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl={redirectPath}
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
                formFieldInput: "border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                footerActionLink: "text-primary hover:text-primary/90"
              }
            }}
            afterSignInUrl={redirectPath}
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need to access protected features? Sign in to continue.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
