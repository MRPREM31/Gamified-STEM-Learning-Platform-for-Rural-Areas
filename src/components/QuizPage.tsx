import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/ui/footer";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Coins,
  Star,
  RotateCcw
} from "lucide-react";

interface QuizPageProps {
  subject: string;
  userClass: string;
  onBack: () => void;
  onComplete: (score: number, coins: number, badge: string) => void;
}

const QuizPage = ({ subject, userClass, onBack, onComplete }: QuizPageProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  // Fetch questions from backend on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/quizzes`);
        const quizzes = await res.json();
        // Filter all quizzes for the selected subject
        const subjectQuizzes = quizzes.filter((q: any) => q.subject === subject);
        // Combine all questions from matching quizzes
        const allQuestions = subjectQuizzes.reduce((acc: any[], quiz: any) => {
          const quizQuestions = JSON.parse(quiz.questions);
          return [...acc, ...quizQuestions];
        }, []);
        setQuestions(allQuestions);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setQuestions([]);
      }
    };
    fetchQuiz();
  }, [subject, userClass]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleQuizComplete();
    }
  }, [timeLeft, quizCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = useCallback(async () => {
    setQuizCompleted(true);
    setShowResult(true);
    const finalScore = selectedAnswer !== null && selectedAnswer === questions[currentQuestion]?.correct
      ? score + 1
      : score;
    const coins = finalScore * 10;
    let badge = 'bronze';
    if (finalScore >= 8) badge = 'gold';
    else if (finalScore >= 5) badge = 'silver';

    // Save result to backend
    try {
      await fetch("http://localhost:4000/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, // TODO: pass actual user id from props/context
          quiz_id: 1, // TODO: pass actual quiz id from backend
          score: finalScore,
          coins,
          badge
        })
      });
    } catch (err) {}

    onComplete(finalScore, coins, badge);
  }, [selectedAnswer, questions, currentQuestion, score, onComplete]);

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(300);
    setQuizCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      default: return 'bg-gradient-to-r from-orange-400 to-orange-600';
    }
  };

  if (showResult) {
    const finalScore = score;
    const coins = finalScore * 10;
    let badge = 'bronze';
    if (finalScore >= 8) badge = 'gold';
    else if (finalScore >= 5) badge = 'silver';

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center book-open">
            <div className={`w-20 h-20 rounded-full ${getBadgeColor(badge)} flex items-center justify-center mx-auto mb-6 badge-bounce`}>
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-primary mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground mb-6">Great job on completing the {subject} quiz!</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <span className="font-medium">Score</span>
                <span className="text-2xl font-bold text-primary">{finalScore}/5</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                <span className="font-medium">Coins Earned</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-5 h-5 text-secondary coin-spin" />
                  <span className="text-2xl font-bold text-secondary">{coins}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                <span className="font-medium">Badge Earned</span>
                <Badge className={`${getBadgeColor(badge)} text-white capitalize`}>
                  {badge}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button onClick={handleRestart} variant="outline" className="w-full">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={onBack} variant="hero" className="w-full">
                <Star className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="secondary" className="capitalize">
                {subject} Quiz
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <span className="text-sm text-muted-foreground">
                Score: {score}/{questions.length}
              </span>
            </div>
            <Progress value={(currentQuestion / questions.length) * 100} className="h-2" />
          </Card>

          {/* Question */}
          <Card className="p-8 book-open">
            {questions && questions[currentQuestion] ? (
              <>
                <h3 className="text-2xl font-semibold mb-8 text-center">
                  {questions[currentQuestion].question}
                </h3>
                <div className="grid gap-4 mb-8">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      onClick={() => handleAnswerSelect(index)}
                      className="p-6 h-auto text-left justify-start text-lg"
                    >
                      <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4 font-semibold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    variant="hero"
                    size="lg"
                    className="px-8"
                  >
                    {currentQuestion + 1 === questions.length ? 'Complete Quiz' : 'Next Question'}
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <h3 className="text-center text-muted-foreground text-lg">No questions available.</h3>
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default QuizPage;