
import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SignIn from "@/components/auth/SignIn";

const SignInPage: React.FC = () => {
  const { userId, isLoaded } = useAuth();

  // If user is already authenticated, redirect to home
  if (isLoaded && userId) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SignIn />
        </div>
      </section>
    </Layout>
  );
};

export default SignInPage;
