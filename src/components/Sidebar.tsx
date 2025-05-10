import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarLogo } from './sidebar/SidebarLogo';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { Menu, X, FolderOpen, ChevronDown, User, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelectedProject } from '@/hooks/useSelectedProject';
import { CollapsedProjectCard } from '@/components/client/CollapsedProjectCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { selectedProject, projects, selectProject } = useSelectedProject();

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    if (!href) return;

    if (href.startsWith('/')) {
      navigate(href);
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  const sidebarVariants = {
    expanded: {
      width: isMobile ? "16rem" : "16rem",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 0.8
      }
    },
    collapsed: {
      width: isMobile ? "0" : "4rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 35,
        mass: 0.8
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && !isProfileOpen) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isProfileOpen) {
      setIsExpanded(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/20";
      case "paused": return "bg-amber-500/20 text-amber-400 border-amber-500/20";
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/20";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/20";
    }
  };

  // Handle project selection with dropdown control
  const handleProjectSelect = (projectId: string) => {
    selectProject(projectId);
    // Don't automatically close the dropdown - let the user close it
  };

  return (
    <>
      {/* Mobile Menu Button with smooth icon transition */}
      {isMobile && (
        <motion.div
          initial={false}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 right-4 z-50 bg-siso-bg/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-siso-text" />
                ) : (
                  <Menu className="h-6 w-6 text-siso-text" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>
      )}

      {/* Sidebar with improved animations */}
      <motion.div 
        initial={false}
        animate={
          isMobile 
            ? isMobileMenuOpen ? "expanded" : "collapsed"
            : isExpanded ? "expanded" : "collapsed"
        }
        variants={sidebarVariants}
        className={`
          fixed top-0 h-screen overflow-y-auto
          bg-gradient-to-b from-siso-bg to-siso-bg/95 
          border-r border-siso-text/10 shadow-lg
          flex flex-col
          ${isMobile ? 'left-0 z-40' : ''}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarLogo 
          collapsed={!isExpanded} 
          setCollapsed={() => setIsExpanded(!isExpanded)}
          onLogoClick={() => setShowNavigation(!showNavigation)}
        />
        
        {/* Project Selector - Expanded View */}
        {isExpanded ? (
          <div className="mx-4 my-4">
            <DropdownMenu 
              open={isProjectDropdownOpen} 
              onOpenChange={setIsProjectDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full h-16 justify-between bg-siso-bg-alt border-siso-border hover:bg-siso-bg-alt/80 hover:border-siso-border-hover group transition-all duration-300"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {selectedProject?.logo ? (
                      <Avatar className="h-10 w-10 rounded-md border border-siso-border/30">
                        <AvatarImage src={selectedProject.logo} alt={selectedProject.name} />
                        <AvatarFallback className="rounded-md bg-siso-orange/20 text-siso-orange">
                          {selectedProject?.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <FolderOpen className="h-5 w-5 flex-shrink-0 text-siso-orange group-hover:text-siso-red transition-colors" />
                    )}
                    <div className="flex flex-col items-start">
                      <span className="truncate text-siso-text-bold group-hover:text-siso-text-bold transition-colors">
                        {selectedProject ? selectedProject.name : "Select a Project"}
                      </span>
                      <span className="text-xs text-siso-text-muted">
                        {selectedProject?.status === 'active' ? 'Active Project' : 
                         selectedProject?.status === 'paused' ? 'Paused' : 
                         selectedProject?.status === 'completed' ? 'Completed' : 'Select Project'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-siso-text-muted group-hover:text-siso-text transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-64 bg-siso-bg-alt border-siso-border"
                onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up
              >
                <div className="py-2 px-3 text-xs font-medium text-siso-text-muted uppercase tracking-wider">
                  Your Projects
                </div>
                
                {projects.map((project) => (
                  <DropdownMenuItem 
                    key={project.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-black/20 py-2"
                    onClick={() => handleProjectSelect(project.id)}
                    onSelect={(e) => {
                      // Prevent the automatic closing behavior
                      e.preventDefault();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {project.logo ? (
                        <Avatar className="h-6 w-6 rounded-md">
                          <AvatarImage src={project.logo} />
                          <AvatarFallback className="rounded-md bg-siso-bg-alt text-siso-text-muted">
                            {project.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <FolderOpen className={`h-4 w-4 ${project.status === 'active' ? 'text-siso-orange' : 'text-siso-text-muted'}`} />
                      )}
                      <span className="text-siso-text">{project.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs py-0 px-1.5 ${getStatusColor(project.status)}`}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator className="bg-siso-border" />
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-siso-orange hover:text-siso-red hover:bg-black/20"
                  onClick={() => navigate('/plan-builder')}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Create New Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-siso-text hover:bg-black/20"
                  onClick={() => navigate('/projects')}
                >
                  View all projects
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="px-2 my-2">
            <CollapsedProjectCard 
              projectName={selectedProject?.name || "Select Project"}
              projectLogo={selectedProject?.logo}
              onClick={() => setIsExpanded(true)}
            />
          </div>
        )}
        
        {/* Main navigation - ensure it fills available space */}
        <div className="flex-grow overflow-y-auto">
          <AnimatePresence mode="sync">
            <SidebarNavigation 
              collapsed={!isExpanded} 
              onItemClick={handleItemClick}
              visible={showNavigation}
            />
          </AnimatePresence>
        </div>

        {/* Footer always at the bottom */}
        <SidebarFooter 
          collapsed={!isExpanded} 
          onProfileOpen={(isOpen) => {
            setIsProfileOpen(isOpen);
            if (isOpen) setIsExpanded(true);
          }}
        />
      </motion.div>

      {/* Main Content Wrapper with smooth margin transition */}
      <motion.div 
        className="min-h-screen"
        animate={{
          marginLeft: !isMobile ? (isExpanded ? '16rem' : '4rem') : 0
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
      >
        {/* Mobile Overlay with improved backdrop blur */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
