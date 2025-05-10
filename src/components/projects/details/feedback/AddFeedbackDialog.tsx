import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FeedbackEntry {
  id: string;
  source: string;
  date: string;
  type: 'feature' | 'bug' | 'ui' | 'performance' | 'other';
  status: 'new' | 'in-progress' | 'implemented' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  response?: string;
}

interface AddFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFeedback: (newEntry: FeedbackEntry) => void;
}

export function AddFeedbackDialog({ open, onOpenChange, onAddFeedback }: AddFeedbackDialogProps) {
  const [source, setSource] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<FeedbackEntry['type']>('feature');
  const [priority, setPriority] = useState<FeedbackEntry['priority']>('medium');
  
  const resetForm = () => {
    setSource('');
    setTitle('');
    setDescription('');
    setType('feature');
    setPriority('medium');
  };
  
  const handleSubmit = () => {
    if (!source.trim() || !title.trim() || !description.trim()) {
      return; // Simple validation - don't submit if fields are empty
    }
    
    const newFeedback: FeedbackEntry = {
      id: uuidv4(),
      source,
      date: new Date().toISOString(),
      type,
      status: 'new', // Default status for new feedback
      priority,
      title,
      description
    };
    
    onAddFeedback(newFeedback);
    resetForm();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Feedback</DialogTitle>
          <DialogDescription className="text-gray-400">
            Submit feedback, feature requests, bugs, or other issues.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              placeholder="Your name or the feedback source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="bg-black/20 border-gray-700"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as FeedbackEntry['type'])}>
                <SelectTrigger id="type" className="bg-black/20 border-gray-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="ui">UI/UX Feedback</SelectItem>
                  <SelectItem value="performance">Performance Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as FeedbackEntry['priority'])}>
                <SelectTrigger id="priority" className="bg-black/20 border-gray-700">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Brief title for the feedback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/20 border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the feedback or issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] bg-black/20 border-gray-700"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 