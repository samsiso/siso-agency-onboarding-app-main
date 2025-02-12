
import { SkillPath, Skill, UserSkillProgress } from '@/types/skills';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { usePoints } from '@/hooks/usePoints';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SkillsListProps {
  skills: Skill[];
  userProgress: UserSkillProgress[];
  skillPaths: SkillPath[];
}

export const SkillsList = ({
  skills,
  userProgress,
  skillPaths,
}: SkillsListProps) => {
  const { user } = useAuthSession();
  const { toast } = useToast();
  const { awardPoints } = usePoints(user?.id);

  const handleSkillAction = async (skill: Skill) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to track your progress",
        variant: "destructive",
      });
      return;
    }

    try {
      const progress = userProgress.find(p => p.skill_id === skill.id);
      const now = new Date().toISOString();

      if (progress) {
        // Check cooldown if applicable
        if (skill.cooldown_minutes && progress.last_completed_at) {
          const lastCompleted = new Date(progress.last_completed_at);
          const cooldownEnd = new Date(lastCompleted.getTime() + skill.cooldown_minutes * 60000);
          if (cooldownEnd > new Date()) {
            toast({
              title: "Cooldown active",
              description: `This skill can be completed again after cooldown ends`,
              variant: "destructive",
            });
            return;
          }
        }

        // Update existing progress
        const { error } = await supabase
          .from('user_skill_progress')
          .update({
            times_completed: progress.times_completed + 1,
            last_completed_at: now,
            completed_at: now,
          })
          .eq('id', progress.id);

        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from('user_skill_progress')
          .insert({
            user_id: user.id,
            skill_id: skill.id,
            completed_at: now,
            last_completed_at: now,
            times_completed: 1,
          });

        if (error) throw error;
      }

      // Award points
      await awardPoints(skill.name.toLowerCase().replace(/ /g, '_') as any);

      toast({
        title: "Skill completed!",
        description: `You earned ${skill.points} points`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getSkillStatus = (skill: Skill) => {
    const progress = userProgress.find(p => p.skill_id === skill.id);
    if (!progress) return "locked";
    if (progress.completed_at) return "completed";
    return "in-progress";
  };

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {skillPaths.map(path => {
        const pathSkills = skills.filter(s => s.path_id === path.id);
        return (
          <AccordionItem key={path.id} value={path.id}>
            <AccordionTrigger className="text-lg font-semibold">
              {path.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {pathSkills.map(skill => {
                  const status = getSkillStatus(skill);
                  return (
                    <div
                      key={skill.id}
                      className="p-4 rounded-lg border border-siso-border bg-siso-bg-alt/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{skill.name}</h4>
                          <p className="text-sm text-siso-text/80">
                            {skill.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-siso-orange">
                            {skill.points} points
                          </div>
                          <div className="text-xs text-siso-text/60">
                            Level {skill.level}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-siso-text/80">
                          {skill.requirements.description}
                        </div>
                        <Button
                          variant={status === 'completed' ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleSkillAction(skill)}
                        >
                          {status === 'completed' ? 'Complete Again' : 'Complete'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
