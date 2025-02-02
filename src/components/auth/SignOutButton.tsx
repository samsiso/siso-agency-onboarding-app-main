import { Button } from '@/components/ui/button';

interface SignOutButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export const SignOutButton = ({ onClick, disabled }: SignOutButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="destructive"
      className="cursor-pointer transition-all duration-200 hover:bg-red-600 hover:scale-105 shadow-lg"
    >
      Sign Out
    </Button>
  );
};