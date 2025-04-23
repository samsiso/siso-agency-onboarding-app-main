
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban";
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
    startAt: new Date(),
    endAt: new Date(),
    status: taskStatuses[0],
    owner: {
      name: "Alex Johnson",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=1",
    }
  },
  {
    id: "2",
    name: "Create project architecture",
    startAt: new Date(),
    endAt: new Date(),
    status: taskStatuses[1],
    owner: {
      name: "Sam Wilson",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=2",
    }
  },
  {
    id: "3",
    name: "Setup development environment",
    startAt: new Date(),
    endAt: new Date(),
    status: taskStatuses[2],
    owner: {
      name: "Maria Garcia",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=3",
    }
  },
];

export function ActiveTasksView() {
  const [tasks, setTasks] = useState(demoTasks);

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

  return (
    <KanbanProvider onDragEnd={handleDragEnd}>
      {taskStatuses.map((status) => (
        <KanbanBoard key={status.name} id={status.name}>
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
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <p className="m-0 flex-1 font-medium text-sm">
                        {task.name}
                      </p>
                    </div>
                    {task.owner && (
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage src={task.owner.image} />
                        <AvatarFallback>
                          {task.owner.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </KanbanCard>
              ))}
          </KanbanCards>
        </KanbanBoard>
      ))}
    </KanbanProvider>
  );
}
