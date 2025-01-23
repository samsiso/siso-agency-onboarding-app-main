import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileSection = ({ label, children, className }: ProfileSectionProps) => {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm text-siso-text/70">{label}</p>
      {children}
    </div>
  );
};