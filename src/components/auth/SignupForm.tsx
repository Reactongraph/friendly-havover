
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2, Mail, KeyRound, User, ShieldCheck, Sparkles } from 'lucide-react';

// Define schema for type safety
const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SignupFormProps {
  onSubmit: (values: z.infer<typeof signupSchema>) => Promise<void>;
  isSubmitting: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isSubmitting }) => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-1 rounded-lg border border-purple-300/20 bg-white/5 backdrop-blur-sm shadow-inner">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-0">
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-500/20 p-2 rounded-l-md border-r border-purple-300/20 h-11 flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-200" />
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      {...field} 
                      className="border-0 bg-transparent text-white dark:text-white text-black placeholder:text-purple-200/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-11" 
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
                      className="border-0 bg-transparent text-black dark:text-white placeholder:text-purple-200/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-11" 
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
                      className="border-0 bg-transparent text-black dark:text-white placeholder:text-purple-200/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-11" 
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
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mb-0">
                <div className="flex items-center space-x-2">
                  <div className="bg-purple-500/20 p-2 rounded-l-md border-r border-purple-300/20 h-11 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-purple-200" />
                  </div>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="border-0 bg-transparent text-black dark:text-white placeholder:text-purple-200/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-11" 
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-pink-300 ml-2 mt-1" />
              </FormItem>
            )}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-purple-700/20 border border-white/10 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Create Account
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
