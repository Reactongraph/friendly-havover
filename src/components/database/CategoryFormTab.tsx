
import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryForm } from '@/components/database/CategoryForm';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { Category } from '@/contexts/CategoryContext';

interface CategoryFormTabProps {
  editingCategory: Category | null;
  setActiveTab: (tab: string) => void;
  setEditingCategory: (category: Category | null) => void;
}

export const CategoryFormTab: React.FC<CategoryFormTabProps> = ({ 
  editingCategory, 
  setActiveTab,
  setEditingCategory 
}) => {
  const { categories, createCategory, updateCategory, createMutation, updateMutation } = useCategoryContext();

  const handleSubmit = (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingCategory) {
      updateCategory({ ...data, id: editingCategory.id });
      setEditingCategory(null);
    } else {
      createCategory(data);
    }
    setActiveTab('view');
  };

  return (
    <Card className="border-border/50 backdrop-blur-sm bg-card/80 hover:shadow-md transition-all duration-300">
      <CardHeader className="border-b border-border/20">
        <CardTitle className="text-xl text-indigo-500 flex items-center">
          {editingCategory ? (
            <>
              <Edit className="mr-2 h-5 w-5 text-primary" />
              Edit Category
            </>
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5 text-primary" />
              Create New Category
            </>
          )}
        </CardTitle>
        <CardDescription>
          {editingCategory 
            ? "Update an existing category's details" 
            : "Add a new category to the knowledge base hierarchy"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <CategoryForm 
          categories={categories || []} 
          editingCategory={editingCategory}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </CardContent>
    </Card>
  );
};
