
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  headerClassName?: string;
}

export function AnimatedCard({ children, className, title, headerClassName }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="will-change-transform"
    >
      <Card className={cn(
        "border-gray-800 bg-black/30 backdrop-blur-sm transition-all duration-300",
        "hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10",
        className
      )}>
        {title && (
          <CardHeader className={cn("flex flex-row items-center justify-between pb-2 pt-6", headerClassName)}>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
