
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Users, MessageSquare } from "lucide-react";
import { NetworkingCategories } from "./NetworkingCategories";
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const NetworkingGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: resources, isLoading } = useQuery({
    queryKey: ['networking-resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('networking_resources')
        .select('*')
        .order('member_count', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="bg-siso-text/5 border border-siso-text/10 rounded-lg p-4 animate-pulse"
          >
            <div className="w-10 h-10 bg-siso-text/10 rounded-full mb-3" />
            <div className="h-4 bg-siso-text/10 rounded w-3/4 mb-2" />
            <div className="h-4 bg-siso-text/10 rounded w-1/2" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (!resources?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <Globe className="w-12 h-12 text-siso-text/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-siso-text-bold mb-2">No Communities Found</h3>
        <p className="text-siso-text/60">Check back later for new networking opportunities.</p>
      </motion.div>
    );
  }

  const categories = resources.reduce((acc, resource) => {
    const category = resource.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredResources = selectedCategory === "all" 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  return (
    <div className="space-y-4">
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <NetworkingCategories 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-siso-text/5 to-siso-text/10 
                  hover:from-siso-red/10 hover:to-siso-orange/10 border border-siso-text/10 hover:border-siso-orange/20
                  p-4 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  {resource.profile_image_url ? (
                    <motion.img
                      src={resource.profile_image_url}
                      alt={resource.name}
                      className="w-10 h-10 rounded-full"
                      whileHover={{ scale: 1.1 }}
                    />
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-siso-red/20 to-siso-orange/20 
                        flex items-center justify-center"
                    >
                      <Globe className="w-5 h-5 text-siso-orange" />
                    </motion.div>
                  )}
                  <div>
                    <h3 className="font-semibold text-base text-siso-text-bold">{resource.name}</h3>
                    <p className="text-xs text-siso-text/60">{resource.platform}</p>
                  </div>
                </div>
                
                <div className="relative overflow-hidden">
                  <p className="text-sm text-siso-text/80 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                    {resource.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-siso-text/10">
                  <motion.div 
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 1 }}
                    className="flex items-center gap-1.5 text-xs text-siso-text/60"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{resource.member_count.toLocaleString()}</span>
                  </motion.div>
                  
                  <motion.a
                    href={resource.join_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-gradient-to-r 
                      from-siso-red to-siso-orange text-white hover:opacity-90 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Join
                  </motion.a>
                </div>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  animate={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Tabs>
    </div>
  );
};
