
import { BookOpen, HelpCircle, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/ui/nav-link';

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

const helpNavItems: NavItem[] = [
  {
    title: "Getting Started",
    href: "/resources/help/getting-started",
    icon: BookOpen,
  },
  {
    title: "FAQ",
    href: "/resources/help/faq",
    icon: HelpCircle,
  },
  {
    title: "Documentation",
    href: "/resources/help/documentation",
    icon: List,
  }
];

export function HelpNavigation() {
  return (
    <nav className="flex flex-col gap-2 min-w-[240px] p-4 bg-black/20 rounded-lg border border-border/5">
      <h2 className="font-semibold text-lg px-4 mb-2">Help Center</h2>
      {helpNavItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent"
        >
          <item.icon className="w-4 h-4" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
