
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, Mail, KeyRound } from 'lucide-react';

// Define schema for type safety
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

interface LoginFormProps {
  onSubmit: (values: z.infer<typeof loginSchema>) => Promise<void>;
  isSubmitting: boolean;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isSubmitting, onForgotPassword }) => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-1 rounded-lg border border-purple-300/20 bg-white/5 backdrop-blur-sm shadow-inner mb-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-0">
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-500/20 p-2 rounded-l-md border-r border-purple-300/20 h-11 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-purple-200" />
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
                      {...field} 
                      className="border-0 bg-transparent text-white placeholder:text-purple-200/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-11" 
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-pink-300 ml-2 mt-1" />
              </FormItem>
            )}
          />
        </div>
        
        <div className="p-1 rounded-lg border border-purple-300/20 bg-white/5 backdrop-blur-sm shadow-inner">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-0">
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-500/20 p-2 rounded-l-md border-r border-purple-300/20 h-11 flex items-center justify-center">
                    <KeyRound className="h-5 w-5 text-purple-200" />
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="border-0 bg-transparent text-white placeholder:text-purple-200/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-11" 
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-pink-300 ml-2 mt-1" />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="link" 
            className="text-purple-200 hover:text-purple-100 p-0 h-auto"
            onClick={onForgotPassword}
          >
            Forgot password?
          </Button>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-700/20 border border-white/10 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
