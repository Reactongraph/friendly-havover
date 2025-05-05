
import React from 'react';
import { FolderTree } from 'lucide-react';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { CategoryTree } from '@/components/database/CategoryTree';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CategoryViewTabProps {
  onEdit: (category: any) => void;
  onDelete: (category: any) => void;
  setActiveTab: (tab: string) => void;
}

export const CategoryViewTab: React.FC<CategoryViewTabProps> = ({ 
  onEdit, 
  onDelete, 
  setActiveTab 
}) => {
  const { categories, categoryTree, isLoading, isError, error } = useCategoryContext();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          Error loading categories: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (categories?.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <FolderTree className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">No categories yet</h3>
        <p className="text-muted-foreground mb-4">Start by creating your first category</p>
        <Button onClick={() => setActiveTab('create')} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Create First Category
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-border/50 backdrop-blur-sm bg-card/80 hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-border/20">
        <CardTitle className="text-xl text-indigo-500 flex items-center">
          <FolderTree className="mr-2 h-5 w-5 text-primary" />
          Category Hierarchy
        </CardTitle>
        <CardDescription>
          View, edit, or delete categories and subcategories for the knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <CategoryTree 
          categories={categoryTree} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </CardContent>
    </Card>
  );
};
