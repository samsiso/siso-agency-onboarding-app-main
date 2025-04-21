
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilePlus } from "lucide-react";
import { useState } from "react";
import { ExpenseForm } from "./ExpenseForm";
import { toast } from "@/components/ui/use-toast";

interface CreateExpenseDialogProps {
  onDataChange: () => Promise<void>;
}

export function CreateExpenseDialog({ onDataChange }: CreateExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = async () => {
    toast({
      title: "Expense Created",
      description: "Your expense has been successfully created.",
    });
    setOpen(false);
    await onDataChange();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Enter the details for your new expense.
          </DialogDescription>
        </DialogHeader>
        <ExpenseForm onSuccess={handleSuccess} />
        <DialogFooter className="mt-5">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
