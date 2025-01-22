import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';
import { ShareButtons } from './ShareButtons';
import { motion } from 'framer-motion';

interface NewsCardProps {
  item: any;
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
}

export const NewsCard = ({ 
  item, 
  summaries, 
  loadingSummaries, 
  onGenerateSummary 
}: NewsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:bg-card/60 transition-colors duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="w-full sm:w-1/4 max-w-[300px] mx-auto sm:mx-0">
              <img
                src={item.image_url}
                alt={item.title}
                className="rounded-lg object-cover w-full aspect-video"
              />
            </div>
            <div className="flex-1 space-y-3 sm:space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-siso-text-bold hover:text-siso-red transition-colors line-clamp-2">
                  {item.title}
                </h2>
                <p className="text-sm sm:text-base text-siso-text/80 line-clamp-2">{item.description}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-siso-text/60">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <span>{item.source}</span>
                <span className="bg-siso-red/10 text-siso-red px-2 py-1 rounded text-xs">
                  {item.impact} Impact
                </span>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-4 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => !summaries[item.id] && onGenerateSummary(item.id)}
                      className="text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors w-full sm:w-auto"
                    >
                      {loadingSummaries[item.id] ? (
                        "Generating Summary..."
                      ) : (
                        "View AI Summary"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>AI Summary & Share Options</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 sm:space-y-6 py-4">
                      {summaries[item.id] ? (
                        <div className="bg-card p-3 sm:p-4 rounded-lg border border-siso-red/20">
                          <p className="text-sm sm:text-base">{summaries[item.id]}</p>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          Generating summary...
                        </div>
                      )}
                      
                      <ShareButtons summary={summaries[item.id] || ''} title={item.title} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};