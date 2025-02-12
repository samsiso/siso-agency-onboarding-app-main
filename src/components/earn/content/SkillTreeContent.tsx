
import { motion } from 'framer-motion';
import { SkillPath, Skill, UserSkillProgress } from '@/types/skills';
import { SkillPathCard } from './SkillPathCard';
import { SkillsList } from './SkillsList';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

interface SkillTreeContentProps {
  skillPaths: SkillPath[];
  skills: Skill[];
  userProgress: UserSkillProgress[];
  selectedPath: string | null;
  setSelectedPath: (pathId: string | null) => void;
  isLoading: boolean;
}

export const SkillTreeContent = ({ 
  skillPaths,
  skills,
  userProgress,
  selectedPath,
  setSelectedPath,
  isLoading 
}: SkillTreeContentProps) => {
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="animate-pulse space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-siso-text/10 rounded-lg" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <Tabs defaultValue="paths" className="space-y-8">
      <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
        <TabsTrigger value="paths">Skill Paths</TabsTrigger>
        <TabsTrigger value="active">Active Skills</TabsTrigger>
      </TabsList>

      <TabsContent value="paths" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillPaths.map((path) => (
            <SkillPathCard
              key={path.id}
              path={path}
              skills={skills.filter(s => s.path_id === path.id)}
              userProgress={userProgress}
              isSelected={selectedPath === path.id}
              onClick={() => setSelectedPath(path.id)}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="active">
        <SkillsList
          skills={skills}
          userProgress={userProgress}
          skillPaths={skillPaths}
        />
      </TabsContent>
    </Tabs>
  );
};
