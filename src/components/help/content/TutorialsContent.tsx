import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Video, Play, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TutorialsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Video className="w-8 h-8 text-purple-400" />
        <h1 className="text-3xl font-bold">Video Tutorials</h1>
      </div>
      
      <Card className="bg-black/30 border border-gray-800">
        <CardContent className="pt-6 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Learn Through Video Guides</h2>
            <p className="text-gray-400 mb-6">
              Visual step-by-step tutorials to help you learn all features of our platform.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-lg border border-gray-800 overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <img 
                    src="https://via.placeholder.com/640x360?text=Getting+Started" 
                    alt="Getting Started Tutorial" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white">
                      <Play className="h-5 w-5 mr-2" />
                      Watch Video
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-1">Platform Introduction</h3>
                  <p className="text-sm text-gray-400 mb-2">Learn the basics of navigating and using our platform</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>5:23</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Updated 2 weeks ago</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 rounded-lg border border-gray-800 overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <img 
                    src="https://via.placeholder.com/640x360?text=Advanced+Features" 
                    alt="Advanced Features Tutorial" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white">
                      <Play className="h-5 w-5 mr-2" />
                      Watch Video
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-1">Advanced Features</h3>
                  <p className="text-sm text-gray-400 mb-2">Master the advanced capabilities of our platform</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>8:47</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Updated 1 month ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-lg border border-gray-800 overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <img 
                    src="https://via.placeholder.com/640x360?text=API+Integration" 
                    alt="API Integration Tutorial" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white">
                      <Play className="h-5 w-5 mr-2" />
                      Watch Video
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-1">API Integration</h3>
                  <p className="text-sm text-gray-400 mb-2">Learn how to integrate our API with your existing systems</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>12:33</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Updated 3 weeks ago</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 rounded-lg border border-gray-800 overflow-hidden">
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                  <img 
                    src="https://via.placeholder.com/640x360?text=Customization" 
                    alt="Customization Options Tutorial" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white">
                      <Play className="h-5 w-5 mr-2" />
                      Watch Video
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-1">Customization Options</h3>
                  <p className="text-sm text-gray-400 mb-2">Personalize the platform to match your workflow needs</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>7:15</span>
                    <span className="mx-2">•</span>
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Updated 1 week ago</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Most Popular Tutorials</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-black/30 rounded-lg border border-gray-800 hover:border-purple-500/30 hover:bg-black/40 transition-colors">
                <div className="mr-3 p-2 bg-purple-900/30 rounded-md">
                  <Video className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">Account Security Setup</h4>
                  <p className="text-sm text-gray-400">Learn how to secure your account with 2FA and more</p>
                </div>
                <div className="text-xs text-gray-500">6:21</div>
              </div>
              
              <div className="flex items-center p-3 bg-black/30 rounded-lg border border-gray-800 hover:border-purple-500/30 hover:bg-black/40 transition-colors">
                <div className="mr-3 p-2 bg-purple-900/30 rounded-md">
                  <Video className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">Data Import/Export Guide</h4>
                  <p className="text-sm text-gray-400">Managing your data efficiently with our platform</p>
                </div>
                <div className="text-xs text-gray-500">9:45</div>
              </div>
              
              <div className="flex items-center p-3 bg-black/30 rounded-lg border border-gray-800 hover:border-purple-500/30 hover:bg-black/40 transition-colors">
                <div className="mr-3 p-2 bg-purple-900/30 rounded-md">
                  <Video className="h-4 w-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">Automation Workflows</h4>
                  <p className="text-sm text-gray-400">Set up triggers and actions to automate your processes</p>
                </div>
                <div className="text-xs text-gray-500">11:32</div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
} 