
import React from "react";
import Layout from "@/components/Layout";
import UserProfile from "@/components/auth/UserProfile";

const ProfilePage: React.FC = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <UserProfile />
        </div>
      </section>
    </Layout>
  );
};

export default ProfilePage;
