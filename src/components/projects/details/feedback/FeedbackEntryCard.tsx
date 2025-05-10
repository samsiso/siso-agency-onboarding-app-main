import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  CalendarIcon, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Edit, 
  MessageCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackEntryProps {
  entry: {
    id: string;
    source: string;
    date: string;
    type: string;
    status: string;
    priority: string;
    title: string;
    description: string;
    response?: string;
  };
  onUpdate: (updatedEntry: any) => void;
}

export function FeedbackEntryCard({ entry, onUpdate }: FeedbackEntryProps) {
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [response, setResponse] = useState(entry.response || '');
  const [newStatus, setNewStatus] = useState(entry.status);
  
  const handleSaveResponse = () => {
    onUpdate({
      ...entry,
      response,
      status: newStatus
    });
    setIsResponseDialogOpen(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-emerald-600">New</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-600">In Progress</Badge>;
      case 'implemented':
        return <Badge className="bg-indigo-600">Implemented</Badge>;
      case 'rejected':
        return <Badge className="bg-rose-600">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'feature':
        return <Badge variant="outline" className="border-blue-500 text-blue-400">Feature</Badge>;
      case 'bug':
        return <Badge variant="outline" className="border-red-500 text-red-400">Bug</Badge>;
      case 'ui':
        return <Badge variant="outline" className="border-purple-500 text-purple-400">UI/UX</Badge>;
      case 'performance':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-400">Performance</Badge>;
      case 'other':
        return <Badge variant="outline" className="border-gray-500 text-gray-400">Other</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="border-red-500 text-red-400 bg-red-900/20">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500 text-amber-400 bg-amber-900/20">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-green-500 text-green-400 bg-green-900/20">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div className={cn(
      "bg-black/20 border border-gray-800 rounded-lg overflow-hidden transition-all duration-200",
      entry.status === 'implemented' && 'border-l-4 border-l-indigo-600',
      entry.status === 'in-progress' && 'border-l-4 border-l-amber-600',
      entry.status === 'new' && 'border-l-4 border-l-emerald-600',
      entry.status === 'rejected' && 'border-l-4 border-l-rose-600',
    )}>
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
          <div className="flex items-center flex-wrap gap-2">
            {getStatusBadge(entry.status)}
            {getTypeBadge(entry.type)}
            {getPriorityBadge(entry.priority)}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{entry.source}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{format(new Date(entry.date), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <p className="text-gray-300 mb-4">{entry.description}</p>
        
        {entry.response && (
          <div className="mt-4 p-3 bg-black/40 rounded-md border border-gray-700">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-400 mb-2">
              <MessageCircle className="h-4 w-4" />
              <span>Response</span>
            </div>
            <p className="text-gray-300 text-sm">{entry.response}</p>
          </div>
        )}
      </div>
      
      <div className="bg-black/40 p-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-indigo-400 border-indigo-400/30 hover:bg-indigo-500/10"
          onClick={() => setIsResponseDialogOpen(true)}
        >
          {entry.response ? <Edit className="h-4 w-4 mr-1" /> : <MessageSquare className="h-4 w-4 mr-1" />}
          {entry.response ? 'Edit Response' : 'Add Response'}
        </Button>
      </div>
      
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription className="text-gray-400">
              Provide a response and update the status of this feedback.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Feedback Title</h4>
              <p className="text-gray-300">{entry.title}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Update Status</h4>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="bg-black/20 border-gray-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="implemented">Implemented</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Response</h4>
              <Textarea
                placeholder="Enter your response..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[120px] bg-black/20 border-gray-700"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveResponse}>
              Save Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 