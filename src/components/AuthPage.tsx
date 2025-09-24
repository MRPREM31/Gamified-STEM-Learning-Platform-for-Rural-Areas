import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/ui/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, GraduationCap, Mail, School, Calendar, IdCard } from "lucide-react";

interface AuthPageProps {
  onBack: () => void;
  onLogin: (userType: 'student' | 'teacher', userData: any) => void;
}

const AuthPage = ({ onBack, onLogin }: AuthPageProps) => {
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    class: "",
    dob: "",
    id: "",
    subjects: "General",
    experience: "0 years"
  });

  // Reset form when switching user type
  const handleUserTypeChange = (type: 'student' | 'teacher') => {
    setUserType(type);
    setFormData(prev => ({
      ...prev,
      class: type === 'student' ? prev.class : '',
      dob: type === 'student' ? prev.dob : '',
      subjects: type === 'teacher' ? prev.subjects : '',
      experience: type === 'teacher' ? prev.experience : ''
    }));
  };

  const generateId = (name: string, dob: string) => {
    if (!name || !dob) return "";
    const dobParts = dob.split('-');
    const dayMonth = dobParts[2] + dobParts[1]; // DDMM format
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${name.split(' ')[0]}@${dayMonth}@${randomChars}`;
  };

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    if (field === 'name' || field === 'dob') {
      newData.id = generateId(newData.name, newData.dob);
    }
    setFormData(newData);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let userData = null;

    try {
      if (activeTab === "register") {
        // Validate required fields
        if (!formData.name || !formData.email || !formData.school) {
          alert("Please fill in all required fields");
          return;
        }

        // Generate password if not already set
        const password = formData.id || generateId(formData.name, formData.dob);
        if (!formData.id) {
          setFormData(prev => ({ ...prev, id: password }));
        }

        // Registration
        const res = await fetch("http://localhost:4000/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: password,
            type: userType,
            school: formData.school,
            ...(userType === 'student' ? {
              class: formData.class,
              dob: formData.dob
            } : {
              subjects: formData.subjects || 'General',
              experience: formData.experience || '0 years'
            })
          })
        });

        const response = await res.json();
        if (!res.ok) {
          throw new Error(response.error || 'Registration failed');
        }

        userData = response;
        alert(`Registration successful! Your ID: ${formData.id}\nPlease save this ID for login.`);
      } else {
        // Login
        if (!formData.email || !formData.id) {
          alert("Please enter both email and ID");
          return;
        }

        const res = await fetch("http://localhost:4000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.id,
            type: userType
          })
        });

        const response = await res.json();
        if (!res.ok) {
          throw new Error(response.error || 'Login failed');
        }

        userData = response;
      }

      // Only proceed with login if we have user data
      if (userData && !userData.error) {
        onLogin(userType, userData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Operation failed";
      alert(errorMessage);
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="storybook-page max-w-md w-full rounded-3xl p-8 book-open relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <Button
          variant="ghost"
          onClick={onBack}
          className="absolute top-4 left-4 p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">Choose your learning journey</p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant={userType === 'student' ? 'default' : 'outline'}
            onClick={() => handleUserTypeChange('student')}
            className="flex flex-col gap-2 h-auto py-4"
          >
            <GraduationCap className="w-6 h-6" />
            <span>Student</span>
          </Button>
          <Button
            variant={userType === 'teacher' ? 'default' : 'outline'}
            onClick={() => handleUserTypeChange('teacher')}
            className="flex flex-col gap-2 h-auto py-4"
          >
            <User className="w-6 h-6" />
            <span>Teacher</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="loginEmail">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="loginId">
                  <IdCard className="w-4 h-4 inline mr-2" />
                  {userType === 'student' ? 'Student' : 'Teacher'} ID
                </Label>
                <Input
                  id="loginId"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  placeholder="Enter your ID"
                  required
                />
              </div>
              <Button type="submit" className="w-full" variant="hero">
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {userType === 'student' && (
                <div>
                  <Label htmlFor="class">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    Class
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('class', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">Class 6</SelectItem>
                      <SelectItem value="7">Class 7</SelectItem>
                      <SelectItem value="8">Class 8</SelectItem>
                      <SelectItem value="9">Class 9</SelectItem>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="11">Class 11</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="dob">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="school">
                  <School className="w-4 h-4 inline mr-2" />
                  School Name
                </Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  placeholder="Enter your school name"
                  required
                />
              </div>

              {formData.id && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Label className="text-sm font-medium text-primary">
                    Generated ID: <span className="font-mono">{formData.id}</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please save this ID for future logins
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" variant="hero">
                Register & Send OTP
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AuthPage;