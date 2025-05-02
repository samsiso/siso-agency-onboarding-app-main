
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/utils';
import { useEffect, useState } from "react";
import { SidebarContent } from "@/components/ui/sidebar";
import { clientMenuSections, clientProjects, userDropdownMenuItems } from "./clientMenuSections";
import { ClientSidebarMenuSection } from "./ClientSidebarMenuSection";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ClientSidebarNavigation({ collapsed = false, onItemClick = () => {}, visible = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>("ubahcrypt");
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Handle project change
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    // In a real app, you would update the current project context or state
    // and potentially navigate to that project's overview page
    navigate(`/client-dashboard/projects/${value}`);
  };

  // Get the current project name for display
  const getCurrentProjectName = () => {
    const project = clientProjects.find(p => p.id === selectedProject);
    return project ? project.name : "Select a Project";
  };

  useEffect(() => {
    if (location.hash) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(`#${entry.target.id}`);
            }
          });
        },
        { threshold: 0.5 }
      );
      document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
      });
      return () => observer.disconnect();
    }
  }, [location.hash]);

  const isItemActive = (href: string, isMain: boolean = false) => {
    if (!href) return false;
    const currentPath = location.pathname.replace(/\/$/, "");
    const targetPath = href.replace(/\/$/, "");
    const exactMatch = currentPath === targetPath;
    const isChildPath = currentPath.startsWith(targetPath + "/");
    if (isMain) {
      return exactMatch || isChildPath;
    }
    return exactMatch;
  };

  if (!visible) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <SidebarContent>
      <motion.nav
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className={cn("px-2 py-4", collapsed && "px-1")}
      >
        {/* Project Selection Dropdown */}
        {!collapsed && (
          <div className="px-3 mb-4">
            <Select value={selectedProject} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-full bg-black/20 border-siso-border">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Your Projects</SelectLabel>
                  {clientProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Main Navigation */}
        <div className="space-y-2">
          <AnimatePresence mode="wait">
            {clientMenuSections.map((section, index) => (
              // Only show the Current Project section if a project is selected
              (!section.isDynamic || (section.isDynamic && selectedProject)) && (
                <ClientSidebarMenuSection
                  key={index}
                  section={{
                    ...section,
                    // For dynamic sections, update title to include the project name
                    title: section.isDynamic 
                      ? `${section.title}: ${getCurrentProjectName()}`
                      : section.title
                  }}
                  isItemActive={isItemActive}
                  onItemClick={onItemClick}
                  collapsed={collapsed}
                />
              )
            ))}
          </AnimatePresence>
        </div>
        
        {/* User Dropdown Menu (at the bottom) */}
        <div className="mt-6 border-t border-siso-border pt-4">
          <div 
            className={cn(
              "flex items-center justify-between px-3 py-2 cursor-pointer rounded-md hover:bg-siso-border/20",
              showUserMenu && "bg-siso-border/20"
            )}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-siso-orange/20 to-siso-orange/30 flex items-center justify-center">
                <span className="text-xs font-medium text-siso-orange">UC</span>
              </div>
              {!collapsed && <span className="text-sm font-medium">ubahcrypto</span>}
            </div>
            {!collapsed && (
              showUserMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            )}
          </div>
          
          {/* User Menu Items */}
          {!collapsed && showUserMenu && (
            <div className="mt-2 space-y-1 pl-3 border-l-2 border-siso-border ml-4">
              {userDropdownMenuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-siso-text hover:text-white rounded-md hover:bg-siso-border/20"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                    onItemClick();
                  }}
                >
                  <item.icon className="h-4 w-4 text-siso-orange/70" />
                  <span>{item.label}</span>
                </a>
              ))}
              
              {/* Logout Option */}
              <a
                href="#"
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-siso-text hover:text-white rounded-md hover:bg-red-500/20"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle logout
                  navigate('/auth');
                  onItemClick();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </a>
            </div>
          )}
        </div>
      </motion.nav>
    </SidebarContent>
  );
}
