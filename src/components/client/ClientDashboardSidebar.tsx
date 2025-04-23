
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  SidebarLogo,
} from "@/components/ui/aceternitySidebar";
import {
  LayoutDashboard,
  UserCog,
  Settings,
  LogOut,
  Folder,
  List,
  Clock,
  FileText,
  File,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ClientDashboardSidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // These routes must match your client dashboard structure!
  const mainLinks = [
    {
      label: "Dashboard",
      href: "/client-dashboard",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Projects",
      href: "/client-dashboard/projects",
      icon: (
        <Folder className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Todo List",
      href: "/client-dashboard/tasks",
      icon: (
        <List className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Timeline",
      href: "/client-dashboard/timeline",
      icon: (
        <Clock className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Changelog",
      href: "/client-dashboard/changelog",
      icon: (
        <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Documents",
      href: "/client-dashboard/documents",
      icon: (
        <File className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Financial",
      href: "/client-dashboard/financial",
      icon: (
        <DollarSign className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/client-dashboard/profile",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    }
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarLogo expanded={open} />
          <div className="mt-8 flex flex-col gap-2">
            {mainLinks.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Logout",
              href: "/client-portal",
              icon: (
                <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
