
import { useState } from 'react';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban";
import { TaskCard } from './TaskCard';
import { TaskDetailsDialog } from './TaskDetailsDialog';
import { type DragEndEvent } from "@dnd-kit/core";

const taskStatuses = [
  { id: "1", name: "To Do", color: "#6B7280" },
  { id: "2", name: "In Progress", color: "#F59E0B" },
  { id: "3", name: "Completed", color: "#10B981" },
];

const demoTasks = [
  {
    id: "1",
    name: "Research potential tech stack",
    description: "Evaluate different technology options for the new project, focusing on scalability and performance.",
    startAt: new Date(),
    endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: taskStatuses[0],
    category: "Research",
    priority: "high" as const,
    owner: {
      name: "Alex Johnson",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=1",
    }
  },
  {
    id: "2",
    name: "Create project architecture",
    description: "Design the system architecture with microservices approach, defining the relationships between components.",
    startAt: new Date(),
    endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: taskStatuses[1],
    category: "Development",
    priority: "medium" as const,
    owner: {
      name: "Sam Wilson",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=2",
    }
  },
  {
    id: "3",
    name: "Setup development environment",
    description: "Configure development environments, install all required packages and dependencies.",
    startAt: new Date(),
    endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: taskStatuses[2],
    category: "Setup",
    priority: "low" as const,
    owner: {
      name: "Maria Garcia",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=3",
    }
  },
];

export function ActiveTasksView() {
  const [tasks, setTasks] = useState(demoTasks);
  const [selectedTask, setSelectedTask] = useState<typeof demoTasks[0] | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const status = taskStatuses.find((status) => status.name === over.id);
    if (!status) return;

    setTasks(
      tasks.map((task) => {
        if (task.id === active.id) {
          return { ...task, status };
        }
        return task;
      })
    );
  };

  const handleUpdateTask = (updatedTask: any) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task
    ));
    setSelectedTask(updatedTask);
  };

  return (
    <div className="p-4">
      <TaskDetailsDialog
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleUpdateTask}
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
                        name={task.name}
                        startAt={task.startAt}
                        endAt={task.endAt}
                        category={task.category}
                        owner={task.owner}
                        priority={task.priority}
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
