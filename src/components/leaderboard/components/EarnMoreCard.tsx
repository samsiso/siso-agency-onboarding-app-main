
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Lightbulb, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EarnMoreCard() {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-black/30 border border-siso-text/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-siso-orange" />
          <CardTitle>Earn More Points</CardTitle>
        </div>
        <CardDescription className="text-siso-text">
          Climb the leaderboard by earning more points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-siso-orange mt-1" />
            <div>
              <h4 className="font-medium text-siso-text-bold">Complete Skills</h4>
              <p className="text-sm text-siso-text/80">Work through our skill paths to earn points and badges</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-siso-orange mt-1" />
            <div>
              <h4 className="font-medium text-siso-text-bold">Daily Login Streak</h4>
              <p className="text-sm text-siso-text/80">Earn bonus points by maintaining a daily login streak</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-siso-orange mt-1" />
            <div>
              <h4 className="font-medium text-siso-text-bold">Refer Friends</h4>
              <p className="text-sm text-siso-text/80">Get points for each friend who joins using your referral</p>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
          onClick={() => navigate('/economy/earn')}
        >
          <span>Learn How to Earn</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
