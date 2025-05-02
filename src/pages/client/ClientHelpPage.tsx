
import React from 'react';
import { Helmet } from 'react-helmet';
import { ClientDashboardLayout } from '@/components/client/ClientDashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, HelpCircle, LifeBuoy, Mail, MessageSquare, Phone, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ClientHelpPage() {
  return (
    <ProtectedRoute>
      <Helmet>
        <title>Help & Support | SISO Agency</title>
      </Helmet>
      <ClientDashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Help & Support</h1>
          </div>
          
          {/* Search Bar */}
          <Card className="bg-black/30 border-siso-border">
            <CardContent className="pt-6">
              <div className="max-w-xl mx-auto flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-siso-text" />
                  <Input placeholder="Search help articles..." className="pl-10 bg-black/20 border-siso-border" />
                </div>
                <Button className="bg-gradient-to-r from-siso-orange to-siso-red hover:opacity-90">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Help Center Tabs */}
          <Tabs defaultValue="documentation" className="w-full">
            <TabsList className="bg-black/30 w-full justify-start">
              <TabsTrigger value="documentation" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Documentation
              </TabsTrigger>
              <TabsTrigger value="faqs" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQs
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Contact Support
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="documentation" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/30 border-siso-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-siso-orange" />
                      Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>Understanding Your Dashboard</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>Project Management Basics</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>How to Review and Approve Tasks</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>Managing Your Account Settings</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>Payment and Billing Overview</span>
                        </a>
                      </li>
                    </ul>
                    
                    <Button variant="link" className="mt-4 px-0 text-siso-orange hover:text-siso-red">
                      View All Getting Started Guides →
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/30 border-siso-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-siso-orange" />
                      Advanced Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>Customizing Project Workflow</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>Managing Multiple Projects</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>Team Collaboration Tools</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>Integrating with Other Tools</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="flex items-center gap-2 text-siso-orange hover:text-siso-red transition-colors">
                          <div className="w-1 h-1 bg-siso-orange rounded-full"></div>
                          <span>Analytics and Reporting</span>
                        </a>
                      </li>
                    </ul>
                    
                    <Button variant="link" className="mt-4 px-0 text-siso-orange hover:text-siso-red">
                      View All Advanced Feature Guides →
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-black/30 border-siso-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-siso-orange" />
                    Video Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Video Tutorial 1 */}
                    <div className="space-y-2">
                      <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-siso-orange cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Dashboard Overview</h3>
                      <p className="text-xs text-siso-text">Learn how to navigate your client dashboard and access key features.</p>
                    </div>
                    
                    {/* Video Tutorial 2 */}
                    <div className="space-y-2">
                      <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-siso-orange cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Task Management</h3>
                      <p className="text-xs text-siso-text">A guide to reviewing, approving, and providing feedback on tasks.</p>
                    </div>
                    
                    {/* Video Tutorial 3 */}
                    <div className="space-y-2">
                      <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-siso-orange cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Payment Processing</h3>
                      <p className="text-xs text-siso-text">How to view invoices and make secure payments through the platform.</p>
                    </div>
                  </div>
                  
                  <Button variant="link" className="mt-4 px-0 text-siso-orange hover:text-siso-red">
                    View All Video Tutorials →
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="faqs" className="space-y-6 mt-6">
              <Card className="bg-black/30 border-siso-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-siso-orange" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-black/20 rounded-lg space-y-2">
                    <h3 className="font-semibold">How do I review and approve deliverables?</h3>
                    <p className="text-sm text-siso-text">
                      You can review deliverables from the Tasks section of your project. Each task will have a "Review" button that allows you to see the work, leave comments, and approve or request changes.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-black/20 rounded-lg space-y-2">
                    <h3 className="font-semibold">How do payments work?</h3>
                    <p className="text-sm text-siso-text">
                      Payments are typically tied to project milestones. When a milestone is completed, you'll receive an invoice through the Payments section. You can pay securely using credit card, bank transfer, or other supported payment methods.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-black/20 rounded-lg space-y-2">
                    <h3 className="font-semibold">Can I request changes to my project scope?</h3>
                    <p className="text-sm text-siso-text">
                      Yes, you can request scope changes through the Messages section or by contacting your project manager directly. Changes may affect timeline and cost, which will be discussed before implementation.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-black/20 rounded-lg space-y-2">
                    <h3 className="font-semibold">How do I track project progress?</h3>
                    <p className="text-sm text-siso-text">
                      Project progress can be tracked from your project Overview page. You'll see a progress bar, completed tasks, upcoming milestones, and a timeline of the entire project.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-black/20 rounded-lg space-y-2">
                    <h3 className="font-semibold">How quickly will I receive support responses?</h3>
                    <p className="text-sm text-siso-text">
                      Our standard support response time is within 24 hours during business days. For urgent matters, you can use the priority support option to receive assistance within 4 hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-6 mt-6">
              <Card className="bg-black/30 border-siso-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-siso-orange" />
                    Contact Support Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 bg-black/20 rounded-lg flex items-center gap-4">
                      <div className="p-3 bg-siso-orange/20 rounded-full">
                        <Mail className="h-6 w-6 text-siso-orange" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Email Support</h3>
                        <p className="text-sm text-siso-text">support@sisoagency.com</p>
                        <p className="text-xs text-siso-text mt-1">Response time: 24 hours</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-black/20 rounded-lg flex items-center gap-4">
                      <div className="p-3 bg-siso-orange/20 rounded-full">
                        <Phone className="h-6 w-6 text-siso-orange" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Phone Support</h3>
                        <p className="text-sm text-siso-text">+1 (555) 123-4567</p>
                        <p className="text-xs text-siso-text mt-1">Available: Mon-Fri, 9am-5pm EST</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Send a Support Request</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Input placeholder="Your name" className="bg-black/20 border-siso-border" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Input placeholder="Your email" className="bg-black/20 border-siso-border" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <Input placeholder="What's your issue about?" className="bg-black/20 border-siso-border" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea 
                          rows={4} 
                          placeholder="Please describe your issue in detail..." 
                          className="w-full p-2 rounded-md bg-black/20 border border-siso-border focus:outline-none focus:ring-2 focus:ring-siso-orange/50"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <select className="w-full p-2 rounded-md bg-black/20 border border-siso-border focus:outline-none focus:ring-2 focus:ring-siso-orange/50">
                          <option>Normal - 24 hour response</option>
                          <option>High - 8 hour response</option>
                          <option>Urgent - 4 hour response</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="attach-files" className="rounded border-siso-border" />
                        <label htmlFor="attach-files" className="text-sm">Add screenshots or documents to help explain the issue</label>
                      </div>
                      
                      <Button className="bg-gradient-to-r from-siso-orange to-siso-red hover:opacity-90">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Submit Support Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/30 border-siso-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LifeBuoy className="h-5 w-5 text-siso-orange" />
                    Your Support Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-black/20 rounded-lg text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-siso-orange/20 flex items-center justify-center mb-3">
                        <span className="text-xl font-semibold text-siso-orange">AM</span>
                      </div>
                      <h3 className="font-semibold">Alex Martinez</h3>
                      <p className="text-sm text-siso-orange">Project Manager</p>
                      <p className="text-xs text-siso-text mt-2">Your main point of contact for project-related questions and updates.</p>
                    </div>
                    
                    <div className="p-4 bg-black/20 rounded-lg text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-siso-orange/20 flex items-center justify-center mb-3">
                        <span className="text-xl font-semibold text-siso-orange">JK</span>
                      </div>
                      <h3 className="font-semibold">Jamie Kim</h3>
                      <p className="text-sm text-siso-orange">Technical Support</p>
                      <p className="text-xs text-siso-text mt-2">Available to help with technical issues and platform functionality questions.</p>
                    </div>
                    
                    <div className="p-4 bg-black/20 rounded-lg text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-siso-orange/20 flex items-center justify-center mb-3">
                        <span className="text-xl font-semibold text-siso-orange">RL</span>
                      </div>
                      <h3 className="font-semibold">Ryan Lee</h3>
                      <p className="text-sm text-siso-orange">Billing Specialist</p>
                      <p className="text-xs text-siso-text mt-2">Handles all payment, invoice, and financial related inquiries.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ClientDashboardLayout>
    </ProtectedRoute>
  );
}
