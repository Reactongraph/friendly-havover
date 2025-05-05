
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AuthProvider } from "./contexts/auth";
import Handover from "./pages/Handover";
import AIChat from "./pages/AIChat";
import Tasks from "./pages/Tasks";
import { useEffect, useState } from "react";
import { mockAccount } from "./data/mockData";

const queryClient = new QueryClient();

// Set the base URL for routing
const basename = import.meta.env.BASE_URL || "/";

const App = () => {
  // Initialize with mock account data
  const [account, setAccount] = useState(mockAccount);

  // Listen for user change events
  useEffect(() => {
    const handleUserChange = (event: CustomEvent) => {
      console.log("User changed event received:", event.detail);
      setAccount(event.detail.account);
    };

    window.addEventListener('userChanged', handleUserChange as EventListener);

    return () => {
      window.removeEventListener('userChanged', handleUserChange as EventListener);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter basename={basename}>
          <AuthProvider>
            {/* Pass the updated account to all routes that need it */}
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Navigate to="/handover" replace />} />
              <Route path="/handover" element={<Handover account={account} />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile account={account} />} />
              <Route path="/ai-chat" element={<AIChat account={account} />} />
              <Route path="/tasks" element={<Tasks account={account} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
