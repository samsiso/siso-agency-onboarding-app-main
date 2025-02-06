import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Users, MessageSquare } from "lucide-react";
import { NetworkingCategories } from "./NetworkingCategories";
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

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
    return <div className="flex justify-center items-center h-64">Loading...</div>;
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
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
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
                  <h3 className="font-semibold text-lg">{resource.name}</h3>
                  <p className="text-sm text-muted-foreground">{resource.platform}</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4">{resource.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{resource.member_count.toLocaleString()} members</span>
                </div>
                
                <a
                  href={resource.join_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Join
                </a>
              </div>
            </div>
          ))}
        </div>
      </Tabs>
    </div>
  );
};