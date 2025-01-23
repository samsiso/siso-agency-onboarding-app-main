import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileCard = ({ icon: Icon, title, children, className }: ProfileCardProps) => {
  return (
    <Card className={cn("bg-black/20 border-siso-text/10 backdrop-blur-sm transition-all duration-300 hover:border-siso-orange/20", className)}>
      <CardHeader>
        <CardTitle className="text-siso-text-bold flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-siso-orange" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};