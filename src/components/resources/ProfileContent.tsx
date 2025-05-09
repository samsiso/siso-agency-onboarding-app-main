
import { useProfileData } from '@/hooks/useProfileData';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { UserCircle, Settings, Bell, Clock, Shield, CreditCard, BadgeInfo, Briefcase, Building } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spotlight } from '@/components/ui/spotlight';
import { Badge } from '@/components/ui/badge';

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const {
    user,
    profile,
    loading,
    isEditing,
    formData,
    handleFormChange,
    setIsEditing
  } = useProfileData();

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          business_name: formData.businessName,
          business_type: formData.businessType,
          industry: formData.industry,
          bio: formData.bio,
          interests: formData.interests ? formData.interests.split(',').map(i => i.trim()) : [],
          linkedin_url: formData.linkedinUrl,
          website_url: formData.websiteUrl,
          youtube_url: formData.youtubeUrl,
          instagram_url: formData.instagramUrl,
          twitter_url: formData.twitterUrl,
          professional_role: formData.professionalRole,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: 'There was an error updating your profile',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Spotlight className="-top-40 left-0" />
      
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent mb-2">Profile & Settings</h2>
        <p className="text-white/80">Manage your profile information, account settings, and notification preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8 bg-black/30 border border-purple-400/30 rounded-lg">
          <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
            <UserCircle className="h-4 w-4" />
            <span>User Profile</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
            <Bell className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
            <Clock className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-0">
          {isEditing ? (
            <div className="flex justify-end gap-2 mb-4">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="text-white border-purple-400/50 hover:bg-purple-500/20">
                Cancel
              </Button>
              <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:opacity-90">
                Save Profile
              </Button>
            </div>
          ) : (
            <div className="flex justify-end mb-4">
              <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:opacity-90">
                <BadgeInfo className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center text-white">
                  <UserCircle className="mr-2 h-5 w-5 text-purple-400" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileInfo
                  email={user?.email}
                  fullName={profile?.full_name}
                  points={profile?.points || 0}
                  rank={profile?.rank || 'Bronze'}
                  businessName={profile?.business_name}
                  businessType={profile?.business_type}
                  industry={profile?.industry}
                  interests={profile?.interests}
                  bio={profile?.bio}
                  linkedinUrl={profile?.linkedin_url}
                  websiteUrl={profile?.website_url}
                  youtubeUrl={profile?.youtube_url}
                  instagramUrl={profile?.instagram_url}
                  twitterUrl={profile?.twitter_url}
                  professionalRole={profile?.professional_role}
                  isEditing={isEditing}
                  formData={formData}
                  onFormChange={handleFormChange}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center text-white">
                <Shield className="mr-2 h-5 w-5 text-purple-400" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="current-password" className="text-sm text-white/80">Current Password</label>
                  <input
                    id="current-password"
                    type="password"
                    className="bg-black/40 border border-purple-400/30 rounded-md px-3 py-2 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="new-password" className="text-sm text-white/80">New Password</label>
                  <input
                    id="new-password"
                    type="password"
                    className="bg-black/40 border border-purple-400/30 rounded-md px-3 py-2 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="confirm-password" className="text-sm text-white/80">Confirm New Password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="bg-black/40 border border-purple-400/30 rounded-md px-3 py-2 text-white"
                  />
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:opacity-90 mt-2">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-0">
          <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center text-white">
                <Bell className="mr-2 h-5 w-5 text-yellow-400" />
                Communication Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-purple-400/20">
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-sm text-white/70">Receive emails about your account activity</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 bg-purple-500/30 rounded-full cursor-pointer transition-colors duration-200">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-purple-400/20">
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-sm text-white/70">Receive push notifications on your device</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 bg-gray-700 rounded-full cursor-pointer transition-colors duration-200">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-purple-400/20">
                  <div>
                    <p className="font-medium text-white">Marketing Communications</p>
                    <p className="text-sm text-white/70">Receive updates about new features and offers</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 bg-purple-500/30 rounded-full cursor-pointer transition-colors duration-200">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"></div>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:opacity-90 mt-2">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center text-white">
                <Clock className="mr-2 h-5 w-5 text-blue-400" />
                Notification History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 bg-black/40 rounded-lg border border-purple-400/20">
                    <div className="h-10 w-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Payment Successful</p>
                      <p className="text-sm text-white/70">Your payment for invoice INV-00{i+1} has been processed successfully.</p>
                      <p className="text-xs text-white/50 mt-1">
                        {new Date(Date.now() - i*86400000).toLocaleDateString()} at {new Date(Date.now() - i*86400000).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
