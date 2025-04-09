
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import type { LeaderboardEntry } from "./types";

interface LeaderboardFiltersProps {
  onFilterChange: (filtered: LeaderboardEntry[]) => void;
  leaderboardData: LeaderboardEntry[];
}

export function LeaderboardFilters({ onFilterChange, leaderboardData }: LeaderboardFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("points");
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    applyFilters(value, sortBy);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    applyFilters(searchTerm, value);
  };
  
  const applyFilters = (search: string, sort: string) => {
    let filtered = [...leaderboardData];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(entry => 
        entry.profile.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        entry.profile.email?.toLowerCase().includes(search.toLowerCase()) ||
        entry.profile.professional_role?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case "points":
          return b.points - a.points;
        case "tokens":
          return b.siso_tokens - a.siso_tokens;
        case "contributions":
          return b.contribution_count - a.contribution_count;
        case "referrals":
          return b.referral_count - a.referral_count;
        default:
          return 0;
      }
    });
    
    onFilterChange(filtered);
  };
  
  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("points");
    onFilterChange(leaderboardData);
  };
  
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-siso-text/50" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9 bg-black/20 border-siso-text/10"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-[180px]">
          <Select
            value={sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="bg-black/20 border-siso-text/10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-siso-text/70" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="points">Sort by Points</SelectItem>
              <SelectItem value="tokens">Sort by Tokens</SelectItem>
              <SelectItem value="contributions">Sort by Contributions</SelectItem>
              <SelectItem value="referrals">Sort by Referrals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(searchTerm || sortBy !== "points") && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearFilters}
            className="border-siso-text/10"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
