import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Cpu, 
  Cog, 
  Calculator, 
  Star, 
  Coins,
  Trophy,
  User,
  LogOut,
  Target
} from "lucide-react";

interface DashboardProps {
  userType: 'student' | 'teacher';
  userData: any;
  onSubjectSelect: (subject: string) => void;
  onLogout: () => void;
}

const Dashboard = ({ userType, userData, onSubjectSelect, onLogout }: DashboardProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const subjects = [
    {
      id: 'science',
      name: 'Science',
      icon: BookOpen,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      description: 'Physics, Chemistry, Biology'
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: Cpu,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      description: 'Computer Science, Digital Skills'
    },
    {
      id: 'engineering',
      name: 'Engineering',
      icon: Cog,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      description: 'Problem Solving, Design Thinking'
    },
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      description: 'Algebra, Geometry, Statistics'
    }
  ];

  const studentStats = {
    coins: 1250,
    badges: 8,
    level: 5,
    streak: 7,
    progress: 65
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Welcome back, {userData.name}! 
            </h1>
            <p className="text-muted-foreground">
              {userType === 'student' ? 'Ready for your next learning adventure?' : 'Monitor your students\' progress'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background"
            >
              <option value="english">🇬🇧 English</option>
              <option value="hindi">🇮🇳 हिंदी</option>
              <option value="odia">🏳 ଓଡ଼ିଆ</option>
            </select>
            
            <Button variant="ghost" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {userType === 'student' && (
          <>
            {/* Student Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 text-center">
                <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Coins className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold text-yellow-600">{studentStats.coins}</div>
                <div className="text-sm text-muted-foreground">Coins</div>
              </Card>

              <Card className="p-4 text-center">
                <div className="bg-gradient-to-br from-purple-400/10 to-purple-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-600">{studentStats.badges}</div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </Card>

              <Card className="p-4 text-center">
                <div className="bg-gradient-to-br from-blue-400/10 to-blue-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{studentStats.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </Card>

              <Card className="p-4 text-center">
                <div className="bg-gradient-to-br from-green-400/10 to-green-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-600">{studentStats.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </Card>
            </div>

            {/* Progress Card */}
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Your Learning Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{studentStats.progress}%</span>
                </div>
                <Progress value={studentStats.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Keep going! You're doing great!</span>
                  <span>{100 - studentStats.progress}% to next level</span>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Subjects Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {userType === 'student' ? 'Choose Your Subject' : 'Subject Overview'}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Card 
                  key={subject.id}
                  className="p-6 hover:scale-105 transition-transform duration-300 cursor-pointer group"
                  onClick={() => onSubjectSelect(subject.id)}
                >
                  <div className={`${subject.color} rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-center mb-2">{subject.name}</h3>
                  <p className="text-muted-foreground text-center text-sm mb-4">
                    {subject.description}
                  </p>
                  
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {userType === 'student' ? '10 MCQs' : 'Manage'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Interactive
                    </Badge>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity or Teacher Actions */}
        {userType === 'teacher' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <User className="w-6 h-6" />
                <span>Manage Students</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <Trophy className="w-6 h-6" />
                <span>View Top Performers</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Resolve Doubts</span>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;