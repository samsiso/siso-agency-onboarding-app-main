import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface ToolsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ToolsHeader({ searchQuery, onSearchChange }: ToolsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text animate-fade-in">
            Tools and Platforms
          </h1>
          <p className="mt-2 text-lg text-siso-text/80 leading-relaxed max-w-3xl animate-fade-in delay-100">
            Discover powerful tools and platforms to enhance your workflow. 
            Browse through various categories including development, database, and automation tools.
          </p>
        </div>
        <div className="relative w-full md:w-96 animate-fade-in delay-200">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60" />
          <Input
            placeholder="Search tools..."
            className="pl-10 bg-siso-text/5 border-siso-text/10 focus-visible:ring-siso-orange transition-all duration-300"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}