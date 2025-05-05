
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  description: string | null;
  ordering: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

interface CategoryTreeProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  level?: number;
}

export const CategoryTree: React.FC<CategoryTreeProps> = ({ 
  categories, 
  onEdit, 
  onDelete, 
  level = 0 
}) => {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const toggleExpand = (categoryId: number) => {
    setExpandedCategories((prev) => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isExpanded = (categoryId: number) => expandedCategories.includes(categoryId);

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="animate-fade-in" style={{ animationDelay: `${level * 0.05}s` }}>
          <div 
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/40 transition-all",
              level > 0 && "ml-6"
            )}
          >
            <div className="flex items-center">
              {category.children && category.children.length > 0 ? (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isExpanded(category.id) ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              ) : (
                <div className="w-8 h-8"></div>
              )}
              <div>
                <h4 className="font-medium">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-border/50 backdrop-blur-sm"
                onClick={() => onEdit(category)}
              >
                <Edit size={14} className="mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive hover:border-destructive"
                onClick={() => onDelete(category)}
              >
                <Trash2 size={14} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>

          {/* Render children if expanded */}
          {isExpanded(category.id) && category.children && category.children.length > 0 && (
            <div className="mt-2 pl-4 border-l-2 border-border/30 ml-4">
              <CategoryTree 
                categories={category.children} 
                onEdit={onEdit} 
                onDelete={onDelete}
                level={level + 1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
