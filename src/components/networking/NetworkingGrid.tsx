import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Users, MessageSquare } from "lucide-react";
import { NetworkingCategories } from "./NetworkingCategories";
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { motion } from "framer-motion";

export const NetworkingGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: resources, isLoading } = useQuery({
    queryKey: ["networking-resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("networking_resources")
        .select("*");
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-siso-text/5 border border-siso-text/10 rounded-lg p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-siso-text/10 rounded-full mb-4" />
            <div className="h-4 bg-siso-text/10 rounded w-3/4 mb-2" />
            <div className="h-4 bg-siso-text/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!resources) {
    return <div>No networking resources found.</div>;
  }

  // Calculate categories and their counts
  const categories = resources.reduce((acc, resource) => {
    const category = resource.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter resources based on selected category
  const filteredResources = selectedCategory === "all" 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  return (
    <div className="space-y-6">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <NetworkingCategories 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResources.map((resource) => (
            <motion.div
              key={resource.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-siso-text/5 to-siso-text/10 
                hover:from-siso-red/10 hover:to-siso-orange/10 border border-siso-text/10 hover:border-siso-orange/20
                p-6 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                {resource.profile_image_url ? (
                  <img
                    src={resource.profile_image_url}
                    alt={resource.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-siso-orange" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg text-siso-text-bold">{resource.name}</h3>
                  <p className="text-sm text-siso-text/60">{resource.platform}</p>
                </div>
              </div>
              
              <p className="text-siso-text/80 mb-4">{resource.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-siso-text/60">
                  <Users className="w-4 h-4" />
                  <span>{resource.member_count.toLocaleString()} members</span>
                </div>
                
                <motion.a
                  href={resource.join_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-siso-red to-siso-orange 
                    text-white hover:opacity-90 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Join
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Tabs>
    </div>
  );
};