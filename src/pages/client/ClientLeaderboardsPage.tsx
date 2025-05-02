import React from 'react';
import { Helmet } from 'react-helmet';
import { ClientDashboardLayout } from '@/components/client/ClientDashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowUpRight, Users, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function ClientLeaderboardsPage() {
  return (
    <ProtectedRoute>
      <Helmet>
        <title>Leaderboards | SISO Agency</title>
      </Helmet>
      <ClientDashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Leaderboards</h1>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black/30 border-siso-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-siso-orange" />
                  Your Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">#15</span>
                  <span className="text-green-500 text-xs ml-2 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> Up 3 places
                  </span>
                </div>
                <p className="text-xs text-siso-text mt-1">Top 20% of all clients</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border-siso-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-siso-orange" />
                  Reputation Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">85</span>
                  <span className="text-siso-text text-xs ml-2">/ 100</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-siso-orange to-siso-red h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/30 border-siso-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-siso-orange" />
                  Total Active Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">73</span>
                </div>
                <p className="text-xs text-siso-text mt-1">In your industry segment</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Leaderboard Table */}
          <Tabs defaultValue="overall">
            <TabsList className="bg-black/30">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overall" className="mt-6">
              <Card className="bg-black/30 border-siso-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-siso-orange" />
                    Overall Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Top 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* 2nd Place */}
                      <div className="flex flex-col items-center p-4 bg-black/20 rounded-lg border border-siso-border/50 md:mt-4">
                        <div className="bg-gray-700 p-2 rounded-full mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="silver" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                          </svg>
                        </div>
                        <span className="text-lg font-semibold">MetaDevs</span>
                        <span className="text-xs text-gray-400 mb-2">Score: 92</span>
                        <span className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded-full">2nd Place</span>
                      </div>
                      
                      {/* 1st Place */}
                      <div className="flex flex-col items-center p-4 bg-gradient-to-b from-siso-orange/20 to-black/30 rounded-lg border border-siso-orange/50">
                        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2 rounded-full mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                          </svg>
                        </div>
                        <span className="text-lg font-semibold">CryptoKings</span>
                        <span className="text-xs text-siso-orange mb-2">Score: 98</span>
                        <span className="bg-gradient-to-r from-yellow-500/80 to-amber-500/80 text-white text-xs px-3 py-1 rounded-full font-semibold">1st Place</span>
                      </div>
                      
                      {/* 3rd Place */}
                      <div className="flex flex-col items-center p-4 bg-black/20 rounded-lg border border-siso-border/50 md:mt-4">
                        <div className="bg-amber-700 p-2 rounded-full mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#CD7F32" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                          </svg>
                        </div>
                        <span className="text-lg font-semibold">BlockMasters</span>
                        <span className="text-xs text-gray-400 mb-2">Score: 89</span>
                        <span className="bg-amber-700/50 text-amber-200 text-xs px-2 py-1 rounded-full">3rd Place</span>
                      </div>
                    </div>
                    
                    {/* Other Ranks */}
                    <div className="bg-black/20 rounded-lg">
                      {/* Header */}
                      <div className="grid grid-cols-12 p-3 border-b border-siso-border/20 text-xs font-semibold text-siso-text">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5">Client</div>
                        <div className="col-span-3 text-right">Score</div>
                        <div className="col-span-3 text-right">Progress</div>
                      </div>
                      
                      {/* Row 4 */}
                      <div className="grid grid-cols-12 p-3 border-b border-siso-border/20 items-center">
                        <div className="col-span-1 font-semibold">4</div>
                        <div className="col-span-5 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>NF</AvatarFallback>
                          </Avatar>
                          <span>NodeFusion</span>
                        </div>
                        <div className="col-span-3 text-right">87</div>
                        <div className="col-span-3 flex justify-end">
                          <div className="w-full max-w-[100px] bg-black/40 rounded-full h-2">
                            <div className="bg-siso-orange h-2 rounded-full" style={{ width: "87%" }}></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional rows... */}
                      {[
                        { rank: 5, name: 'TechNexus', score: 85, initial: 'TN' },
                        { rank: 6, name: 'DataFlow', score: 83, initial: 'DF' },
                        { rank: 7, name: 'CodeCrafter', score: 82, initial: 'CC' },
                        { rank: 8, name: 'ByteWave', score: 80, initial: 'BW' },
                      ].map((client) => (
                        <div key={client.rank} className="grid grid-cols-12 p-3 border-b border-siso-border/20 items-center">
                          <div className="col-span-1 font-semibold">{client.rank}</div>
                          <div className="col-span-5 flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{client.initial}</AvatarFallback>
                            </Avatar>
                            <span>{client.name}</span>
                          </div>
                          <div className="col-span-3 text-right">{client.score}</div>
                          <div className="col-span-3 flex justify-end">
                            <div className="w-full max-w-[100px] bg-black/40 rounded-full h-2">
                              <div className="bg-siso-orange h-2 rounded-full" style={{ width: `${client.score}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* ... */}
                      
                      {/* Your Position - Highlighted */}
                      <div className="grid grid-cols-12 p-3 bg-siso-orange/10 border-l-4 border-siso-orange items-center">
                        <div className="col-span-1 font-semibold">15</div>
                        <div className="col-span-5 flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>UC</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">UbahCrypto</span>
                          <span className="bg-siso-orange/20 text-siso-orange text-xs px-1.5 py-0.5 rounded">You</span>
                        </div>
                        <div className="col-span-3 text-right font-medium">85</div>
                        <div className="col-span-3 flex justify-end">
                          <div className="w-full max-w-[100px] bg-black/40 rounded-full h-2">
                            <div className="bg-siso-orange h-2 rounded-full" style={{ width: "85%" }}></div>
                          </div>
                        </div>
                      </div>
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
