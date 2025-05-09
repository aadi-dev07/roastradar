
import { useNavigate } from "react-router-dom";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import Layout from "@/components/Layout";

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container max-w-md mx-auto my-16 p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Create a RoastRadar Account</h1>
        <div className="bg-card shadow-lg rounded-lg overflow-hidden">
          <ClerkSignUp 
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            redirectUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                socialButtonsBlockButton: "bg-white border border-gray-300 hover:bg-gray-50",
                formFieldInput: "border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary",
                footerActionLink: "text-primary hover:text-primary/90"
              }
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
