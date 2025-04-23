
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '@/lib/utils';
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Folder,
  List,
  Clock,
  FileText,
  File,
  DollarSign,
  User,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
} from "@/components/ui/sidebar";

// Define client menu items
const clientMenuSections = [
  {
    type: 'main',
    href: '/client-dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    type: 'section',
    title: 'Your Portal',
    icon: Folder,
    items: [
      {
        href: '/client-dashboard/projects',
        icon: Folder,
        label: 'Projects',
      },
      {
        href: '/client-dashboard/tasks',
        icon: List,
        label: 'Todo List',
      },
      {
        href: '/client-dashboard/timeline',
        icon: Clock,
        label: 'Timeline',
      },
      {
        href: '/client-dashboard/changelog',
        icon: FileText,
        label: 'Changelog',
      },
      {
        href: '/client-dashboard/documents',
        icon: File,
        label: 'Documents',
      },
      {
        href: '/client-dashboard/financial',
        icon: DollarSign,
        label: 'Financial',
      },
    ]
  },
  {
    type: 'main',
    href: '/client-dashboard/profile',
    icon: User,
    label: 'Profile',
  },
];

export function ClientSidebarNavigation({ collapsed = false, onItemClick = () => {}, visible = true }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
    // Remove trailing slashes for consistency
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
        <div className="space-y-2">
          <AnimatePresence mode="wait">
            {clientMenuSections.map((section, index) => {
              if (section.type === 'main') {
                return (
                  <motion.div key={index}>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isItemActive(section.href!, true)}
                        >
                          <a
                            href={section.href}
                            onClick={e => {
                              e.preventDefault();
                              navigate(section.href!);
                              onItemClick(e);
                            }}
                            className="flex items-center gap-3 w-full"
                          >
                            <section.icon className="w-5 h-5" />
                            <span>{section.label}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </motion.div>
                );
              }
              if (section.type === 'section') {
                return (
                  <motion.div key={index} className="space-y-1 border-b border-purple-900/20 pb-2">
                    <SidebarGroup>
                      <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {section.items?.map((item) => (
                            <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton
                                asChild
                                isActive={isItemActive(item.href)}
                              >
                                <a
                                  href={item.href}
                                  onClick={e => {
                                    e.preventDefault();
                                    navigate(item.href);
                                    onItemClick(e);
                                  }}
                                  className="flex items-center gap-3 w-full"
                                >
                                  <item.icon className="w-5 h-5" />
                                  <span>{item.label}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </motion.div>
                );
              }
              return null;
            })}
          </AnimatePresence>
        </div>
      </motion.nav>
    </SidebarContent>
  );
}
