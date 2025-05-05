import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BrandLogo from "@/components/auth/BrandLogo";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthCard from "@/components/auth/AuthCard";
import ConfirmationPage from "@/components/auth/ConfirmationPage";

// Define schemas for type safety
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      await signUp(values.email, values.password, { name: values.name });
      setShowConfirmation(true);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetPasswordSubmit = async (values: z.infer<typeof resetSchema>) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) {
        throw error;
      }

      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password",
      });

      setShowForgotPassword(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Password reset failed",
        description:
          (error as Error).message || "An error occurred during password reset",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthBackground />

      {/* Floating elements for additional visual interest */}
      <div
        className="absolute top-10 left-10 w-20 h-20 border border-white/10 rounded-full bg-white/5 backdrop-blur-xl z-10 animate-float"
        style={{ animationDuration: "20s" }}
      ></div>
      <div
        className="absolute bottom-10 right-10 w-32 h-32 border border-white/10 rounded-full bg-white/5 backdrop-blur-xl z-10 animate-float"
        style={{ animationDuration: "25s", animationDelay: "5s" }}
      ></div>

      {/* Shimmer effect lines */}
      <div className="absolute h-px w-1/2 top-1/3 left-0 auth-shimmer z-0"></div>
      <div className="absolute h-px w-1/3 bottom-1/3 right-0 auth-shimmer z-0"></div>

      <BrandLogo />
      <div className="max-w-md w-full mx-4 relative z-10">
        {showConfirmation ? (
          <ConfirmationPage />
        ) : (
          <AuthCard
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isSubmitting={isSubmitting}
            showForgotPassword={showForgotPassword}
            setShowForgotPassword={setShowForgotPassword}
            onLoginSubmit={onLoginSubmit}
            onSignupSubmit={onSignupSubmit}
            onResetPasswordSubmit={onResetPasswordSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
