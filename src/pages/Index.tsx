
import React from 'react';
import { Link } from 'react-router-dom';
import LayoutWithAuth from '@/components/layout/LayoutWithAuth';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Database, Settings, UserCircle, ChevronRight } from 'lucide-react';

const Index = () => {
  const modules = [
    {
      id: 'database',
      title: 'Knowledge Base',
      description: 'Manage your hotel knowledge base categories and content',
      icon: <Database className="h-10 w-10 text-primary" />,
      link: '/database'
    },
    {
      id: 'profile',
      title: 'My Profile',
      description: 'Manage your personal profile and preferences',
      icon: <UserCircle className="h-10 w-10 text-indigo-500" />,
      link: '/profile'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure application settings and preferences',
      icon: <Settings className="h-10 w-10 text-orange-500" />,
      link: '/settings'
    }
  ];

  return (
    <LayoutWithAuth>
      <div className="container mx-auto py-6">
        <div className="mb-8 relative">
          <div className="absolute -top-14 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s', animationDuration: '7s' }} />
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Hotel Knowledge Base</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage and organize your hotel's knowledge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className="border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  {module.icon}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link to={module.link}>Go to {module.title}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </LayoutWithAuth>
  );
};

export default Index;
