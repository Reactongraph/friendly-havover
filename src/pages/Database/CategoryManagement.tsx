
import React, { useState } from 'react';
import LayoutWithAuth from '@/components/layout/LayoutWithAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FolderTree, Plus, X } from 'lucide-react';
import { CategoryProvider, Category } from '@/contexts/CategoryContext';
import { CategoryViewTab } from '@/components/database/CategoryViewTab';
import { CategoryFormTab } from '@/components/database/CategoryFormTab';
import { DeleteCategoryDialog } from '@/components/database/DeleteCategoryDialog';
import { useCategoryContext } from '@/contexts/CategoryContext';

const CategoryManagementContent = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  const { deleteCategory, deleteMutation } = useCategoryContext();

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setActiveTab('create');
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setActiveTab('view');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 relative">
        <div className="absolute -top-14 -left-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -bottom-20 -right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s', animationDuration: '7s' }} />
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Category Management</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your knowledge base categories</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-[400px] grid-cols-2 bg-black/5 dark:bg-white/5 backdrop-blur-lg p-1">
            <TabsTrigger value="view" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FolderTree className="mr-2 h-4 w-4" />
              View Categories
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'view' && (
            <Button onClick={() => { setEditingCategory(null); setActiveTab('create'); }} className="bg-primary hover:bg-primary/90 group shadow-lg shadow-primary/20">
              <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
              Add Category
            </Button>
          )}
          
          {activeTab === 'create' && editingCategory && (
            <Button 
              variant="outline" 
              onClick={handleCancelEdit}
              className="border-border/50 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X size={16} className="mr-2" />
              Cancel Edit
            </Button>
          )}
        </div>
        
        <TabsContent value="view" className="animate-fade-in">
          <CategoryViewTab 
            onEdit={handleEditCategory} 
            onDelete={handleDeleteCategory}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="create" className="animate-fade-in">
          <CategoryFormTab 
            editingCategory={editingCategory}
            setActiveTab={setActiveTab}
            setEditingCategory={setEditingCategory}
          />
        </TabsContent>
      </Tabs>
      
      <DeleteCategoryDialog
        open={isDeleteDialogOpen}
        category={categoryToDelete}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => {
          if (categoryToDelete) {
            deleteCategory(categoryToDelete.id);
          }
          setIsDeleteDialogOpen(false);
        }}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

const CategoryManagement = () => {
  return (
    <LayoutWithAuth>
      <CategoryProvider>
        <CategoryManagementContent />
      </CategoryProvider>
    </LayoutWithAuth>
  );
};

export default CategoryManagement;
