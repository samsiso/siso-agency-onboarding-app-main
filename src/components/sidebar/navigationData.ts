
import { 
  LayoutDashboard,
  Folder,
  ListTodo,
  Files,
  CreditCard,
  HelpCircle,
  User,
  Briefcase,
} from "lucide-react";
import { MenuSection } from './types';

export const getMenuSections = (isClient = false): MenuSection[] => {
  const sections: MenuSection[] = [
    {
      type: 'main',
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      type: 'main',
      href: '/projects',
      icon: Folder,
      label: 'Projects Hub',
    },
    {
      type: 'main',
      href: '/tasks',
      icon: ListTodo,
      label: 'Task Center',
    },
    {
      type: 'main',
      href: '/resources',
      icon: Files,
      label: 'Documents & Resources',
    },
    {
      type: 'main',
      href: '/financial',
      icon: CreditCard,
      label: 'Financial Hub',
    },
    {
      type: 'main',
      href: '/support',
      icon: HelpCircle,
      label: 'Support Center',
    },
    {
      type: 'main',
      href: '/profile',
      icon: User,
      label: 'Profile & Settings',
    },
    // Client Portal section is only shown to client users
    ...(isClient ? [{
      type: 'main',
      href: '/client-portal',
      icon: Briefcase,
      label: 'Client Portal',
    }] : []),
  ];
  return sections;
};

