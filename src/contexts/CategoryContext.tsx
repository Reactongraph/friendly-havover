import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  description: string | null;
  ordering: number;
  account_id: string;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

interface CategoryContextType {
  categories: Category[] | undefined;
  categoryTree: Category[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  createCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'account_id'>) => void;
  updateCategory: (category: Partial<Category> & { id: number }) => void;
  deleteCategory: (id: number) => void;
  createMutation: {
    isPending: boolean;
  };
  updateMutation: {
    isPending: boolean;
  };
  deleteMutation: {
    isPending: boolean;
  };
  currentAccountId: string | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user, currentAccount } = useAuth();
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (currentAccount) {
      setCurrentAccountId(currentAccount.id);
    }
  }, [currentAccount]);

  const { data: categories, isLoading, isError, error } = useQuery({
    queryKey: ['categories', currentAccountId],
    queryFn: async () => {
      if (!currentAccountId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('account_id', currentAccountId)
        .order('ordering', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!currentAccountId
  });

  const buildCategoryTree = (categories: Category[] | undefined): Category[] => {
    if (!categories) return [];
    
    const categoryMap = new Map<number, Category>();
    const roots: Category[] = [];
    
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });
    
    categories.forEach(category => {
      const node = categoryMap.get(category.id);
      if (!node) return;
      
      if (category.parent_id === null) {
        roots.push(node);
      } else {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        }
      }
    });
    
    return roots;
  };

  const categoryTree = buildCategoryTree(categories);

  const createCategory = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'account_id'>) => {
      if (!currentAccountId) {
        throw new Error('No account selected');
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...category, account_id: currentAccountId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', currentAccountId] });
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create category: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateCategory = useMutation({
    mutationFn: async (category: Partial<Category> & { id: number }) => {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          parent_id: category.parent_id,
          description: category.description,
          ordering: category.ordering
        })
        .eq('id', category.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', currentAccountId] });
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update category: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', currentAccountId] });
      toast({
        title: "Category deleted",
        description: "The category and its subcategories have been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete category: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  React.useEffect(() => {
    if (!currentAccountId) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: `account_id=eq.${currentAccountId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['categories', currentAccountId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, currentAccountId]);

  const value: CategoryContextType = {
    categories,
    categoryTree,
    isLoading,
    isError,
    error: error as Error | null,
    createCategory: (data) => createCategory.mutate(data),
    updateCategory: (data) => updateCategory.mutate(data),
    deleteCategory: (id) => deleteCategory.mutate(id),
    createMutation: {
      isPending: createCategory.isPending,
    },
    updateMutation: {
      isPending: updateCategory.isPending,
    },
    deleteMutation: {
      isPending: deleteCategory.isPending,
    },
    currentAccountId
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
