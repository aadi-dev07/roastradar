
import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SignUp from "@/components/auth/SignUp";

const SignUpPage: React.FC = () => {
  const { userId, isLoaded } = useAuth();

  // If user is already authenticated, redirect to home
  if (isLoaded && userId) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SignUp />
        </div>
      </section>
    </Layout>
  );
};

export default SignUpPage;
