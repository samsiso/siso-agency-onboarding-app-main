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
  { id: "1", name: "Awaiting Your Action", color: "#FF0000" },
  { id: "2", name: "In Development", color: "#F59E0B" },
  { id: "3", name: "Done", color: "#10B981" },
];

// Client-focused tasks
const clientTasks = [
  {
    id: "1",
    name: "Collect Project Information",
    description: "Please fill out the form with your business details, project goals, and technical specs to help us create your app plan.",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now()),
    category: "Onboarding: 0%",
    priority: "high" as const,
    owner: {
      name: "Your Project Manager",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=PM",
    },
    status: { name: "Awaiting Your Action", color: "#FF0000" },
    actionButton: "Complete Now",
    actionLink: "/onboarding"
  },
  {
    id: "2",
    name: "Approve App Plan",
    description: "We've created a proposed app plan with milestones and costs. Review it and let us know if any changes are needed.",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now() + 86400000), // tomorrow
    category: "Planning: 50%",
    priority: "high" as const,
    owner: {
      name: "Your Project Manager",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=PM",
    },
    status: { name: "Awaiting Your Action", color: "#FF0000" },
    actionButton: "Review Now",
    actionLink: "/onboarding-chat"
  },
  {
    id: "3",
    name: "Make Deposit Payment",
    description: "A £1,000 deposit is required to start development. You can pay securely using Stripe or crypto (with a 20% SISO coin bonus).",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now() + 172800000), // 2 days
    category: "Deposit: £1,000",
    priority: "high" as const,
    owner: {
      name: "Finance Team",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=FT",
    },
    status: { name: "Awaiting Your Action", color: "#FF0000" },
    actionButton: "Pay Now",
    actionLink: "/financial"
  },
  {
    id: "4",
    name: "Phase 1: Initial Development",
    description: "Our team is currently designing the UI and wireframes for your app. You'll be able to review them soon.",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now() + 30 * 86400000), // 1 month
    category: "Phase 1: 30%",
    priority: "medium" as const,
    owner: {
      name: "Development Team",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=DT",
    },
    status: { name: "In Development", color: "#F59E0B" },
    actionButton: "View Progress",
    actionLink: "/projects/ubahcrypt"
  },
  {
    id: "5",
    name: "Phase 2: Core Development",
    description: "We're building the core functionality of your app, including user login and payment gateway integration.",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now() + 60 * 86400000), // 2 months
    category: "Phase 2: 0%",
    priority: "medium" as const,
    owner: {
      name: "Development Team",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=DT",
    },
    status: { name: "In Development", color: "#F59E0B" },
    actionButton: "View Progress",
    actionLink: "/projects/ubahcrypt"
  },
  {
    id: "6",
    name: "Client Kickoff Call",
    description: "We discussed your project goals and expectations during the kickoff call.",
    startAt: new Date("2025-04-30"),
    endAt: new Date("2025-04-30"),
    category: "Completed",
    priority: "medium" as const,
    owner: {
      name: "Your Project Manager",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=PM",
    },
    status: { name: "Done", color: "#10B981" }
  },
  {
    id: "7",
    name: "Review Phase 1 Deliverables",
    description: "We've completed the UI designs and wireframes. Please review and provide feedback or approval.",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now() + 5 * 86400000), // 5 days
    category: "Phase 1: 50%",
    priority: "high" as const,
    owner: {
      name: "Your Project Manager",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=PM",
    },
    status: { name: "Awaiting Your Action", color: "#FF0000" },
    actionButton: "Review Now",
    actionLink: "/projects/ubahcrypt"
  },
  {
    id: "8",
    name: "Collect Phase 1 Instalment",
    description: "A £1,500 instalment is due for the completion of Phase 1. Pay securely to continue development.",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now() + 3 * 86400000), // 3 days
    category: "Instalment: £1,500",
    priority: "high" as const,
    owner: {
      name: "Finance Team",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=FT",
    },
    status: { name: "Awaiting Your Action", color: "#FF0000" },
    actionButton: "Pay Now",
    actionLink: "/financial"
  },
  {
    id: "9",
    name: "Phase 3: Final Development",
    description: "We're polishing the app, adding final features, and preparing for launch.",
    startAt: new Date(Date.now()),
    endAt: new Date(Date.now() + 30 * 86400000), // 1 month
    category: "Phase 3: 0%",
    priority: "medium" as const,
    owner: {
      name: "Development Team",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=DT",
    },
    status: { name: "In Development", color: "#F59E0B" },
    actionButton: "View Progress",
    actionLink: "/projects/ubahcrypt"
  },
  {
    id: "10",
    name: "Project Completed",
    description: "Congratulations! Your app has been successfully launched and transferred to your hosting provider.",
    startAt: new Date("2025-05-30"),
    endAt: new Date("2025-05-30"),
    category: "Completed",
    priority: "low" as const,
    owner: {
      name: "Your Project Manager",
      image: "https://api.dicebear.com/7.x/initials/svg?seed=PM",
    },
    status: { name: "Done", color: "#10B981" }
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
  actionButton?: string;
  actionLink?: string;
}

export function ActiveTasksView() {
  const [tasks, setTasks] = useState<UiTask[]>(clientTasks);
  const [selectedTask, setSelectedTask] = useState<UiTask | null>(null);
  const { toast } = useToast();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    setTasks(currentTasks => {
      return currentTasks.map(task => {
        if (task.id === active.id) {
          const statusColor = 
            over.id === 'Awaiting Your Action' ? '#FF0000' :
            over.id === 'In Development' ? '#F59E0B' :
            '#10B981';
            
          const updatedTask = {
            ...task,
            status: {
              name: over.id,
              color: statusColor
            }
          };
          
          // Show toast when status changes
          toast({
            title: "Task Status Updated",
            description: `"${task.name}" moved to ${over.id}`,
          });
          
          return updatedTask;
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
        onUpdateTask={handleUpdateTask}
      />
      
      <KanbanProvider onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {taskStatuses.map((status) => (
            <KanbanBoard 
              key={status.name} 
              id={status.name}
              className="bg-[#1A1A1A]/80 border border-[#333] hover:border-[#444] rounded-xl"
            >
              <KanbanHeader 
                name={status.name} 
                color={status.name === "Awaiting Your Action" ? "#FF5555" : 
                       status.name === "In Development" ? "#FFAA33" : 
                       "#55AA55"} 
              />
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
                      className="bg-transparent shadow-none p-0 mb-4"
                    >
                      <div onClick={() => setSelectedTask(task)}>
                        <TaskCard {...task} />
                      </div>
                    </KanbanCard>
                  ))}
                  
                {tasks.filter((task) => task.status.name === status.name).length === 0 && (
                  <div className="flex items-center justify-center h-28 border border-dashed border-[#333] rounded-lg bg-[#1f2533]/30 text-sm text-muted-foreground">
                    No tasks in this section
                  </div>
                )}
              </KanbanCards>
            </KanbanBoard>
          ))}
        </div>
      </KanbanProvider>
    </div>
  );
}
