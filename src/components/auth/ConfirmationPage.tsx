import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('/path/to/pattern.svg')]"></div>
      
      <CardHeader className="space-y-2 pb-4 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-bl-full blur-sm"></div>
        
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600/20 to-indigo-600/20 flex items-center justify-center border border-white/20">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <CardTitle className="text-2xl text-center font-bold">
          Check Your Email
        </CardTitle>
        <CardDescription className="text-center text-purple-200">
          We've sent a confirmation link to your email address
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-6 relative z-10">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-purple-300" />
          </div>
          
          <div className="space-y-2">
            <p className="text-purple-100">
              Please check your email inbox and click on the confirmation link to verify your account.
            </p>
            <p className="text-sm text-purple-200/70">
              If you don't see the email, please check your spam folder.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={() => navigate('/auth')}
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-700/20 border border-white/10 transition-all duration-300"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-tr-full blur-sm"></div>
    </Card>
  );
};

export default ConfirmationPage; 