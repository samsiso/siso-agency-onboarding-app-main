import { useState } from 'react';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban";
import { TaskCard } from './TaskCard';
import { TaskDetailsSheet } from './TaskDetailsSheet';
import { useToast } from '@/hooks/use-toast';

const taskStatuses = [
  { id: "1", name: "To Do", color: "#6B7280" },
  { id: "2", name: "In Progress", color: "#F59E0B" },
  { id: "3", name: "Completed", color: "#10B981" },
];

const mockTasks = [
  {
    id: "1",
    name: "Design User Interface",
    description: "Create wireframes and mockups for the dashboard",
    startAt: new Date(Date.now() - 86400000),
    endAt: new Date(Date.now() + 86400000),
    category: "Design",
    priority: "high" as const,
    owner: {
      name: "Sarah Designer",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=SD",
    },
    status: { name: "To Do", color: "#6B7280" }
  },
  {
    id: "2",
    name: "Implement Authentication",
    description: "Set up user authentication flow",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now() + 172800000),
    category: "Development",
    priority: "high" as const,
    owner: {
      name: "John Developer",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=JD",
    },
    status: { name: "In Progress", color: "#F59E0B" }
  },
  {
    id: "3",
    name: "Write API Documentation",
    description: "Document all API endpoints",
    startAt: new Date(Date.now() - 172800000),
    endAt: new Date(Date.now() + 86400000),
    category: "Documentation",
    priority: "medium" as const,
    owner: {
      name: "Mike Writer",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=MW",
    },
    status: { name: "Completed", color: "#10B981" }
  },
  {
    id: "4",
    name: "Test Payment Integration",
    description: "Verify payment processing functionality",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now() + 259200000),
    category: "Testing",
    priority: "high" as const,
    owner: {
      name: "Alice Tester",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=AT",
    },
    status: { name: "To Do", color: "#6B7280" }
  }
];

export interface UiTask {
  id: string;
  name: string;
  description?: string;
  startAt: Date;
  endAt: Date;
  category: string;
  priority: 'low' | 'medium' | 'high';
  owner: {
    name: string;
    image: string;
  };
  status: {
    name: string;
    color: string;
  };
}

export function ActiveTasksView() {
  const [tasks, setTasks] = useState<UiTask[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<UiTask | null>(null);
  const { toast } = useToast();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    setTasks(currentTasks => {
      return currentTasks.map(task => {
        if (task.id === active.id) {
          return {
            ...task,
            status: {
              name: over.id,
              color: over.id === 'To Do' ? '#6B7280' :
                     over.id === 'In Progress' ? '#F59E0B' :
                     '#10B981'
            }
          };
        }
        return task;
      });
    });
  };

  const handleUpdateTask = (updatedTask: UiTask) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    
    setSelectedTask(null);
    toast({
      title: "Task updated",
      description: "Task details have been updated successfully."
    });
  };

  return (
    <div className="p-4">
      <TaskDetailsSheet
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
      
      <KanbanProvider onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taskStatuses.map((status) => (
            <KanbanBoard 
              key={status.name} 
              id={status.name}
              className="bg-black/20 border-[#403E43]/30 hover:border-[#403E43]/50"
            >
              <KanbanHeader name={status.name} color={status.color} />
              <KanbanCards>
                {tasks
                  .filter((task) => task.status.name === status.name)
                  .map((task, index) => (
                    <KanbanCard
                      key={task.id}
                      id={task.id}
                      name={task.name}
                      parent={status.name}
                      index={index}
                      className="bg-transparent shadow-none p-0"
                    >
                      <TaskCard
                        {...task}
                        onClick={() => setSelectedTask(task)}
                      />
                    </KanbanCard>
                  ))}
              </KanbanCards>
            </KanbanBoard>
          ))}
        </div>
      </KanbanProvider>
    </div>
  );
}
