
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image } from "lucide-react";
import { NavLink } from "@/components/ui/nav-link";

export function WireframeSection() {
  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-white">Wireframe Elements</h3>
        <Image className="w-5 h-5 text-[#9b87f5]" />
      </div>
      <div className="space-y-4">
        <div className="bg-black/20 rounded-lg p-4">
          <p className="text-white font-medium">Homepage Wireframe</p>
          <p className="text-sm text-gray-400 mt-1">View Only</p>
        </div>
        <NavLink href="/resources/documents" className="flex items-center gap-2 text-[#9b87f5] hover:text-[#9b87f5]/80">
          <span>Download Wireframe</span>
          <ArrowRight className="w-4 h-4" />
        </NavLink>
      </div>
    </Card>
  );
}
