import { useProfileData } from '@/hooks/useProfileData';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { 
  UserCircle, 
  Settings, 
  Bell, 
  Clock, 
  Shield, 
  BadgeInfo, 
  Briefcase, 
  Building, 
  Star, 
  Award, 
  Zap, 
  BarChart3, 
  Check, 
  X,
  Globe,
  Mail,
  Lock,
  CreditCard, 
  AlertCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Spotlight } from '@/components/ui/spotlight';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';

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

  // Get the first letter of the user's name for avatar fallback
  const getInitials = () => {
    if (!profile?.full_name) return 'U';
    return profile.full_name.split(' ').map(name => name[0]).join('').toUpperCase();
  };

  // Calculate completion percentage based on filled profile fields
  const getProfileCompletionPercentage = () => {
    if (!profile) return 0;
    
    const totalFields = 12; // Total number of profile fields we're tracking
    const filledFields = [
      profile.full_name,
      profile.business_name,
      profile.business_type,
      profile.industry,
      profile.bio,
      profile.interests && profile.interests.length > 0,
      profile.linkedin_url,
      profile.website_url,
      profile.youtube_url,
      profile.instagram_url,
      profile.twitter_url,
      profile.professional_role
    ].filter(Boolean).length;
    
    return Math.round((filledFields / totalFields) * 100);
  };
  
  // Calculate next rank threshold
  const getNextRankThreshold = () => {
    const points = profile?.points || 0;
    if (points < 1000) return 1000;
    if (points < 5000) return 5000;
    if (points < 10000) return 10000;
    return null; // Max rank reached
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
      
      {/* Header & Profile Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="rounded-xl overflow-hidden">
          <div className="h-40 bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-purple-800/80 relative">
            {/* Banner image */}
            <div className="absolute inset-0 bg-[url('/og-image.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            
            {/* SISO Agency logo/branding */}
            <div className="absolute top-4 right-4">
              <Badge className="px-3 py-1 bg-white/10 backdrop-blur-md border-0">
                <Star className="h-3.5 w-3.5 text-amber-300 fill-amber-300 mr-1" />
                <span className="text-white font-medium">SISO AGENCY</span>
              </Badge>
            </div>
            
            {/* Profile Completion */}
            <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm rounded-lg p-2 border border-white/10 w-56">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/80">Profile Completion</span>
                <span className="text-xs font-bold text-white">{getProfileCompletionPercentage()}%</span>
              </div>
              <Progress value={getProfileCompletionPercentage()} className="h-1.5 bg-white/20" indicatorClassName="bg-gradient-to-r from-emerald-500 to-green-500" />
            </div>
            
            {/* Profile avatar and name */}
            <div className="absolute -bottom-12 left-6 flex items-end">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="mb-2 ml-4">
                <Badge className="mb-1 bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {profile?.rank || 'Bronze'} 
                  <Award className="h-3 w-3 ml-1 text-amber-300" />
                </Badge>
                <h1 className="text-xl font-bold text-white drop-shadow-md">
                  {profile?.full_name || 'Your Name'}
                </h1>
                <p className="text-sm text-white/70">{profile?.professional_role || 'Your Role'}</p>
              </div>
            </div>
          </div>
          
          {/* Spacer for profile image overflow */}
          <div className="h-12 bg-background"></div>
        </div>
      </motion.div>

      {/* Stats/Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="bg-black/30 border-indigo-500/30 backdrop-blur-sm shadow-md">
          <CardContent className="p-3 flex items-center">
            <div className="mr-3 bg-indigo-500/20 p-2 rounded-lg">
              <Zap className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Points</p>
              <p className="text-base font-bold text-white">{profile?.points || 0}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-purple-500/30 backdrop-blur-sm shadow-md">
          <CardContent className="p-3 flex items-center">
            <div className="mr-3 bg-purple-500/20 p-2 rounded-lg">
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Next Rank</p>
              <div className="flex items-center">
                <p className="text-base font-bold text-white">{getNextRankThreshold() ? getNextRankThreshold() - (profile?.points || 0) : '0'}</p>
                <p className="text-xs text-gray-400 ml-1">pts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-emerald-500/30 backdrop-blur-sm shadow-md">
          <CardContent className="p-3 flex items-center">
            <div className="mr-3 bg-emerald-500/20 p-2 rounded-lg">
              <Building className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Business</p>
              <p className="text-base font-bold text-white truncate max-w-24">{profile?.business_name || 'Not Set'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-amber-500/30 backdrop-blur-sm shadow-md">
          <CardContent className="p-3 flex items-center">
            <div className="mr-3 bg-amber-500/20 p-2 rounded-lg">
              <Briefcase className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Industry</p>
              <p className="text-base font-bold text-white truncate max-w-24">{profile?.industry || 'Not Set'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mb-5">
        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2"
          >
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)} 
              className="text-white border-purple-400/50 hover:bg-purple-500/20"
              size="sm"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              onClick={handleSaveProfile} 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90"
              size="sm"
            >
              <Check className="mr-2 h-4 w-4" /> Save Profile
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button 
              onClick={() => setIsEditing(true)} 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90"
              size="sm"
            >
              <BadgeInfo className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </motion.div>
        )}
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="rounded-xl mb-5 bg-black/30 p-1 border border-purple-400/30">
          <TabsTrigger 
            value="profile" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:border-purple-500/30 data-[state=active]:text-white"
          >
            <UserCircle className="h-4 w-4 mr-2" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:border-purple-500/30 data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:border-purple-500/30 data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger 
            value="billing" 
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-indigo-500/20 data-[state=active]:border-purple-500/30 data-[state=active]:text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
            {/* Main Profile Info - Takes 4/7 columns */}
            <div className="lg:col-span-4">
              <Card className="bg-black/30 border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader className="pb-2 border-b border-purple-400/20">
                  <CardTitle className="text-lg flex items-center text-white">
                    <UserCircle className="mr-2 h-5 w-5 text-purple-400" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
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
            
            {/* Right Column - Status Cards - Takes 3/7 columns */}
            <div className="lg:col-span-3 space-y-5">
              {/* Account Status Card */}
              <Card className="bg-black/30 border-emerald-500/30 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-emerald-500/20">
                  <CardTitle className="text-base flex items-center text-white">
                    <Shield className="mr-2 h-4 w-4 text-emerald-400" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-emerald-500/10">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-300">Email</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                        Verified
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-amber-500/10">
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-300">2FA</span>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                        Not Enabled
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-purple-500/10">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-300">Account Type</span>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        Professional
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
                
              {/* Points History Card */}
              <Card className="bg-black/30 border-indigo-500/30 backdrop-blur-sm shadow-lg overflow-hidden">
                <CardHeader className="py-3 px-4 border-b border-indigo-500/20">
                  <CardTitle className="text-base flex items-center text-white">
                    <Award className="mr-2 h-4 w-4 text-indigo-400" />
                    Points & Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-3xl font-bold text-white mb-1">{profile?.points || 0}</div>
                      <div className="text-sm text-gray-400">Total Points</div>
                    </div>
                    <Button variant="outline" size="sm" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20">
                      View Rewards
                    </Button>
                  </div>
                  
                  {getNextRankThreshold() && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">Progress to {profile?.rank === 'Bronze' ? 'Silver' : profile?.rank === 'Silver' ? 'Gold' : 'Platinum'}</span>
                        <span className="text-xs text-gray-400">
                          {profile?.points || 0}/{getNextRankThreshold()}
                        </span>
                      </div>
                      <Progress 
                        value={((profile?.points || 0) / (getNextRankThreshold() || 1)) * 100} 
                        className="h-2 bg-indigo-900/30" 
                        indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <Card className="bg-black/30 border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader className="pb-3 border-b border-purple-400/20">
              <CardTitle className="text-xl flex items-center text-white">
                <Shield className="mr-2 h-5 w-5 text-purple-400" />
                Account Security
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account security settings and password
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="current-password" className="text-sm text-white/80 font-medium">Current Password</label>
                    <input
                      id="current-password"
                      type="password"
                      className="bg-black/40 border border-purple-400/30 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="new-password" className="text-sm text-white/80 font-medium">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      className="bg-black/40 border border-purple-400/30 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="confirm-password" className="text-sm text-white/80 font-medium">Confirm New Password</label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="bg-black/40 border border-purple-400/30 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 mt-2">
                    Update Password
                  </Button>
                </div>
              
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                  <div className="p-4 border border-amber-500/30 rounded-lg bg-amber-500/10 flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-300">
                      Two-factor authentication adds an extra layer of security to your account. In addition to your password, you'll need a code from your phone to log in.
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90">
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-0">
          <Card className="bg-black/30 border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader className="pb-3 border-b border-purple-400/20">
              <CardTitle className="text-xl flex items-center text-white">
                <Bell className="mr-2 h-5 w-5 text-yellow-400" />
                Communication Preferences
              </CardTitle>
              <CardDescription className="text-gray-400">
                Control how and when you receive notifications and communications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-purple-400/20 bg-black/40">
                  <div>
                    <p className="font-medium text-white">Email Notifications</p>
                    <p className="text-sm text-white/70">Receive account updates and important notices</p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-purple-400/20 bg-black/40">
                  <div>
                    <p className="font-medium text-white">Push Notifications</p>
                    <p className="text-sm text-white/70">Receive real-time alerts on your device</p>
                  </div>
                  <Switch checked={false} />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-purple-400/20 bg-black/40">
                  <div>
                    <p className="font-medium text-white">Marketing Communications</p>
                    <p className="text-sm text-white/70">Receive updates about new features and offers</p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-purple-400/20 bg-black/40">
                  <div>
                    <p className="font-medium text-white">Weekly Newsletter</p>
                    <p className="text-sm text-white/70">Receive our weekly newsletter with tips and updates</p>
                  </div>
                  <Switch checked={false} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-400/20 p-4 flex justify-end">
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 w-full sm:w-auto">
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-0">
          <Card className="bg-black/30 border-purple-400/30 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader className="pb-3 border-b border-purple-400/20">
              <CardTitle className="text-xl flex items-center text-white">
                <CreditCard className="mr-2 h-5 w-5 text-emerald-400" />
                Billing & Subscription
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your payment methods and subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-5 rounded-lg border border-purple-500/30">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 border-0 mb-2">Current Plan</Badge>
                      <h3 className="text-xl font-bold text-white mb-1">Professional Plan</h3>
                      <p className="text-sm text-gray-300 mb-2">$49.99 / month</p>
                      <p className="text-xs text-gray-400">Next billing date: 15 Jun 2023</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Change Plan
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Payment Methods</h3>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border border-purple-400/20 bg-black/40 mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-14 bg-gray-800 rounded-md flex items-center justify-center mr-4">
                        <span className="text-xs text-white font-medium">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">•••• •••• •••• 4242</p>
                        <p className="text-xs text-gray-400">Expires 09/2025</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      Default
                    </Badge>
                  </div>
                  
                  <Button variant="outline" className="border-purple-400/30 text-purple-300 hover:bg-purple-500/10 w-full">
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

