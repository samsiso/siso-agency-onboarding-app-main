import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
// Removed framer-motion for performance optimization
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Flag,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Tag,
  AlertTriangle
} from 'lucide-react';

// Task interfaces
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: 'overdue' | 'due-today' | 'upcoming' | 'in-progress' | 'blocked' | 'not-started' | 'started' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  category: 'development' | 'design' | 'marketing' | 'client' | 'admin';
  tags?: string[];
  estimatedHours?: number;
  subtasks?: Subtask[];
  progress?: number;
  description?: string;
}

interface AdminTaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onSubtaskToggle?: (taskId: string, subtaskId: string) => void;
}export const AdminTaskDetailModal: React.FC<AdminTaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onSubtaskToggle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
      setIsEditing(false);
      setActiveTab('details');
    }
  }, [task]);

  if (!task || !editedTask) return null;

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'due-today': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'blocked': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'done': return 'bg-green-500/20 text-green-400 border-green-500/40';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'medium': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/40';
      default: return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'design': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'marketing': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'client': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'admin': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };  // Event handlers
  const handleInputChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task ? { ...task } : null);
    setIsEditing(false);
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    if (!editedTask || !editedTask.subtasks) return;
    
    const updatedSubtasks = editedTask.subtasks.map(subtask =>
      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
    );
    
    const completedCount = updatedSubtasks.filter(st => st.completed).length;
    const progress = (completedCount / updatedSubtasks.length) * 100;
    
    setEditedTask({
      ...editedTask,
      subtasks: updatedSubtasks,
      progress: progress
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim() || !editedTask) return;
    
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: newSubtaskTitle,
      completed: false
    };
    
    const updatedSubtasks = [...(editedTask.subtasks || []), newSubtask];
    const completedCount = updatedSubtasks.filter(st => st.completed).length;
    const progress = (completedCount / updatedSubtasks.length) * 100;
    
    setEditedTask({
      ...editedTask,
      subtasks: updatedSubtasks,
      progress: progress
    });
    
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (!editedTask || !editedTask.subtasks) return;
    
    const updatedSubtasks = editedTask.subtasks.filter(st => st.id !== subtaskId);
    const completedCount = updatedSubtasks.filter(st => st.completed).length;
    const progress = updatedSubtasks.length > 0 ? (completedCount / updatedSubtasks.length) * 100 : 0;
    
    setEditedTask({
      ...editedTask,
      subtasks: updatedSubtasks,
      progress: progress
    });
  };  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-[#1f2533]/95 to-[#252229]/95 border border-[#3a3942]/50 p-0 max-h-[85vh] overflow-hidden rounded-xl backdrop-blur-sm shadow-xl">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-[#3a3942]/30">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              {isEditing ? (
                <Input
                  value={editedTask.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="text-lg font-semibold text-gray-100 bg-[#1f2533]/50 border border-[#3a3942]/50 focus:border-[#9b87f5]/60 rounded-lg"
                  placeholder="Task title..."
                />
              ) : (
                <DialogTitle className="text-lg font-semibold text-gray-100 leading-tight">
                  {editedTask.title}
                </DialogTitle>
              )}
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(editedTask.status)}`}>
                  {editedTask.status.replace('-', ' ')}
                </Badge>
                <Badge className={`text-xs px-3 py-1 rounded-full border ${getPriorityColor(editedTask.priority)}`}>
                  {editedTask.priority} priority
                </Badge>
                <Badge className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(editedTask.category)}`}>
                  {editedTask.category}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/40 rounded-lg">
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel} className="border-[#3a3942]/50 text-gray-300 hover:bg-[#1f2533]/50 rounded-lg">
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)} className="bg-[#9b87f5]/20 hover:bg-[#9b87f5]/30 text-[#9b87f5] border border-[#9b87f5]/40 rounded-lg">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>        {/* Tabs */}
        <div className="px-6 overflow-y-auto flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#1f2533]/50 border border-[#3a3942]/30 rounded-lg mb-6">
              <TabsTrigger value="details" className="rounded-md text-gray-300 data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">Details</TabsTrigger>
              <TabsTrigger value="subtasks" className="rounded-md text-gray-300 data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">Subtasks</TabsTrigger>
              <TabsTrigger value="description" className="rounded-md text-gray-300 data-[state=active]:bg-[#9b87f5]/20 data-[state=active]:text-[#9b87f5]">Description</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  {isEditing ? (
                    <Select value={editedTask.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="bg-[#1f2533]/50 border border-[#3a3942]/50 text-gray-100 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1f2533] border border-[#3a3942]/50 rounded-lg">
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className={`px-4 py-3 rounded-lg text-sm border ${getStatusColor(editedTask.status)}`}>
                      {editedTask.status.replace('-', ' ')}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Priority</label>
                  {isEditing ? (
                    <Select value={editedTask.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger className="bg-[#1f2533]/50 border border-[#3a3942]/50 text-gray-100 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1f2533] border border-[#3a3942]/50 rounded-lg">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className={`px-4 py-3 rounded-lg text-sm border ${getPriorityColor(editedTask.priority)}`}>
                      {editedTask.priority} priority
                    </div>
                  )}
                </div>
              </div>              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Category</label>
                  {isEditing ? (
                    <Select value={editedTask.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="bg-[#1f2533]/50 border border-[#3a3942]/50 text-gray-100 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1f2533] border border-[#3a3942]/50 rounded-lg">
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className={`px-4 py-3 rounded-lg text-sm border ${getCategoryColor(editedTask.category)}`}>
                      {editedTask.category}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Due Date</label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-[#1f2533]/50 border border-[#3a3942]/50 text-gray-100 hover:bg-[#1f2533]/70 rounded-lg">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editedTask.dueDate ? new Date(editedTask.dueDate).toLocaleDateString() : "Set date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#1f2533] border border-[#3a3942]/50 rounded-lg">
                        <Calendar
                          mode="single"
                          selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                          onSelect={(date) => handleInputChange('dueDate', date?.toISOString().split('T')[0])}
                          className="rounded-lg"
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="px-4 py-3 rounded-lg text-sm bg-[#1f2533]/50 border border-[#3a3942]/30 text-gray-300 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {editedTask.dueDate ? new Date(editedTask.dueDate).toLocaleDateString() : 'No due date'}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Assignee</label>
                  {isEditing ? (
                    <Input
                      value={editedTask.assignee || ''}
                      onChange={(e) => handleInputChange('assignee', e.target.value)}
                      placeholder="Assign to..."
                      className="bg-[#1f2533]/50 border border-[#3a3942]/50 text-gray-100 rounded-lg"
                    />
                  ) : (
                    <div className="px-4 py-3 rounded-lg text-sm bg-[#1f2533]/50 border border-[#3a3942]/30 text-gray-300 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {editedTask.assignee || 'Not assigned'}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Estimated Hours</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedTask.estimatedHours || ''}
                      onChange={(e) => handleInputChange('estimatedHours', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Hours..."
                      min="0"
                      step="0.5"
                      className="bg-[#1f2533]/50 border border-[#3a3942]/50 text-gray-100 rounded-lg"
                    />
                  ) : (
                    <div className="px-4 py-3 rounded-lg text-sm bg-[#1f2533]/50 border border-[#3a3942]/30 text-gray-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {editedTask.estimatedHours ? `${editedTask.estimatedHours}h` : 'Not estimated'}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Subtasks Tab */}
            <TabsContent value="subtasks" className="space-y-4">
              {editedTask.subtasks && editedTask.subtasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-300">
                      Progress: {editedTask.subtasks.filter(st => st.completed).length} of {editedTask.subtasks.length} completed
                    </h4>
                    <div className="text-sm font-medium text-orange-400">
                      {Math.round(((editedTask.subtasks.filter(st => st.completed).length) / editedTask.subtasks.length) * 100)}%
                    </div>
                  </div>
                  
                  <div className="w-full bg-[#1f2533]/50 rounded-full h-3 overflow-hidden mb-4 border border-[#3a3942]/30">
                    <div
                      className="h-full bg-gradient-to-r from-[#9b87f5] to-purple-400 transition-all duration-500 ease-out rounded-full"
                      style={{ 
                        width: `${((editedTask.subtasks.filter(st => st.completed).length) / editedTask.subtasks.length) * 100}%` 
                      }}
                    />
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {editedTask.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center gap-3 p-4 rounded-lg bg-[#1f2533]/50 border border-[#3a3942]/30 group hover:bg-[#1f2533]/70 transition-all duration-200"
                      >
                        <button
                          onClick={() => handleSubtaskToggle(subtask.id)}
                          className="flex-shrink-0"
                        >
                          {subtask.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-gray-400 hover:text-gray-300" />
                          )}
                        </button>
                        <span className={cn(
                          "text-sm flex-1",
                          subtask.completed ? "line-through text-gray-500" : "text-gray-200"
                        )}>
                          {subtask.title}
                        </span>
                        {isEditing && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSubtask(subtask.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}              {/* Add new subtask */}
              {isEditing && (
                <div className="flex items-center gap-3 mt-4">
                  <Input
                    placeholder="Add a new subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 bg-[#1f2533]/50 border border-[#3a3942]/50 text-gray-100 rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSubtask();
                      }
                    }}
                  />
                  <Button
                    onClick={handleAddSubtask}
                    size="sm"
                    className="bg-[#9b87f5]/20 hover:bg-[#9b87f5]/30 text-[#9b87f5] border border-[#9b87f5]/40 rounded-lg"
                    disabled={!newSubtaskTitle.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {(!editedTask.subtasks || editedTask.subtasks.length === 0) && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">No subtasks yet</div>
                  {isEditing && (
                    <div className="text-sm text-gray-500">Add subtasks to break down this task into smaller parts</div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Description Tab */}
            <TabsContent value="description" className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Description</label>
                {isEditing ? (
                  <Textarea
                    value={editedTask.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add a description for this task..."
                    className="min-h-[140px] bg-[#1f2533]/50 border border-[#3a3942]/50 text-gray-100 resize-none rounded-lg"
                  />
                ) : (
                  <div className="min-h-[140px] p-4 rounded-lg bg-[#1f2533]/50 border border-[#3a3942]/30 text-sm text-gray-300">
                    {editedTask.description || (
                      <span className="text-gray-500 italic">No description provided</span>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};