
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sparkles } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ResetPasswordForm from './ResetPasswordForm';
import { z } from 'zod';

// Define schemas for type safety
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email(),
});

interface AuthCardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSubmitting: boolean;
  showForgotPassword: boolean;
  setShowForgotPassword: (show: boolean) => void;
  onLoginSubmit: (values: z.infer<typeof loginSchema>) => Promise<void>;
  onSignupSubmit: (values: z.infer<typeof signupSchema>) => Promise<void>;
  onResetPasswordSubmit: (values: z.infer<typeof resetSchema>) => Promise<void>;
}

const AuthCard: React.FC<AuthCardProps> = ({
  activeTab,
  setActiveTab,
  isSubmitting,
  showForgotPassword,
  setShowForgotPassword,
  onLoginSubmit,
  onSignupSubmit,
  onResetPasswordSubmit,
}) => {
  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('/path/to/pattern.svg')]"></div>
      
      <CardHeader className="space-y-2 pb-4 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-bl-full blur-sm"></div>
        
        <CardTitle className="text-2xl text-center font-bold">
          {showForgotPassword ? 'Reset Password' : activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          <span className="inline-block ml-2 align-text-top">
            <Sparkles className="h-5 w-5 text-purple-300" />
          </span>
        </CardTitle>
        <CardDescription className="text-center text-purple-200">
          {showForgotPassword 
            ? 'Enter your email to receive a password reset link' 
            : activeTab === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Join Agentic Inn and explore AI possibilities'}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4 relative z-10">
        {showForgotPassword ? (
          <ResetPasswordForm 
            onSubmit={onResetPasswordSubmit} 
            isSubmitting={isSubmitting} 
            onBack={() => setShowForgotPassword(false)}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6 bg-purple-900/40 p-1 border border-purple-300/20">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-indigo-600/80 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-0 transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/80 data-[state=active]:to-indigo-600/80 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-0 transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-0 space-y-4 p-1">
              <LoginForm 
                onSubmit={onLoginSubmit} 
                isSubmitting={isSubmitting} 
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            </TabsContent>
            
            <TabsContent value="signup" className="mt-0 space-y-4 p-1">
              <SignupForm onSubmit={onSignupSubmit} isSubmitting={isSubmitting} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      {!showForgotPassword && activeTab === 'signup' && (
        <CardFooter className="px-6 pb-6 pt-0">
          <p className="text-xs text-purple-200/70 text-center w-full">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      )}
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-tr-full blur-sm"></div>
    </Card>
  );
};

export default AuthCard;
