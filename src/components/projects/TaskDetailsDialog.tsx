import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, CalendarIcon, Edit2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface TaskDetailsDialogProps {
  task: {
    id: string;
    name: string;
    startAt: Date;
    endAt: Date;
    category: string;
    owner: {
      name: string;
      image: string;
    };
    priority: 'low' | 'medium' | 'high';
    status?: {
      name: string;
      color: string;
    };
    description?: string; // Add description as optional property
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedTask: any) => void;
}

export function TaskDetailsDialog({ task, isOpen, onClose, onSave }: TaskDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [activeTab, setActiveTab] = useState('details');

  // If the task changes, update our local state
  React.useEffect(() => {
    setEditedTask(task);
    setIsEditing(false);
  }, [task]);

  if (!task) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handlePriorityChange = (value: 'low' | 'medium' | 'high') => {
    setEditedTask(prev => {
      if (!prev) return prev;
      return { ...prev, priority: value };
    });
  };

  const handleSave = () => {
    if (onSave && editedTask) {
      onSave(editedTask);
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] bg-[#1A1F2C] border border-[#403E43]/30 p-0 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-white">
              {isEditing ? (
                <Input 
                  name="name"
                  value={editedTask?.name || ''}
                  onChange={handleInputChange}
                  className="text-xl font-semibold bg-black/20"
                />
              ) : task.name}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-1" /> Edit
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              )}
              <DialogClose asChild>
                <Button size="icon" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="px-6">
          <TabsList className="bg-black/20 mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="pb-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Status</label>
                  <Badge 
                    className="bg-opacity-20"
                    style={{ backgroundColor: `${task.status?.color}20`, color: task.status?.color }}
                  >
                    {task.status?.name || "To Do"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Priority</label>
                  {isEditing ? (
                    <RadioGroup 
                      value={editedTask?.priority || 'medium'} 
                      onValueChange={handlePriorityChange}
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="low" id="low" />
                        <Label htmlFor="low" className="text-blue-400">Low</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" className="text-amber-400">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="high" id="high" />
                        <Label htmlFor="high" className="text-red-400">High</Label>
                      </div>
                    </RadioGroup>
                  ) : (
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(task.priority)}
                    >
                      {task.priority}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Category</label>
                  {isEditing ? (
                    <Input 
                      name="category"
                      value={editedTask?.category || ''}
                      onChange={handleInputChange}
                      className="bg-black/20"
                    />
                  ) : (
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
                      {task.category}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={task.owner.image} />
                    <AvatarFallback>{task.owner.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-gray-400">Assigned to</p>
                    <p className="text-gray-200">{task.owner.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Timeline</label>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-gray-200">
                      {format(task.startAt, "MMM d")} - {format(task.endAt, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="description" className="pb-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-4">
              {isEditing ? (
                <Textarea 
                  name="description"
                  placeholder="Add a more detailed description..."
                  className="min-h-[200px] bg-black/20"
                  value={editedTask?.description || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="min-h-[200px] bg-black/10 rounded-md p-4">
                  {task.description || (
                    <p className="text-gray-500 italic">No description provided.</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="pb-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-4">
              <div className="text-gray-400 italic">
                No activity recorded yet.
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
