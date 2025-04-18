
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, FileText, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "New Client",
      icon: Users,
      href: "/admin/clients/new",
      variant: "default" as const
    },
    {
      title: "Create Invoice",
      icon: FileText,
      href: "/admin/invoices/new",
      variant: "outline" as const
    },
    {
      title: "Schedule Meeting",
      icon: Calendar,
      href: "/admin/calendar",
      variant: "outline" as const
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      variant: "outline" as const
    }
  ];

  return (
    <Card className="border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            onClick={() => navigate(action.href)}
            className="w-full justify-start"
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.title}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
