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
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [userData, setUserData] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const handleGetStarted = () => {
    setCurrentState('auth');
  };

  const handleLogin = (type: 'student' | 'teacher', data: any) => {
    setUserType(type);
    setUserData(data);
    setCurrentState('dashboard');
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentState('quiz');
  };

  const handleQuizComplete = (score: number, coins: number, badge: string) => {
    // In real app, save to backend
    console.log('Quiz completed:', { score, coins, badge });
  };

  const handleLogout = () => {
    setCurrentState('welcome');
    setUserData(null);
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
