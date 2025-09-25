import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/ui/footer";
import { addCoins } from "@/lib/userStats";
import { 
  ArrowLeft, 
  Clock, 
  Trophy, 
  Coins,
  Star,
  RotateCcw,
  BookOpen,
  BrainCircuit
} from "lucide-react";

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  points: number;
  explanation: string;
  difficulty_level: string;
  quiz_id: number;
}

interface Quiz {
  id: number;
  subject_id: number;
  title: string;
  description: string;
  difficulty_level: string;
  class: string;
}

interface QuizPageProps {
  userId: number;
  subject: string;
  userClass: string;
  onBack: () => void;
  onComplete: (score: number, coins: number, badge: string) => void;
}

const QuizPage = ({ userId, subject, userClass, onBack, onComplete }: QuizPageProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Fetch available quizzes for the subject
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // First get the subject ID from name
        const subjectRes = await fetch(`http://localhost:4000/api/subjects`);
        const subjects = await subjectRes.json();
        const subjectId = subjects.find((s: any) => s.name.toLowerCase() === subject.toLowerCase())?.id;
        
        if (!subjectId) {
          throw new Error('Subject not found');
        }

        const res = await fetch(`http://localhost:4000/api/quizzes/subject/${subjectId}/class/${encodeURIComponent(userClass)}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!res.ok) {
          console.error('Server response:', await res.text());
          throw new Error('Failed to fetch quizzes');
        }
        
        const quizzes = await res.json();
        console.log('Fetched quizzes:', quizzes);
        setAvailableQuizzes(Array.isArray(quizzes) ? quizzes : []);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setAvailableQuizzes([]);
      }
    };
    if (subject && userClass) {
      fetchQuizzes();
    }
  }, [subject, userClass]);

  // Fetch questions when a quiz is selected
  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedQuiz) {
        try {
          console.log('Fetching questions for quiz:', selectedQuiz.id);
          const res = await fetch(`http://localhost:4000/api/questions/quiz/${selectedQuiz.id}`);
          if (!res.ok) {
            console.error('Server response:', await res.text());
            throw new Error('Failed to fetch questions');
          }
          const fetchedQuestions = await res.json();
          console.log('Fetched questions:', fetchedQuestions);
          if (Array.isArray(fetchedQuestions)) {
            setQuestions(fetchedQuestions);
            setTotalPoints(fetchedQuestions.reduce((sum: number, q: Question) => sum + q.points, 0));
            resetQuiz();
          } else {
            throw new Error('Invalid questions data received');
          }
        } catch (err) {
          console.error('Error fetching questions:', err);
          setQuestions([]);
        }
      }
    };
    fetchQuestions();
  }, [selectedQuiz]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleComplete();
    }
  }, [timeLeft, quizCompleted]);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setScore(0);
    setTimeLeft(300);
    setQuizCompleted(false);
    setShowResult(false);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null || quizCompleted) return;
    setSelectedAnswer(answer);
    setAnswers(prev => [...prev, answer]);

    const currentQ = questions[currentQuestion];
    if (answer === currentQ.correct_answer) {
      setScore(prev => prev + currentQ.points);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const percentage = (score / totalPoints) * 100;
    let badge = 'bronze';
    if (percentage >= 80) badge = 'gold';
    else if (percentage >= 60) badge = 'silver';

    const coins = Math.floor(score * 5); // 5 coins per point

    // Save result to backend
    if (selectedQuiz) {
      try {
        const response = await fetch("http://localhost:4000/api/quiz-results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: userId,
            quizId: selectedQuiz.id,
            score,
            coinsEarned: coins,
            badge,
            completedAt: new Date().toISOString()
          })
        });
        if (!response.ok) {
          throw new Error('Failed to save quiz results');
        }
      } catch (err) {
        console.error('Error saving results:', err);
      }
    }

    setQuizCompleted(true);
    setShowResult(true);
    
    // Add coins to user stats
    const updatedStats = addCoins(coins);
    
    onComplete(score, coins, badge);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
        <div className="flex-1 p-6">
          <Button variant="outline" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subjects
          </Button>
          
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Select a Quiz</h2>
          </div>
          
          <div className="grid gap-4">
            {availableQuizzes.map((quiz) => (
              <Card key={quiz.id} className="p-6 cursor-pointer hover:bg-accent transition-colors" onClick={() => setSelectedQuiz(quiz)}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{quiz.title}</h3>
                  <Badge className="bg-blue-500">
                    {quiz.difficulty_level}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{quiz.description}</p>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (showResult) {
    const percentage = (score / totalPoints) * 100;
    const earnedPoints = Math.round(percentage);
    let badge;
    let badgeColor;
    
    if (earnedPoints >= 80) {
      badge = 'gold';
      badgeColor = 'text-yellow-500';
    } else if (earnedPoints >= 60) {
      badge = 'silver';
      badgeColor = 'text-gray-400';
    } else {
      badge = 'bronze';
      badgeColor = 'text-orange-600';
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
        <div className="flex-1 p-6">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${badgeColor}`} />

            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-xl mb-6">
              You scored {score} out of {totalPoints} points ({earnedPoints}%)
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center">
                <Coins className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-muted-foreground">Coins Earned</p>
                <p className="text-2xl font-bold">{score * 5}</p>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Badge Earned</p>
                <Badge className={badgeColor}>{badge}</Badge>
              </div>
            </div>

            <div className="space-x-4">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
              <Button onClick={() => {
                setSelectedQuiz(null);
                resetQuiz();
              }}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Another Quiz
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
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => setSelectedQuiz(null)}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Quizzes
          </Button>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">{selectedQuiz?.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of 10
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold mb-1">
                  Score: {score}
                  <span className="text-muted-foreground">/{totalPoints}</span>
                </p>
              </div>
            </div>
            <Progress value={(currentQuestion / questions.length) * 100} className="h-2" />
          </div>
        </Card>

        {/* Question Card */}
        {questions[currentQuestion] && (
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {questions[currentQuestion].question_text}
                  </h3>
                </div>
                <Badge className="ml-4 bg-blue-500">
                  {questions[currentQuestion].points} points
                </Badge>
              </div>

              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 h-auto text-left justify-start text-lg ${
                      selectedAnswer !== null ? 
                        option === questions[currentQuestion].correct_answer ?
                          'bg-green-500/20 hover:bg-green-500/20' :
                          selectedAnswer === option ?
                            'bg-red-500/20 hover:bg-red-500/20' :
                            '' :
                        ''
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {selectedAnswer && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="mb-4"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                  </Button>

                  {showExplanation && (
                    <Card className="p-4 bg-muted border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <h4 className="font-semibold">Explanation:</h4>
                      </div>
                      <p className="text-muted-foreground">{questions[currentQuestion].explanation}</p>
                    </Card>
                  )}
                </div>
              )}

              {selectedAnswer !== null && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNextQuestion}>
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizPage;