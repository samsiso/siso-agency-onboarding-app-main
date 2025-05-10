import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuickFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeName: string;
  onSubmit: (feedback: {
    type: string;
    priority: string;
    description: string;
  }) => void;
}

export function QuickFeedbackDialog({
  open,
  onOpenChange,
  nodeName,
  onSubmit
}: QuickFeedbackDialogProps) {
  const [type, setType] = useState('feature');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  
  const handleSubmit = () => {
    if (!description.trim()) {
      return; // Simple validation
    }
    
    onSubmit({
      type,
      priority,
      description
    });
    
    // Reset form
    setType('feature');
    setPriority('medium');
    setDescription('');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Feedback for "{nodeName}"</DialogTitle>
          <DialogDescription className="text-gray-400">
            Provide feedback for this specific screen or action in the user flow.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
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
              <Select value={priority} onValueChange={setPriority}>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your feedback for this part of the user flow..."
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
              setType('feature');
              setPriority('medium');
              setDescription('');
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