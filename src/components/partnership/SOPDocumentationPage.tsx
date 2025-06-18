import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Download,
  PlayCircle,
  FileText,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  Clock,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PartnershipLayout } from '@/components/partnership/PartnershipLayout';

interface SOPSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'checklist' | 'tips' | 'warning' | 'example';
  items?: string[];
}

interface SOPTemplate {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToRead: string;
  successRate: string;
  sections: SOPSection[];
  resources: {
    title: string;
    description: string;
    url: string;
    type: 'template' | 'video' | 'article' | 'tool';
  }[];
  keyTakeaways: string[];
  nextSteps: string[];
}

interface SOPDocumentationPageProps {
  sop: SOPTemplate;
  onBack?: () => void;
}

export function SOPDocumentationPage({ sop, onBack }: SOPDocumentationPageProps) {
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const toggleSectionComplete = (sectionId: string) => {
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(sectionId)) {
      newCompleted.delete(sectionId);
    } else {
      newCompleted.add(sectionId);
    }
    setCompletedSections(newCompleted);
  };

  const progressPercentage = (completedSections.size / sop.sections.length) * 100;

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'checklist':
        return CheckCircle;
      case 'tips':
        return Star;
      case 'warning':
        return Target;
      case 'example':
        return MessageSquare;
      default:
        return FileText;
    }
  };

  const getSectionBadgeColor = (type: string) => {
    switch (type) {
      case 'checklist':
        return 'bg-green-500/20 text-green-400';
      case 'tips':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'warning':
        return 'bg-red-500/20 text-red-400';
      case 'example':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return PlayCircle;
      case 'template':
        return Download;
      case 'tool':
        return ExternalLink;
      default:
        return FileText;
    }
  };

  return (
    <PartnershipLayout
      title=""
      subtitle=""
    >
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-amber-500/20 border border-orange-500/30 rounded-xl p-8"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-gray-400 hover:text-white -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Client Management
              </Button>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                <sop.icon className="h-8 w-8 text-orange-400" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{sop.title}</h1>
                <p className="text-gray-300 text-lg mb-4">{sop.description}</p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <Badge className={`${
                    sop.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    sop.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {sop.difficulty}
                  </Badge>
                  
                  <div className="flex items-center text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {sop.timeToRead} read
                  </div>
                  
                  <div className="flex items-center text-gray-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {sop.successRate} success rate
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Reading Progress</span>
                <span className="text-sm text-orange-400">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <motion.div 
                  className="bg-orange-500 h-2 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {sop.sections.map((section, index) => {
              const SectionIcon = getSectionIcon(section.type);
              const isCompleted = completedSections.has(section.id);
              
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-black border-orange-500/20 ${isCompleted ? 'ring-1 ring-green-500/30' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <SectionIcon className="h-4 w-4 text-orange-400" />
                          </div>
                          <div>
                            <CardTitle className="text-white">{section.title}</CardTitle>
                            <Badge className={getSectionBadgeColor(section.type)}>
                              {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={isCompleted ? "default" : "outline"}
                          onClick={() => toggleSectionComplete(section.id)}
                          className={isCompleted ? "bg-green-600 hover:bg-green-700" : "border-gray-600 text-gray-400 hover:text-white"}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {isCompleted ? 'Completed' : 'Mark Complete'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-gray-300 leading-relaxed">
                        {section.content}
                      </div>
                      
                      {section.items && (
                        <div className="mt-4 space-y-2">
                          {section.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-300">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Takeaways */}
            <Card className="bg-black border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="h-5 w-5 mr-2 text-orange-500" />
                  Key Takeaways
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sop.keyTakeaways.map((takeaway, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="bg-black border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-orange-500" />
                  Additional Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sop.resources.map((resource, index) => {
                    const ResourceIcon = getResourceIcon(resource.type);
                    return (
                      <div key={index} className="p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-orange-500/30 transition-colors">
                        <div className="flex items-start space-x-3">
                          <ResourceIcon className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">{resource.title}</h4>
                            <p className="text-gray-400 text-xs mt-1">{resource.description}</p>
                            <Button 
                              size="sm" 
                              variant="link" 
                              className="text-orange-400 hover:text-orange-300 p-0 h-auto mt-2"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              View Resource
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-black border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="h-5 w-5 mr-2 text-orange-500" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sop.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-xs text-orange-400 font-medium">{index + 1}</span>
                      </div>
                      <span className="text-gray-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PartnershipLayout>
  );
}