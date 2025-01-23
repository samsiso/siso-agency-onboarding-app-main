import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Search, Youtube } from "lucide-react";

interface NetworkingHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const NetworkingHeader = ({ searchQuery, setSearchQuery }: NetworkingHeaderProps) => {
  return (
    <div className="flex flex-col space-y-6 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
            SISO Networking Hub
          </h1>
          <p className="text-lg text-siso-text/80">
            Connect with the best communities and expand your network in the SISO ecosystem.
          </p>
        </div>
        <div className="w-full md:w-auto relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-siso-text/5 border border-siso-text/10 rounded-lg focus:outline-none focus:border-siso-orange/50 text-siso-text pl-10 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60 w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Alert className="bg-siso-text/5 border border-siso-text/10 transform hover:scale-105 transition-all duration-300 group">
          <Users className="h-4 w-4 text-siso-orange group-hover:text-siso-red transition-colors" />
          <AlertDescription className="text-siso-text/80">
            <span className="font-semibold text-siso-text">Community Members:</span> Discover and connect with featured creators, educators, and community leaders.
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-siso-text/5 border border-siso-text/10 transform hover:scale-105 transition-all duration-300 group">
          <Search className="h-4 w-4 text-siso-orange group-hover:text-siso-red transition-colors" />
          <AlertDescription className="text-siso-text/80">
            <span className="font-semibold text-siso-text">Quick Search:</span> Find specific members by name or browse through their specializations.
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-siso-text/5 border border-siso-text/10 transform hover:scale-105 transition-all duration-300 group">
          <Youtube className="h-4 w-4 text-siso-orange group-hover:text-siso-red transition-colors" />
          <AlertDescription className="text-siso-text/80">
            <span className="font-semibold text-siso-text">Content Access:</span> View member profiles to access their content, websites, and educational resources.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};