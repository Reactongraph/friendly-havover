
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
import { FolderTree, FileText, ChevronRight, Building } from 'lucide-react';

const DatabasePage = () => {
  const modules = [
    {
      id: 'categories',
      title: 'Categories',
      description: 'Manage knowledge base categories and hierarchy',
      icon: <FolderTree className="h-10 w-10 text-primary" />,
      link: '/database/categories',
    },
    {
      id: 'content',
      title: 'Content',
      description: 'Create and manage knowledge base articles',
      icon: <FileText className="h-10 w-10 text-indigo-500" />,
      link: '/database/content',
      disabled: true,
    },
    {
      id: 'properties',
      title: 'Properties',
      description: 'Manage hotel properties and settings',
      icon: <Building className="h-10 w-10 text-orange-500" />,
      link: '/database/properties',
      disabled: true,
    },
  ];

  return (
    <LayoutWithAuth>
      <div className="container mx-auto py-6">
        <div className="mb-8 relative">
          <div className="absolute -top-14 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s', animationDuration: '7s' }} />
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Data Management</h1>
          <p className="text-muted-foreground mt-2 text-lg">Organize and manage your knowledge base data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className={`border-border/40 hover:shadow-md transition-all duration-300 ${module.disabled ? 'opacity-60' : 'hover:border-primary/40'}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  {module.icon}
                  {!module.disabled && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                </div>
                <CardTitle className="mt-4">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                {module.disabled ? (
                  <Button variant="outline" disabled>Coming Soon</Button>
                ) : (
                  <Button asChild>
                    <Link to={module.link}>Manage {module.title}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </LayoutWithAuth>
  );
};

export default DatabasePage;
