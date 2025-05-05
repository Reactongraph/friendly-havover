
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCategoryContext, Category } from '@/contexts/CategoryContext';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  parent_id: z.string().optional(),
});

type CategoryFormProps = {
  categories: Category[];
  editingCategory: Category | null;
  onSubmit: (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading: boolean;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({ 
  categories, 
  editingCategory, 
  onSubmit, 
  isLoading 
}) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editingCategory?.name || '',
      description: editingCategory?.description || '',
      parent_id: editingCategory?.parent_id?.toString() || undefined,
    },
  });

  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        description: editingCategory.description || '',
        parent_id: editingCategory.parent_id?.toString() || undefined,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        parent_id: undefined,
      });
    }
  }, [editingCategory, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      onSubmit({
        name: values.name,
        description: values.description || null,
        parent_id: values.parent_id ? parseInt(values.parent_id) : null,
        ordering: 0, // Default value
        account_id: '', // This will be set by the context
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Optional description" 
                  {...field} 
                  value={field.value || ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category (Optional)</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                  value={field.value || ''}
                >
                  <option value="">No parent</option>
                  {categories
                    .filter(cat => !editingCategory || cat.id !== editingCategory.id)
                    .map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editingCategory ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            editingCategory ? 'Update Category' : 'Create Category'
          )}
        </Button>
      </form>
    </Form>
  );
};
