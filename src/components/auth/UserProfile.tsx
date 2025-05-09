
import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound, Shield, Settings } from "lucide-react";

const UserProfile = () => {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  
  if (!isSignedIn || !user) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto my-16 p-4">
          <p className="text-center">Please sign in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  const handleUpdateProfile = async () => {
    try {
      await user.update({
        firstName,
        lastName
      });
      
      toast.success("Profile updated successfully", {
        description: "Your profile information has been updated."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", {
        description: "There was an error updating your profile. Please try again."
      });
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto my-16 p-4">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserRound size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield size={16} />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings size={16} />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.primaryEmailAddress?.emailAddress || ""} disabled />
                  <p className="text-sm text-muted-foreground">Your email cannot be changed.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">••••••••••••</span>
                    <Button variant="outline" onClick={() => user.createMagicLinkFlow().startMagicLinkFlow({
                      redirectUrl: window.location.href
                    })}>
                      Reset Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your account preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Preferences will be available soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfile;
