import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, GraduationCap, Star, Award, Target } from "lucide-react";

interface WelcomePageProps {
  onGetStarted: () => void;
}

const WelcomePage = ({ onGetStarted }: WelcomePageProps) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleGetStarted = () => {
    setIsFlipping(true);
    setTimeout(() => {
      onGetStarted();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className={`storybook-page max-w-4xl w-full rounded-3xl p-8 book-open ${isFlipping ? 'page-flip' : ''}`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EduQuest
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Embark on an exciting STEM learning adventure! Gamified education designed for rural students to explore Science, Technology, Engineering, and Mathematics.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Interactive Learning</h3>
            <p className="text-muted-foreground">Engage with MCQs, quizzes, and interactive content across all STEM subjects</p>
          </Card>

          <Card className="p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Earn Rewards</h3>
            <p className="text-muted-foreground">Collect coins, earn badges, and unlock achievements as you progress</p>
          </Card>

          <Card className="p-6 text-center hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Teacher Support</h3>
            <p className="text-muted-foreground">Teachers can monitor progress, resolve doubts, and support student learning</p>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">1000+</div>
            <div className="text-sm text-muted-foreground">Practice Questions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-1">4</div>
            <div className="text-sm text-muted-foreground">STEM Subjects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-1">3</div>
            <div className="text-sm text-muted-foreground">Languages</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="btn-hero px-8 py-4 text-lg font-semibold"
          >
            <Star className="w-5 h-5 mr-2" />
            Start Your Quest
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join thousands of students already learning with EduQuest
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-10">
          <Target className="w-24 h-24 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;