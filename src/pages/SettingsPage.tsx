import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';

export default function SettingsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-6">
          Settings
        </h1>
        
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="bg-black/30 border border-siso-text/10">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card className="bg-black/30 border border-siso-text/10">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <div className="rounded-md bg-black/50 p-3 text-siso-text">
                    {user?.email || 'No email found'}
                  </div>
                </div>
                <Button 
                  className="mt-4 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  onClick={handleSaveSettings}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card className="bg-black/30 border border-siso-text/10">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the application looks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
                <Button 
                  className="mt-4 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  onClick={handleSaveSettings}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="bg-black/30 border border-siso-text/10">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you want to receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing-emails">Marketing Emails</Label>
                  <Switch 
                    id="marketing-emails" 
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
                <Button 
                  className="mt-4 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  onClick={handleSaveSettings}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card className="bg-black/30 border border-siso-text/10">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Manage your privacy preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-siso-text">
                  Your privacy is important to us. You can adjust your privacy settings here.
                </p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  onClick={handleSaveSettings}
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
