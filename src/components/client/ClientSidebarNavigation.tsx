
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';
import { useState } from "react";
import { 
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { clientMenuSections, clientProjects, userDropdownMenuItems } from "./clientMenuSections";
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

export function ClientSidebarNavigation({ collapsed = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<string>("ubahcrypt");
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Handle project change
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    navigate(`/client-dashboard/projects/${value}`);
  };

  // Get the current project name for display
  const getCurrentProjectName = () => {
    const project = clientProjects.find(p => p.id === selectedProject);
    return project ? project.name : "Select a Project";
  };

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

  const handleItemClick = (href: string) => {
    navigate(href);
  };

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
          {clientMenuSections.map((section, index) => {
            // Skip dynamic sections when no project is selected
            if (section.isDynamic && !selectedProject) {
              return null;
            }
            
            if (section.type === "main") {
              return (
                <SidebarMenu key={index}>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isItemActive(section.href!, true)}
                      tooltip={collapsed ? section.label : undefined}
                    >
                      <a 
                        href={section.href} 
                        onClick={(e) => {
                          e.preventDefault();
                          handleItemClick(section.href!);
                        }}
                        className="flex items-center gap-3 w-full"
                      >
                        <section.icon className="w-5 h-5 text-siso-orange" />
                        {!collapsed && <span>{section.label}</span>}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              );
            }
            
            return (
              <SidebarGroup key={index}>
                <SidebarGroupLabel>
                  <div className="flex items-center gap-2">
                    <section.icon className="w-4 h-4 text-siso-orange/80" />
                    {!collapsed && (
                      <span>
                        {section.isDynamic ? `${section.title}: ${getCurrentProjectName()}` : section.title}
                      </span>
                    )}
                  </div>
                </SidebarGroupLabel>
                {section.items && section.items.length > 0 && (
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {section.items.map((item, itemIndex) => (
                        <SidebarMenuItem key={itemIndex}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isItemActive(item.href)}
                            tooltip={collapsed ? item.label : undefined}
                          >
                            <a 
                              href={item.href} 
                              onClick={(e) => {
                                e.preventDefault();
                                handleItemClick(item.href);
                              }}
                              className="flex items-center gap-3 w-full"
                            >
                              <item.icon className="w-5 h-5" />
                              {!collapsed && <span>{item.label}</span>}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                )}
              </SidebarGroup>
            );
          })}
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
                  navigate('/auth');
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
