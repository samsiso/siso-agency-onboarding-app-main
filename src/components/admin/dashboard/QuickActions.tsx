
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, FileText, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "New Client",
      icon: Users,
      href: "/admin/clients/new",
      variant: "default" as const,
      color: "from-orange-500/20 to-orange-600/20"
    },
    {
      title: "Create Invoice",
      icon: FileText,
      href: "/admin/invoices/new",
      variant: "outline" as const,
      color: "from-orange-400/20 to-orange-500/20"
    },
    {
      title: "Schedule Meeting",
      icon: Calendar,
      href: "/admin/calendar",
      variant: "outline" as const,
      color: "from-orange-500/20 to-orange-600/20"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      variant: "outline" as const,
      color: "from-orange-600/20 to-orange-700/20"
    }
  ];

  return (
    <Card className="border-orange-500/20 bg-black backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Button
              variant={action.variant}
              onClick={() => navigate(action.href)}
              className={`w-full justify-start bg-gradient-to-br ${action.color} text-white hover:shadow-lg transition-all duration-300`}
            >
              <action.icon className="mr-2 h-4 w-4" />
              {action.title}
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
