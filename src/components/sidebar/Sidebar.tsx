// components/sidebar/Sidebar.tsx

import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ClipboardCheck,
  Settings,
  LineChart,
  LogOut,
  Bot,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth";
import { AccountSwitcher } from "../layout/AccountSwitcher";
import { Button } from "@/components/ui/button";
import { useTeamMembers } from "@/hooks/useTeamMembers";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { teamMembers, currentUser, userSelected, changeUser } =
    useTeamMembers();

  const sidebarLinks = useMemo(
    () => [
      { path: "/handover", name: "Handover", icon: ClipboardCheck },
      { path: "/tasks", name: "Tasks", icon: CalendarCheck },
      { path: "/settings", name: "Settings", icon: Settings },
      { path: "/profile", name: "Profile", icon: LineChart },
    ],
    []
  );

  const isActive = (path: string) => location.pathname.startsWith(path);
  const handleClick = (id) => {
    console.log(id,'sidebar')
    changeUser(id);
    setIsUserDropdownOpen(false)
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-gradient-to-b from-sidebar to-sidebar/95 shadow-md border-r border-sidebar-border transition-all duration-300 ease-in-out">
      <div className="flex h-full flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-sidebar-border/50 bg-sidebar-accent/20">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              Agentic Inn
            </h1>
          </div>

          {/* User Dropdown */}
          <div className="relative px-4 py-3 border-b border-sidebar-border/50">
            <DropdownMenu
              open={isUserDropdownOpen}
              onOpenChange={setIsUserDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between p-2 rounded-md hover:bg-sidebar-accent/50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-sidebar-accent-foreground">
                      <span className="text-lg">
                        {currentUser?.avatar_type}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-sidebar-foreground">
                        {currentUser?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currentUser?.role || "Role"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-transform duration-300 text-sidebar-foreground",
                      isUserDropdownOpen && "rotate-180"
                    )}
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-[calc(100%_-_2rem)] mx-4 p-3 bg-background/95 backdrop-blur-sm border border-primary/20 shadow-md animate-in zoom-in-95 duration-200"
                sideOffset={10}
              >
                <p className="text-xs text-muted-foreground py-2 px-2">
                  Switch user
                </p>
                <div className="space-y-2 mt-2">
                  {teamMembers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleClick(user.id)}
                      className={cn(
                        "w-full flex items-center space-x-3 p-3 rounded-md hover:bg-primary/10 transition-colors duration-200",
                        user.id === userSelected && "bg-primary/10"
                      )}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary-foreground">
                        <span className="text-xl">{user.avatar_type}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.role}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-6 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-md transition-colors duration-200",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/30"
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(active ? "text-primary" : "opacity-70")}
                  />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-sidebar-border/50 bg-sidebar-accent/10 space-y-2">
          <AccountSwitcher />

          <Button
            className="w-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white hover:from-[#7E69AB] hover:to-[#6E59A5] transition-colors duration-300"
            onClick={() => (window.location.href = "/ai-chat")}
          >
            <Bot size={20} className="mr-2" />
            AI Concierge
          </Button>

          <button
            onClick={signOut}
            className="flex items-center space-x-3 w-full p-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/40 hover:text-red-500 transition-colors duration-200"
          >
            <LogOut size={20} className="opacity-70" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
