
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Info, RefreshCw, Settings, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NewsApiStatusProps {
  onRefresh?: () => void;
  syncNews?: (keyword: string, limit: number, source?: 'event_registry' | 'news_api') => Promise<void>;
  lastSync: string | null;
  articleCount: number;
  apiUsage: number;
  syncingNews: boolean;
  activeNewsSource?: 'event_registry' | 'news_api';
  switchNewsSource?: (source: 'event_registry' | 'news_api') => void;
}

export const NewsApiStatus = ({ 
  onRefresh, 
  syncNews, 
  lastSync, 
  articleCount, 
  apiUsage,
  syncingNews,
  activeNewsSource = 'event_registry',
  switchNewsSource
}: NewsApiStatusProps) => {
  // [Analysis] State for UI settings and form values
  const [showSettings, setShowSettings] = useState(false);
  const [keyword, setKeyword] = useState("artificial intelligence");
  const [limit, setLimit] = useState("20");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [selectedSource, setSelectedSource] = useState<'event_registry' | 'news_api'>(activeNewsSource);

  // [Analysis] Handle sync with selected source
  const handleSync = async () => {
    if (syncNews) {
      await syncNews(keyword, parseInt(limit), selectedSource);
    } else if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-md p-4 shadow-sm"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          API Status
        </h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSettings(true)}
            className="h-8"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSync} 
            disabled={syncingNews}
            className="h-8"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncingNews ? 'animate-spin' : ''}`} />
            {syncingNews ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4 mb-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">API Usage (Monthly)</p>
            <div className="flex items-center gap-2">
              <Progress value={apiUsage} className="h-2" />
              <span className="text-sm font-medium">{apiUsage.toFixed(1)}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Monthly Articles</p>
            <p className="text-xl font-semibold">{articleCount}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              Source: {activeNewsSource === 'event_registry' ? 'Event Registry' : 'News API'}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            Active
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Last Sync: {lastSync || 'Never'}
        </p>
        <Badge variant="outline" className="text-xs">
          Limit: 2000/month
        </Badge>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Configure News Sync</DialogTitle>
            <DialogDescription>
              Customize how the AI news is fetched from external sources.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="sources">News Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="advanced-mode">Advanced Mode</Label>
                <Switch 
                  id="advanced-mode" 
                  checked={advancedMode} 
                  onCheckedChange={setAdvancedMode} 
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="keyword" className="text-right">
                  Keyword
                </Label>
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="limit" className="text-right">
                  Article Limit
                </Label>
                <Select
                  value={limit}
                  onValueChange={setLimit}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="20" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 articles</SelectItem>
                    <SelectItem value="10">10 articles</SelectItem>
                    <SelectItem value="20">20 articles</SelectItem>
                    <SelectItem value="50">50 articles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {advancedMode && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lang" className="text-right">
                      Language
                    </Label>
                    <Select defaultValue="eng">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="English" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eng">English</SelectItem>
                        <SelectItem value="deu">German</SelectItem>
                        <SelectItem value="spa">Spanish</SelectItem>
                        <SelectItem value="fra">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sort" className="text-right">
                      Sort By
                    </Label>
                    <Select defaultValue="date">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="rel">Relevance</SelectItem>
                        <SelectItem value="sourceImportance">Source Importance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="sources" className="py-4 space-y-4">
              <div className="grid gap-4">
                <Label>Select News API Source</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant={selectedSource === 'event_registry' ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedSource('event_registry')}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Event Registry</span>
                      <span className="text-xs text-muted-foreground">More technical focus</span>
                    </div>
                  </Button>
                  <Button 
                    variant={selectedSource === 'news_api' ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedSource('news_api')}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">News API</span>
                      <span className="text-xs text-muted-foreground">Broader coverage</span>
                    </div>
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground mt-2">
                  {selectedSource === 'event_registry' 
                    ? "Event Registry provides more technically focused AI news from specialized sources."
                    : "News API offers broader coverage from mainstream news sources around the world."}
                </div>
                
                {switchNewsSource && (
                  <Button 
                    variant="secondary" 
                    className="w-full mt-2"
                    onClick={() => {
                      switchNewsSource(selectedSource);
                      setShowSettings(false);
                    }}
                  >
                    Switch to {selectedSource === 'event_registry' ? 'Event Registry' : 'News API'}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)} variant="outline">Cancel</Button>
            <Button 
              onClick={() => {
                handleSync();
                setShowSettings(false);
              }}
              disabled={syncingNews}
            >
              {syncingNews ? 'Syncing...' : 'Sync Now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
