import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Search, Youtube, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface NetworkingHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const NetworkingHeader = ({ searchQuery, setSearchQuery }: NetworkingHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col space-y-6 mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text flex items-center gap-2">
            SISO Networking Hub
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-siso-orange" />
            </motion.div>
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
              className="w-full px-4 py-3 bg-siso-text/5 border border-siso-text/10 rounded-lg focus:outline-none focus:border-siso-orange/50 text-siso-text pl-10 transition-all duration-300 hover:bg-siso-text/10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60 w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <Alert className="bg-siso-text/5 border border-siso-text/10 transition-all duration-300 group-hover:border-siso-orange/50">
            <Users className="h-4 w-4 text-siso-orange group-hover:text-siso-red transition-colors" />
            <AlertDescription className="text-siso-text/80">
              <span className="font-semibold text-siso-text">Community Members:</span> Discover and connect with featured creators, educators, and community leaders.
            </AlertDescription>
          </Alert>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <Alert className="bg-siso-text/5 border border-siso-text/10 transition-all duration-300 group-hover:border-siso-orange/50">
            <Search className="h-4 w-4 text-siso-orange group-hover:text-siso-red transition-colors" />
            <AlertDescription className="text-siso-text/80">
              <span className="font-semibold text-siso-text">Smart Search:</span> Find communities by name, category, or activity level with intelligent matching.
            </AlertDescription>
          </Alert>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <Alert className="bg-siso-text/5 border border-siso-text/10 transition-all duration-300 group-hover:border-siso-orange/50">
            <Youtube className="h-4 w-4 text-siso-orange group-hover:text-siso-red transition-colors" />
            <AlertDescription className="text-siso-text/80">
              <span className="font-semibold text-siso-text">Rich Insights:</span> View detailed analytics, engagement metrics, and growth trends for each community.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </motion.div>
  );
};