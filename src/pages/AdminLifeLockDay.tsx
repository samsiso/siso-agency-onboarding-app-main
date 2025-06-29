import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar,
  Plus,
  Sun,
  Target,
  Dumbbell,
  Heart,
  Coffee,
  Moon,
  ChevronRight,
  ChevronLeft,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addDays, subDays } from 'date-fns';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

interface MorningRoutineItem {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  logField?: string;
}

interface Goal {
  id: string;
  title: string;
  completed: boolean;
  target?: string;
}

interface WorkoutItem {
  id: string;
  title: string;
  completed: boolean;
  target?: string;
  logged?: string;
}

interface HealthItem {
  id: string;
  title: string;
  completed: boolean;
}

const AdminLifeLockDay: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const currentDate = dateParam ? new Date(dateParam) : new Date();
  
  // Morning Routine Data
  const [morningRoutine, setMorningRoutine] = useState<MorningRoutineItem[]>([
    { id: '1', title: 'Wake Up', completed: false, description: 'Start the day before midday to maximize productivity.' },
    { id: '2', title: 'Get Blood Flowing (5 min)', completed: false, description: 'Max rep push-ups (Target PB: 30).', logField: 'Log reps: ____' },
    { id: '3', title: 'Hydrate (5 min)', completed: false, description: 'Drink 500 ml water to start the day.' },
    { id: '4', title: 'Supplements & Pre-Workout (5 min)', completed: false, description: 'Take omega-3, multivitamin, ashwagandha, and pre-workout.' },
    { id: '5', title: 'Shower & Brush Teeth (25 min)', completed: false, description: 'Cold shower to wake up.' },
    { id: '6', title: 'Review & Plan Day (15 min)', completed: false, description: 'Go through tasks, prioritize, and allocate time slots.' },
    { id: '7', title: 'Meditation (2 min)', completed: false, description: 'Meditate to set an innovative mindset for creating business value.' }
  ]);

  // Goals Data
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Put on 5 kg', completed: false, target: 'part of your 10 kg gain over 6 months; 5 kg by end of 75 days' },
    { id: '2', title: 'Have court stuff sorted, ready for community service', completed: false },
    { id: '3', title: 'Automated a process for app dev', completed: false },
    { id: '4', title: 'Built systems to manage sales team', completed: false },
    { id: '5', title: 'Have 10 salespeople', completed: false },
    { id: '6', title: 'Have 3k in crypto', completed: false },
    { id: '7', title: 'Have Mac Mini M4 setup', completed: false },
    { id: '8', title: '24.9k in the pipeline', completed: false },
    { id: '9', title: 'Stuck to no smoking THC 95% of the time', completed: false },
    { id: '10', title: 'Obtain driver\'s license before Bali', completed: false }
  ]);

  // Deep Focus Work Tasks
  const [deepFocusTasks, setDeepFocusTasks] = useState<TaskItem[]>([
    { id: '1', title: 'Get cursor student working', completed: false },
    { id: '2', title: 'Create Document for Corsa Student Account Verification', completed: false },
    { id: '3', title: 'Kodex Autonomous Editor – test codex on a prompt and compare same issues to cursor', completed: false },
    { id: '4', title: 'Analyze Anthropic Prompt Engineering Masterclass', completed: false },
    { id: '5', title: 'Research into what we can use to automate cursor intelligently automated', completed: false },
    { id: '6', title: 'Crypto Guide Payment Follow-Up', completed: false }
  ]);

  // Light Focus Work Tasks
  const [lightFocusTasks, setLightFocusTasks] = useState<TaskItem[]>([
    { id: '1', title: '', completed: false },
    { id: '2', title: '', completed: false },
    { id: '3', title: '', completed: false },
    { id: '4', title: '', completed: false },
    { id: '5', title: '', completed: false }
  ]);

  // Workout Data
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>([
    { id: '1', title: '200 Push-ups', completed: false, logged: '' },
    { id: '2', title: '100 Sit-ups', completed: false, logged: '' },
    { id: '3', title: '100 Dips', completed: false, logged: '' },
    { id: '4', title: '50 Pull-ups', completed: false, logged: '' },
    { id: '5', title: 'Gym/Training (45 min)', completed: false, target: 'Progressive strength training (e.g., 3–5 sets, 8–12 reps, squats, bench) or boxing.' },
    { id: '6', title: 'Outdoor Activity (15 min)', completed: false, logged: '' }
  ]);

  // Health Non-Negotiables
  const [healthItems, setHealthItems] = useState<HealthItem[]>([
    { id: '1', title: 'Supplements', completed: false },
    { id: '2', title: 'Protein Shake (1k Cals)', completed: false },
    { id: '3', title: '2L milk', completed: false },
    { id: '4', title: '2L Water', completed: false },
    { id: '5', title: 'Gym', completed: false },
    { id: '6', title: 'Steam + Sauna', completed: false }
  ]);

  // Meal tracking
  const [meals, setMeals] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
    snacks: ''
  });

  const [dailyTotals, setDailyTotals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  // Screen time and habits
  const [habits, setHabits] = useState({
    bullshitContentTime: '',
    noWeed: false,
    noScrolling: false
  });

  // Nightly checkout
  const [nightlyCheckout, setNightlyCheckout] = useState({
    wentWell: ['', '', ''],
    evenBetterIf: ['', '', '', '', ''],
    analysis: ['', '', ''],
    patterns: ['', '', ''],
    changes: ['', '', '']
  });

  const [workHours, setWorkHours] = useState({
    deepFocus: '',
    lightFocus: ''
  });

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);
    navigate(`/admin/life-lock/day?date=${format(newDate, 'yyyy-MM-dd')}`);
  };

  const toggleItem = (items: any[], setItems: Function, id: string) => {
    setItems(items.map((item: any) => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateItemField = (items: any[], setItems: Function, id: string, field: string, value: string) => {
    setItems(items.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-siso-bg">
        <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 space-y-6" style={{ backgroundColor: '#252525' }}>
          
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/life-lock')}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Calendar
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDay('prev')}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDay('next')}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Page Title */}
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-white mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </motion.h1>

          {/* Cards Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Morning Routine Card */}
            <Card className="bg-orange-900/20 border-orange-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-400">
                <Sun className="h-5 w-5 mr-2" />
                🌅 Morning Routine
              </CardTitle>
              <div className="border-t border-gray-600 my-4"></div>
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Coding My Brain</h3>
                <p className="text-gray-300 text-sm">
                  I am Shaan Sisodia. I have been given divine purpose, and on this mission, temptation awaits on either side of the path. 
                  When I give in to temptation, I shall know I am astray. I will bring my family to a new age of freedom. 
                  I will not be distracted from the path.
                </p>
                <div className="border-t border-gray-600 my-4"></div>
                <h3 className="font-semibold text-white">Flow State Rules</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• No use of apps other than Notion.</li>
                  <li>• No vapes or drugs (including weed).</li>
                  <li>• No more than 5 seconds until the next action.</li>
                </ul>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {morningRoutine.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(morningRoutine, setMorningRoutine, item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.title}</h4>
                      {item.description && (
                        <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                      )}
                      {item.logField && (
                        <Input
                          placeholder={item.logField}
                          className="mt-2 bg-gray-600 border-gray-500 text-white text-sm"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

            {/* Goals Card */}
            <Card className="bg-blue-900/20 border-blue-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-400">
                <Target className="h-5 w-5 mr-2" />
                💡 GOALS
              </CardTitle>
              <div className="border-t border-gray-600 my-4"></div>
              <h3 className="font-semibold text-white text-center">End of 75 Days hard</h3>
              <div className="border-t border-gray-600 my-4"></div>
              <h3 className="font-semibold text-white">Goals Overview</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded">
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => toggleItem(goals, setGoals, goal.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{goal.title}</h4>
                      {goal.target && (
                        <p className="text-gray-400 text-sm mt-1">({goal.target})</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

            {/* Deep Focus Work Session Card */}
            <Card className="bg-purple-900/20 border-purple-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-400">
                <Brain className="h-5 w-5 mr-2" />
                🌅 Deep Focus Work Session
              </CardTitle>
              <div className="border-t border-gray-600 my-4"></div>
              <p className="text-gray-300 text-sm">
                Tasks that require the most focus to create the most value. (8 hr minimum)
              </p>
              <div className="border-t border-gray-600 my-4"></div>
              <div className="space-y-2">
                <label className="text-white font-medium">Total Work Hours Logged:</label>
                <Input
                  value={workHours.deepFocus}
                  onChange={(e) => setWorkHours(prev => ({ ...prev, deepFocus: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter hours..."
                />
              </div>
              <div className="border-t border-gray-600 my-4"></div>
              <h3 className="font-semibold text-white">Main Tasks:</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deepFocusTasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleItem(deepFocusTasks, setDeepFocusTasks, task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Input
                        value={task.title}
                        onChange={(e) => updateItemField(deepFocusTasks, setDeepFocusTasks, task.id, 'title', e.target.value)}
                        className="bg-transparent border-none text-white p-0 focus:ring-0"
                        placeholder="Enter task..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Light Focus Work Session Card */}
          <Card className="bg-green-900/20 border-green-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-400">
                <Coffee className="h-5 w-5 mr-2" />
                🌅 Light Focus Work Session
              </CardTitle>
              <div className="border-t border-gray-600 my-4"></div>
              <p className="text-gray-300 text-sm">
                Tackle tasks that don't require as much cognitive load.
              </p>
              <div className="border-t border-gray-600 my-4"></div>
              <div className="space-y-2">
                <label className="text-white font-medium">Total Work Hours Logged:</label>
                <Input
                  value={workHours.lightFocus}
                  onChange={(e) => setWorkHours(prev => ({ ...prev, lightFocus: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter hours..."
                />
              </div>
              <div className="border-t border-gray-600 my-4"></div>
              <h3 className="font-semibold text-white">Main Tasks:</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lightFocusTasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleItem(lightFocusTasks, setLightFocusTasks, task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Input
                        value={task.title}
                        onChange={(e) => updateItemField(lightFocusTasks, setLightFocusTasks, task.id, 'title', e.target.value)}
                        className="bg-transparent border-none text-white p-0 focus:ring-0"
                        placeholder="Enter task..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Home Workout Objective Card */}
          <Card className="bg-red-900/20 border-red-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-400">
                <Dumbbell className="h-5 w-5 mr-2" />
                🌅 🏋️‍♂️ Home Workout Objective
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workoutItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(workoutItems, setWorkoutItems, item.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{item.title}</h4>
                      {item.target && (
                        <p className="text-gray-400 text-sm mt-1">{item.target}</p>
                      )}
                      {item.logged !== undefined && (
                        <Input
                          value={item.logged}
                          onChange={(e) => updateItemField(workoutItems, setWorkoutItems, item.id, 'logged', e.target.value)}
                          placeholder="Log your result..."
                          className="mt-2 bg-gray-600 border-gray-500 text-white text-sm"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Health Non Negotiables Card */}
          <Card className="bg-pink-900/20 border-pink-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-pink-400">
                <Heart className="h-5 w-5 mr-2" />
                🌅 Health Non Negotiables
              </CardTitle>
              <div className="border-t border-gray-600 my-4"></div>
              <p className="text-gray-300 text-sm">Main Tasks:</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(healthItems, setHealthItems, item.id)}
                    />
                    <span className="text-white">{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-600 my-6"></div>
              
              {/* Daily Calorie & Macro Tracker */}
              <h3 className="font-semibold text-white mb-4">Daily Calorie & Macro Tracker</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-white text-sm font-medium">Breakfast:</label>
                  <Textarea
                    value={meals.breakfast}
                    onChange={(e) => setMeals(prev => ({ ...prev, breakfast: e.target.value }))}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter breakfast details..."
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium">Lunch:</label>
                  <Textarea
                    value={meals.lunch}
                    onChange={(e) => setMeals(prev => ({ ...prev, lunch: e.target.value }))}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter lunch details..."
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium">Dinner:</label>
                  <Textarea
                    value={meals.dinner}
                    onChange={(e) => setMeals(prev => ({ ...prev, dinner: e.target.value }))}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter dinner details..."
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium">Snacks:</label>
                  <Textarea
                    value={meals.snacks}
                    onChange={(e) => setMeals(prev => ({ ...prev, snacks: e.target.value }))}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter snack details..."
                  />
                </div>
              </div>

              <div className="border-t border-gray-600 my-4"></div>
              
              <h4 className="font-semibold text-white mb-3">Daily Totals:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-white text-sm">Total Calories:</label>
                  <Input
                    value={dailyTotals.calories}
                    onChange={(e) => setDailyTotals(prev => ({ ...prev, calories: e.target.value }))}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-white text-sm">Total Protein:</label>
                  <Input
                    value={dailyTotals.protein}
                    onChange={(e) => setDailyTotals(prev => ({ ...prev, protein: e.target.value }))}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-white text-sm">Total Carbs:</label>
                  <Input
                    value={dailyTotals.carbs}
                    onChange={(e) => setDailyTotals(prev => ({ ...prev, carbs: e.target.value }))}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-white text-sm">Total Fats:</label>
                  <Input
                    value={dailyTotals.fats}
                    onChange={(e) => setDailyTotals(prev => ({ ...prev, fats: e.target.value }))}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Screen Time Limits Card */}
          <Card className="bg-yellow-900/20 border-yellow-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-400">
                💡 📱 Screen Time Limits
              </CardTitle>
              <p className="text-gray-300 text-sm">(No scrolling outside 1 hr bullshit content.)</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium">Bullshit Content (1 hr max): Log time:</label>
                  <Input
                    value={habits.bullshitContentTime}
                    onChange={(e) => setHabits(prev => ({ ...prev, bullshitContentTime: e.target.value }))}
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    placeholder="____ min (e.g., during dinner, 6:55 PM–7:55 PM.)"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={habits.noWeed}
                    onCheckedChange={(checked) => setHabits(prev => ({ ...prev, noWeed: !!checked }))}
                  />
                  <span className="text-white">No Weed, No Vapes: Adhered to? Yes/No</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={habits.noScrolling}
                    onCheckedChange={(checked) => setHabits(prev => ({ ...prev, noScrolling: !!checked }))}
                  />
                  <span className="text-white">No Scrolling: Adhered to? Yes/No</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nightly Check-Out Card */}
          <Card className="bg-indigo-900/20 border-indigo-700/50">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-400">
                <Moon className="h-5 w-5 mr-2" />
                🌅 Nightly Check-Out:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">1. What went well today?</h4>
                  <p className="text-gray-400 text-sm mb-3">(Write down at least three positive things that happened during the day)</p>
                  <div className="space-y-2">
                    {nightlyCheckout.wentWell.map((item, index) => (
                      <Input
                        key={index}
                        value={item}
                        onChange={(e) => {
                          const newArray = [...nightlyCheckout.wentWell];
                          newArray[index] = e.target.value;
                          setNightlyCheckout(prev => ({ ...prev, wentWell: newArray }));
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder={`Positive thing ${index + 1}...`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">2. Even better if...</h4>
                  <p className="text-gray-400 text-sm mb-3">(List areas where you could improve or things that could have gone better)</p>
                  <div className="space-y-2">
                    {nightlyCheckout.evenBetterIf.map((item, index) => (
                      <Input
                        key={index}
                        value={item}
                        onChange={(e) => {
                          const newArray = [...nightlyCheckout.evenBetterIf];
                          newArray[index] = e.target.value;
                          setNightlyCheckout(prev => ({ ...prev, evenBetterIf: newArray }));
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder={`Improvement area ${index + 1}...`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">3. Analysis & Improvement:</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">(Reflect on how you can improve in the areas mentioned in "Even better if...")</p>
                      <div className="space-y-2">
                        {nightlyCheckout.analysis.map((item, index) => (
                          <Textarea
                            key={index}
                            value={item}
                            onChange={(e) => {
                              const newArray = [...nightlyCheckout.analysis];
                              newArray[index] = e.target.value;
                              setNightlyCheckout(prev => ({ ...prev, analysis: newArray }));
                            }}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder={`Analysis point ${index + 1}...`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm mb-2">(Identify any patterns or behaviors that may be preventing you from achieving your goals)</p>
                      <div className="space-y-2">
                        {nightlyCheckout.patterns.map((item, index) => (
                          <Textarea
                            key={index}
                            value={item}
                            onChange={(e) => {
                              const newArray = [...nightlyCheckout.patterns];
                              newArray[index] = e.target.value;
                              setNightlyCheckout(prev => ({ ...prev, patterns: newArray }));
                            }}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder={`Pattern ${index + 1}...`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm mb-2">(Consider any changes you can make in your habits or environment to support improvement)</p>
                      <div className="space-y-2">
                        {nightlyCheckout.changes.map((item, index) => (
                          <Textarea
                            key={index}
                            value={item}
                            onChange={(e) => {
                              const newArray = [...nightlyCheckout.changes];
                              newArray[index] = e.target.value;
                              setNightlyCheckout(prev => ({ ...prev, changes: newArray }));
                            }}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder={`Change ${index + 1}...`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLifeLockDay;