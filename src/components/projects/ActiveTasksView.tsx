import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from "@/components/ui/list";
import { type DragEndEvent } from "@dnd-kit/core";
import { ProjectDirectoryCard } from './ProjectDirectoryCard';

const taskStatuses = [
  { id: "1", name: "To Do", color: "#6B7280" },
  { id: "2", name: "In Progress", color: "#F59E0B" },
  { id: "3", name: "Completed", color: "#10B981" },
];

const demoTasks = [
  {
    id: "1",
    name: "Research potential tech stack",
    status: taskStatuses[0],
    owner: {
      name: "Alex Johnson",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=1",
    }
  },
  {
    id: "2",
    name: "Create project architecture",
    status: taskStatuses[1],
    owner: {
      name: "Sam Wilson",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=2",
    }
  },
  {
    id: "3",
    name: "Setup development environment",
    status: taskStatuses[2],
    owner: {
      name: "Maria Garcia",
      image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=3",
    }
  },
];

const demoProjects = [
  {
    id: '1',
    name: 'Food Delivery App',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=1',
  }
];

export function ActiveTasksView() {
  const [tasks, setTasks] = useState(demoTasks);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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
      }),
    );
  };

  if (!selectedProject) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoProjects.map(project => (
          <ProjectDirectoryCard
            key={project.id}
            name={project.name}
            logo={project.logo}
            onSelect={() => setSelectedProject(project.id)}
          />
        ))}
        <ProjectDirectoryCard />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ListProvider onDragEnd={handleDragEnd}>
        {taskStatuses.map((status) => (
          <ListGroup key={status.name} id={status.name}>
            <ListHeader name={status.name} color={status.color} />
            <ListItems>
              {tasks
                .filter((task) => task.status.name === status.name)
                .map((task, index) => (
                  <ListItem
                    key={task.id}
                    id={task.id}
                    name={task.name}
                    parent={task.status.name}
                    index={index}
                  >
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: task.status.color }}
                    />
                    <p className="m-0 flex-1 font-medium text-sm">
                      {task.name}
                    </p>
                    {task.owner && (
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage src={task.owner.image} />
                        <AvatarFallback>
                          {task.owner.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </ListItem>
                ))}
            </ListItems>
          </ListGroup>
        ))}
      </ListProvider>
    </div>
  );
}
