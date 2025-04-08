
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  ExternalLink, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Link, 
  Quote, 
  ChevronDown, 
  ChevronUp,
  FileText,
  BarChart,
  Image as ImageIcon
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

export interface PainPointDetailProps {
  problem: string;
  statistic: string;
  solution: string;
  detailedSolution: string;
  benefits: string[];
  metrics: Array<{label: string; value: string; icon?: React.ReactNode}>;
  images?: Array<{url: string; caption: string}>;
  caseStudyLink?: string;
  
  // New expanded properties
  videoUrl?: string;
  researchSources?: Array<{title: string; url: string; description: string}>;
  testimonials?: Array<{content: string; author: string; company: string; imageUrl?: string}>;
  comparisonChart?: {
    title: string;
    description: string;
    items: Array<{metric: string; before: string; after: string}>;
  };
  implementationSteps?: Array<{title: string; description: string; icon?: React.ReactNode}>;
}

interface PainPointModalProps {
  painPoint: PainPointDetailProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PainPointsModal = ({ painPoint, open, onOpenChange }: PainPointModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  if (!painPoint) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto bg-black/80 border border-siso-orange/20 backdrop-blur-md text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-siso-orange">Problem:</span> {painPoint.problem}
          </DialogTitle>
          <DialogDescription className="text-siso-text mt-1">
            <span className="font-semibold text-white">{painPoint.statistic}</span>
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="w-full grid grid-cols-4 bg-black/20 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-siso-orange/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-siso-orange/20">
              In-Depth
            </TabsTrigger>
            <TabsTrigger value="proof" className="data-[state=active]:bg-siso-orange/20">
              Proof & Research
            </TabsTrigger>
            <TabsTrigger value="implementation" className="data-[state=active]:bg-siso-orange/20">
              Implementation
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab - Includes the basic solution and key benefits */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* Solution section */}
                <div className="bg-siso-orange/10 rounded-lg p-4 border border-siso-orange/20 mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                    <span className="text-siso-orange">Solution:</span> {painPoint.solution}
                  </h3>
                  <p className="text-siso-text leading-relaxed">{painPoint.detailedSolution}</p>
                </div>
                
