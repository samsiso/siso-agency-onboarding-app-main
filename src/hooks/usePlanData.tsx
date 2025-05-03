
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

export interface PlanSubsection {
  id: string;
  title: string;
  content: string;
  action_steps: string[] | null;
  expected_outcomes: string[] | null;
  best_practices: string[] | null;
  order_index: number;
}

export interface PlanPhase {
  id: string;
  title: string;
  description: string;
  order_index: number;
  subsections: PlanSubsection[];
}

export interface ProjectPlan {
  id: string;
  name: string;
  description: string | null;
  phases: PlanPhase[];
}

export function useProjectPlan(projectId?: string) {
  const { toast } = useToast();
  const params = useParams();
  const id = projectId || params.id || 'ubahcrypt';

  return useQuery({
    queryKey: ['project-plan', id],
    queryFn: async (): Promise<ProjectPlan | null> => {
      try {
        // First, check if the user has an assigned plan for this project
        const { data: clientPlan, error: clientPlanError } = await supabase
          .from('client_plans')
          .select('project_plan_id')
          .eq('client_id', id)
          .maybeSingle();

        if (clientPlanError) {
          console.error('Error fetching client plan:', clientPlanError);
        }

        // If no specific client plan, use the default UbahCrypt plan
        const planId = clientPlan?.project_plan_id;
        
        // Fetch the plan details
        const { data: plan, error: planError } = await supabase
          .from('project_plans')
          .select('*')
          .eq('id', planId || '')
          .maybeSingle();

        if (planError) {
          if (planError.code !== 'PGRST116') { // No rows found isn't a real error
            console.error('Error fetching project plan:', planError);
            toast({
              title: 'Failed to load project plan',
              description: 'Please try again later.',
              variant: 'destructive',
            });
          }
          
          // If no plan found, fetch the default UbahCrypt plan
          const { data: defaultPlan, error: defaultPlanError } = await supabase
            .from('project_plans')
            .select('*')
            .eq('name', 'UbahCrypt Development Plan')
            .maybeSingle();
            
          if (defaultPlanError) {
            console.error('Error fetching default plan:', defaultPlanError);
            return null;
          }
          
          if (!defaultPlan) return null;
          plan = defaultPlan;
        }

        if (!plan) return null;

        // Fetch the phases for this plan
        const { data: phases, error: phasesError } = await supabase
          .from('plan_phases')
          .select('*')
          .eq('plan_id', plan.id)
          .order('order_index');

        if (phasesError) {
          console.error('Error fetching plan phases:', phasesError);
          return null;
        }

        // For each phase, fetch its subsections
        const phasesWithSubsections: PlanPhase[] = await Promise.all(
          phases.map(async (phase) => {
            const { data: subsections, error: subsectionsError } = await supabase
              .from('plan_subsections')
              .select('*')
              .eq('phase_id', phase.id)
              .order('order_index');

            if (subsectionsError) {
              console.error('Error fetching subsections for phase:', subsectionsError);
              return {
                ...phase,
                subsections: [],
              };
            }

            return {
              ...phase,
              subsections: subsections || [],
            };
          })
        );

        return {
          id: plan.id,
          name: plan.name,
          description: plan.description,
          phases: phasesWithSubsections,
        };
      } catch (error) {
        console.error('Error in useProjectPlan:', error);
        toast({
          title: 'Failed to load project plan',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
