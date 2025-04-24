
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { NavLink } from "@/components/ui/nav-link";

export function FinancialSummarySection() {
  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Financial Summary</h3>
        <NavLink href="/financial/payments" className="flex items-center gap-2 text-[#9b87f5] hover:text-[#9b87f5]/80">
          <span>View Financials</span>
          <ArrowRight className="w-4 h-4" />
        </NavLink>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/20 rounded-lg p-4">
          <p className="text-sm text-gray-400">Total Due</p>
          <p className="text-xl font-semibold text-white">£2,000</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4">
          <p className="text-sm text-gray-400">Last Payment</p>
          <p className="text-xl font-semibold text-white">£1,500</p>
          <p className="text-xs text-gray-400 mt-1">on 2025-04-01</p>
        </div>
      </div>
    </Card>
  );
}