                {/* Benefits */}
                <div className="space-y-2">
                  <h3 className="text-md font-semibold text-white">Key Benefits:</h3>
                  <ul className="space-y-2">
                    {painPoint.benefits.map((benefit, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle className="h-5 w-5 text-siso-orange mt-0.5 shrink-0" />
                        <span className="text-siso-text">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                {/* Featured image or video */}
                {painPoint.videoUrl ? (
                  <div className="bg-black/40 rounded-lg overflow-hidden border border-siso-text/10 mb-6">
                    <div className="aspect-video relative">
                      <iframe
                        src={painPoint.videoUrl}
                        className="w-full h-full absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-3">
                      <p className="text-siso-text text-sm flex items-center">
                        <Play className="h-4 w-4 mr-2 text-siso-orange" />
                        Watch how our solution works
                      </p>
                    </div>
                  </div>
                ) : painPoint.images && painPoint.images.length > 0 ? (
                  <div className="bg-black/40 rounded-lg overflow-hidden border border-siso-text/10 mb-6">
                    <div 
                      className="aspect-video relative overflow-hidden cursor-pointer" 
                      onClick={() => setExpandedImage(painPoint.images?.[0].url || null)}
                    >
                      <img 
                        src={painPoint.images[0].url} 
                        alt={painPoint.images[0].caption} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <p className="p-4 text-white text-sm">
                          {painPoint.images[0].caption}
                        </p>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-siso-text text-sm flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2 text-siso-orange" />
                        {painPoint.images.length > 1 ? `+${painPoint.images.length - 1} more images` : 'View full-size image'}
                      </p>
                    </div>
                  </div>
                ) : null}
                
                {/* Key metrics */}
                <div>
                  <h3 className="text-md font-semibold text-white mb-3">Impact Metrics:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {painPoint.metrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-black/40 border border-siso-orange/10 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {metric.icon || <TrendingUp className="h-4 w-4 text-siso-orange" />}
                          <span className="text-siso-text text-sm">{metric.label}</span>
                        </div>
                        <div className="text-lg font-bold text-white">{metric.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to action */}
            {painPoint.caseStudyLink && (
              <div className="mt-4 border-t border-siso-text/10 pt-4">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-siso-orange/30 bg-black/50 text-siso-orange transition-all hover:bg-siso-orange/10"
                  onClick={() => window.open(painPoint.caseStudyLink, '_blank')}
                >
                  View Related Case Study
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* In-Depth Tab - More detailed explanation and visualizations */}
          <TabsContent value="details" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 gap-6">
              {/* Detailed explanation */}
              <div className="bg-black/30 rounded-lg p-5 border border-siso-text/10">
                <h3 className="text-lg font-semibold text-white mb-3">Detailed Solution</h3>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-siso-text leading-relaxed whitespace-pre-line">{painPoint.detailedSolution}</p>
                </div>
              </div>
              
              {/* Images gallery */}
              {painPoint.images && painPoint.images.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Visual Examples</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {painPoint.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="rounded-lg overflow-hidden bg-black/30 border border-siso-text/10 cursor-pointer hover-scale"
                        onClick={() => setExpandedImage(image.url)}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img src={image.url} alt={image.caption} className="w-full h-full object-cover" />
                        </div>
                        <p className="p-2 text-sm text-siso-text">{image.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Comparison chart if available */}
              {painPoint.comparisonChart && (
                <div className="bg-black/30 rounded-lg p-5 border border-siso-text/10">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    <BarChart className="h-5 w-5 inline mr-2 text-siso-orange" />
                    {painPoint.comparisonChart.title}
                  </h3>
                  <p className="text-siso-text mb-4">{painPoint.comparisonChart.description}</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-siso-text/10 text-left">
                          <th className="py-2 px-4 text-siso-text">Metric</th>
                          <th className="py-2 px-4 text-siso-text">Before</th>
                          <th className="py-2 px-4 text-siso-orange">After</th>
                        </tr>
                      </thead>
                      <tbody>
                        {painPoint.comparisonChart.items.map((item, index) => (
                          <tr key={index} className="border-b border-siso-text/5">
                            <td className="py-3 px-4 text-white">{item.metric}</td>
                            <td className="py-3 px-4 text-siso-text">{item.before}</td>
                            <td className="py-3 px-4 text-siso-orange font-medium">{item.after}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Proof & Research Tab - External validation and testimonials */}
          <TabsContent value="proof" className="space-y-6 animate-fade-in">
            {/* Research sources and external validation */}
            {painPoint.researchSources && painPoint.researchSources.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-siso-orange" />
                  Research & Sources
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {painPoint.researchSources.map((source, index) => (
                    <Collapsible key={index} className="bg-black/20 rounded-lg border border-siso-text/10 overflow-hidden">
                      <CollapsibleTrigger className="w-full flex items-center justify-between p-4 text-left">
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4 text-siso-orange" />
                          <h4 className="text-white font-medium">{source.title}</h4>
                        </div>
                        <ChevronDown className="h-4 w-4 text-siso-text transition-transform data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <p className="text-siso-text mb-3">{source.description}</p>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-siso-orange flex items-center hover:underline"
                        >
                          View Source
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-black/20 rounded-lg p-4 border border-siso-text/10">
                <p className="text-siso-text">No additional research sources available for this solution.</p>
              </div>
            )}
            
            {/* Testimonials */}
            {painPoint.testimonials && painPoint.testimonials.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Quote className="h-5 w-5 text-siso-orange" />
                  Client Testimonials
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {painPoint.testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-black/30 rounded-lg p-4 border border-siso-orange/10">
                      <p className="text-siso-text mb-4 italic">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        {testimonial.imageUrl ? (
                          <img 
                            src={testimonial.imageUrl} 
                            alt={testimonial.author} 
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-siso-orange/20 flex items-center justify-center mr-3">
                            <span className="text-siso-orange font-semibold text-sm">
                              {testimonial.author.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{testimonial.author}</p>
                          <p className="text-siso-text text-sm">{testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Implementation Tab - How to implement the solution */}
          <TabsContent value="implementation" className="space-y-6 animate-fade-in">
            {painPoint.implementationSteps && painPoint.implementationSteps.length > 0 ? (
              <div className="bg-black/30 rounded-lg p-5 border border-siso-text/10">
                <h3 className="text-lg font-semibold text-white mb-4">Implementation Steps</h3>
                
                <div className="space-y-4">
                  {painPoint.implementationSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-siso-orange/20 flex items-center justify-center">
                        {step.icon || <span className="text-siso-orange font-semibold">{index + 1}</span>}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{step.title}</h4>
                        <p className="text-siso-text">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-siso-text/10">
                  <p className="text-siso-text">
                    Our team will guide you through each step of the implementation process to ensure a smooth transition.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-black/30 rounded-lg p-5 border border-siso-text/10">
                <h3 className="text-lg font-semibold text-white mb-3">Implementation Process</h3>
                <p className="text-siso-text">
                  Our implementation team will work with you to customize this solution to your specific needs and integrate it with your existing systems. Contact us to schedule a consultation.
                </p>
                
                <Button 
                  className="mt-4 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
                  onClick={() => onOpenChange(false)}
                >
                  Discuss Implementation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Image expanded view */}
        {expandedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setExpandedImage(null)}
          >
            <div className="max-w-5xl w-full max-h-[90vh] relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70"
                onClick={() => setExpandedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              <img 
                src={expandedImage} 
                alt="Expanded view" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
