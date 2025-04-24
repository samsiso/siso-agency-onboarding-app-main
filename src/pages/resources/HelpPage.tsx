
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHelpCenter } from "@/components/dashboard/DashboardHelpCenter";
import { HelpNavigation } from "@/components/help/HelpNavigation";

export default function HelpPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Help & Documentation</h1>
        <div className="flex gap-8">
          <HelpNavigation />
          <div className="flex-1">
            <DashboardHelpCenter />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
