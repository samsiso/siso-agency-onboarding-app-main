<lov-code>
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Star, Users, ArrowUp, ArrowDown, MapPin, Clock, Award, Coins } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  name: string;
  icon: string;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number | null;
  rank: string | null;
  wins: number | null;
  losses: number | null;
  kda: number | null;
  season_rank: string | null;
  avatar_url: string | null;
  achievements: Achievement[] | null;
  siso_tokens: number | null;
  profiles: {
    full_name: string | null;
    email: string | null;
    professional_role: string | null;
  } | null;
}

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboard