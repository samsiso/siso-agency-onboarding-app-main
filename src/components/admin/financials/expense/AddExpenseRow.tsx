
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTransaction } from "@/utils/financial";
import { toast } from "@/hooks/use-toast";
import { TableRow, TableCell } from "@/components/ui/table";

export interface AddExpenseRowProps {
  onExpenseAdded: () => void;
  visibleColumns: any[];
}

export function AddExpenseRow({ onExpenseAdded, visibleColumns }: AddExpenseRowProps) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: "",
    category_id: "",
    vendor_id: "",
    payment_method_id: "",
    recurring_type: "one-time",
    notes: "",
    type: "expense",
    currency: "GBP",
    status: "completed"
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInput = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  // Very minimal: category, vendor, payment, recurrence can be extended to autocomplete later.
  const handleAdd = async () => {
    if (!form.description || !form.amount || !form.date) {
      toast({
        title: "Missing fields",
        description: "Description, amount & date are required",
        variant: "destructive"
      });
      return;
    }
    setIsSaving(true);
    const success = await createTransaction({
      ...form,
      amount: parseFloat(form.amount)
    });
    setIsSaving(false);
    if (success) {
      toast({ title: "Expense Added" });
      setForm({
        ...form,
        description: "",
        amount: "",
        date: "",
        notes: "",
      });
      onExpenseAdded();
    }
  };

  return (
    <TableRow className="bg-background/60">
      <TableCell />
      {visibleColumns.map(col => {
        switch (col.key) {
          case "description":
            return (
              <TableCell key={col.key}>
                <Input
                  value={form.description}
                  onChange={e => handleInput("description", e.target.value)}
                  placeholder="Description"
                  className="min-w-[140px]"
                />
              </TableCell>
            );
          case "category":
            return (
              <TableCell key={col.key}>
                {/* Replace with fetch to categories dropdown later */}
                <Input
                  value={form.category_id}
                  onChange={e => handleInput("category_id", e.target.value)}
                  placeholder="Category ID"
                />
              </TableCell>
            );
          case "amount":
            return (
              <TableCell key={col.key}>
                <Input
                  value={form.amount}
                  onChange={e => handleInput("amount", e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-20"
                />
              </TableCell>
            );
          case "date":
            return (
              <TableCell key={col.key}>
                <Input
                  value={form.date}
                  onChange={e => handleInput("date", e.target.value)}
                  type="date"
                />
              </TableCell>
            );
          case "recurring_type":
            return (
              <TableCell key={col.key}>
                <select
                  value={form.recurring_type}
                  onChange={e => handleInput("recurring_type", e.target.value)}
                  className="bg-white border px-2 py-1 rounded"
                  style={{ zIndex: 40, minWidth: 80 }}
                >
                  <option value="one-time">One-Time</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </TableCell>
            );
          case "vendor":
            return (
              <TableCell key={col.key}>
                <Input
                  value={form.vendor_id}
                  onChange={e => handleInput("vendor_id", e.target.value)}
                  placeholder="Vendor ID"
                />
              </TableCell>
            );
          case "payment_method":
            return (
              <TableCell key={col.key}>
                <Input
                  value={form.payment_method_id}
                  onChange={e => handleInput("payment_method_id", e.target.value)}
                  placeholder="Payment Method ID"
                />
              </TableCell>
            );
          case "notes":
            return (
              <TableCell key={col.key}>
                <Input
                  value={form.notes}
                  onChange={e => handleInput("notes", e.target.value)}
                  placeholder="Notes"
                />
              </TableCell>
            );
          default:
            return <TableCell key={col.key} />;
        }
      })}
      <TableCell>
        <Button size="sm" onClick={handleAdd} disabled={isSaving}>
          Add
        </Button>
      </TableCell>
    </TableRow>
  );
}

