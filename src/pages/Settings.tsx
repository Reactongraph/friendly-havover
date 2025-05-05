import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, ClipboardList } from "lucide-react";
import SettingsHeader from "@/components/settings/SettingsHeader";
import UserSection from "@/components/settings/UserSection";
import TaskSection from "@/components/settings/TaskSection";
import { useAuth } from "@/contexts/auth";
import StaffProvider from "@/contexts/StaffContext";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <SettingsHeader />

        <Tabs
          defaultValue="users"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="relative rounded-full p-1 backdrop-blur-md bg-background/40 border border-primary/20 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-indigo-500/5 rounded-full"></div>

              <TabsTrigger
                value="users"
                className="relative z-10 py-2.5 px-6 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-indigo-500/80 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="font-medium">Users</span>
              </TabsTrigger>

              <TabsTrigger
                value="tasks"
                className="relative z-10 py-2.5 px-6 rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-indigo-500/80 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                <span className="font-medium">Tasks</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users" className="animate-fade-in">
            <StaffProvider>
              <UserSection />
            </StaffProvider>
          </TabsContent>

          <TabsContent value="tasks" className="animate-fade-in">
            <TaskSection />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
