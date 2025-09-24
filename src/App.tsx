import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import WelcomePage from "./components/WelcomePage";
import AuthPage from "./components/AuthPage"; 
import Dashboard from "./components/Dashboard";
import QuizPage from "./components/QuizPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type AppState = 'welcome' | 'auth' | 'dashboard' | 'quiz';

const App = () => {
  // Initialize state from localStorage if available
  const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const [currentState, setCurrentState] = useState<AppState>(savedUser ? 'dashboard' : 'welcome');
  const [userType, setUserType] = useState<'student' | 'teacher'>(savedUser?.type || 'student');
  const [userData, setUserData] = useState<any>(savedUser?.data || null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const handleGetStarted = () => {
    setCurrentState('auth');
  };

  const handleLogin = (type: 'student' | 'teacher', data: any) => {
    setUserType(type);
    setUserData(data);
    setCurrentState('dashboard');
    // Save user data to localStorage for persistence
    localStorage.setItem('user', JSON.stringify({ type, data }));
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentState('quiz');
  };

  const handleQuizComplete = async (score: number, coins: number, badge: string) => {
    if (userData?.id) {
      try {
        const response = await fetch('http://localhost:4000/api/quiz-results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId: userData.id,
            score,
            coins,
            badge,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save quiz results');
        }
        
        // Update user data with new coins/badges if needed
        const updatedData = { ...userData, coins: (userData.coins || 0) + coins };
        setUserData(updatedData);
        localStorage.setItem('user', JSON.stringify({ type: userType, data: updatedData }));
      } catch (error) {
        console.error('Error saving quiz results:', error);
      }
    }
  };

  const handleLogout = () => {
    setCurrentState('welcome');
    setUserData(null);
    setUserType('student');
    localStorage.removeItem('user');
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
  };

  const handleBackToWelcome = () => {
    setCurrentState('welcome');
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'welcome':
        return <WelcomePage onGetStarted={handleGetStarted} />;
      case 'auth':
        return <AuthPage onBack={handleBackToWelcome} onLogin={handleLogin} />;
      case 'dashboard':
        return (
          <Dashboard 
            userType={userType}
            userData={userData}
            onSubjectSelect={handleSubjectSelect}
            onLogout={handleLogout}
          />
        );
      case 'quiz':
        return (
          <QuizPage
            userId={userData?.id}
            subject={selectedSubject}
            userClass={userData?.class || '6'}
            onBack={handleBackToDashboard}
            onComplete={handleQuizComplete}
          />
        );
      default:
        return <WelcomePage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={renderCurrentState()} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
