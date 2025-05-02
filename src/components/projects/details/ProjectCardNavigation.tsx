
import { NavLink } from "@/components/ui/nav-link";
import { FileText, ClipboardList, ListTodo, Clock, CreditCard } from "lucide-react";

interface ProjectCardNavigationProps {
  projectId: string;
}

export function ProjectCardNavigation({ projectId }: ProjectCardNavigationProps) {
  return (
    <div className="flex items-center overflow-x-auto pb-2 gap-2">
      <NavLink
        href={`/projects/${projectId}/overview`}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/20 hover:bg-black/40 text-white"
        activeClassName="bg-[#9b87f5]/20 text-[#9b87f5] border border-[#9b87f5]/30"
      >
        <FileText className="w-4 h-4" />
        <span>Overview</span>
      </NavLink>
      
      <NavLink
        href={`/projects/${projectId}/app-plan`}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/20 hover:bg-black/40 text-white"
        activeClassName="bg-[#9b87f5]/20 text-[#9b87f5] border border-[#9b87f5]/30"
      >
        <ClipboardList className="w-4 h-4" />
        <span>App Plan & Features</span>
      </NavLink>
      
      <NavLink
        href={`/projects/${projectId}/active-tasks`}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/20 hover:bg-black/40 text-white"
        activeClassName="bg-[#9b87f5]/20 text-[#9b87f5] border border-[#9b87f5]/30"
      >
        <ListTodo className="w-4 h-4" />
        <span>Tasks</span>
      </NavLink>
      
      <NavLink
        href={`/projects/${projectId}/timeline`}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/20 hover:bg-black/40 text-white"
        activeClassName="bg-[#9b87f5]/20 text-[#9b87f5] border border-[#9b87f5]/30"
      >
        <Clock className="w-4 h-4" />
        <span>Timeline</span>
      </NavLink>
      
      <NavLink
        href={`/projects/${projectId}/financial`}
        className="flex items-center gap-2 px-4 py-2 rounded-md bg-black/20 hover:bg-black/40 text-white"
        activeClassName="bg-[#9b87f5]/20 text-[#9b87f5] border border-[#9b87f5]/30"
      >
        <CreditCard className="w-4 h-4" />
        <span>Financial</span>
      </NavLink>
    </div>
  );
}
