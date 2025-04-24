
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHelpCenter } from "@/components/dashboard/DashboardHelpCenter";
import { HelpNavigation } from "@/components/help/HelpNavigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

export default function HelpPage() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/resources">Resources</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/resources/help">Help Center</BreadcrumbLink>
            </BreadcrumbItem>
            {pathSegments.length > 2 && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="capitalize">
                    {pathSegments[pathSegments.length - 1].replace(/-/g, ' ')}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <HelpNavigation />
          </div>
          <div className="flex-1">
            <DashboardHelpCenter />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
