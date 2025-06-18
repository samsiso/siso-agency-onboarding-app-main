/**
 * Dashboard Greeting Card Template
 * 
 * A reusable greeting card component that displays a personalized welcome message
 * with dynamic time-based colors and greetings. Features animated elements and
 * responsive design suitable for any dashboard layout.
 * 
 * Key Features:
 * - Time-based greetings (Good morning, afternoon, evening)
 * - Dynamic gradient colors that change based on time of day
 * - Animated icon interactions
 * - Date display with formatted styling
 * - Customizable user display name
 * - Smooth animations and hover effects
 * 
 * Usage:
 * <DashboardGreetingCard 
 *   userName="John Doe" 
 *   welcomeMessage="Welcome to your partnership dashboard"
 * />
 */

import { motion } from 'framer-motion';
import { useDayPeriod } from '@/hooks/useDayPeriod';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardGreetingCardProps {
  /** Display name for the user - defaults to email prefix if not provided */
  userName?: string;
  /** Custom welcome message - defaults to "Welcome to your dashboard" */
  welcomeMessage?: string;
  /** Custom CSS classes for styling */
  className?: string;
  /** Whether to show the current date */
  showDate?: boolean;
}

export function DashboardGreetingCard({ 
  userName, 
  welcomeMessage = "Welcome to your dashboard",
  className = "",
  showDate = true 
}: DashboardGreetingCardProps) {
  const { period, greeting, icon: PeriodIcon, gradientClass } = useDayPeriod();
  
  const displayName = userName || 'there';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`relative border-0 bg-gradient-to-r ${gradientClass} backdrop-blur-sm shadow-lg mb-6 overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-grid-white/10 mask-gradient-to-r" />
        <CardContent className="p-6 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/30"
              >
                <PeriodIcon className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {greeting}, {displayName}
                </motion.h1>
                <p className="text-white/90 text-lg">
                  {welcomeMessage}
                </p>
              </div>
            </div>
            {showDate && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3 text-white/90 text-lg backdrop-blur-sm"
              >
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}