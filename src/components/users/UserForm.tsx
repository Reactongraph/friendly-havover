
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import UserEmojiPicker from './UserEmojiPicker';

interface UserFormProps {
  defaultValues?: User;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  emoji: z.string().min(1, {
    message: "Please select an emoji.",
  }),
});

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isEditing,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: '',
      role: '',
      emoji: '👤',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && defaultValues) {
      onSubmit({
        ...values,
        id: defaultValues.id,
      });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="emoji"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center mb-6">
              <UserEmojiPicker 
                value={field.value} 
                onChange={(emoji) => {
                  field.onChange(emoji);
                }} 
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter user name" 
                  {...field} 
                  className="border-primary/20 focus-visible:ring-primary/30 bg-background/60 backdrop-blur-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Role</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter user role" 
                  {...field} 
                  className="border-primary/20 focus-visible:ring-primary/30 bg-background/60 backdrop-blur-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-primary/20 hover:bg-primary/5"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-primary to-indigo-500 hover:opacity-90"
          >
            {isEditing ? 'Update User' : 'Add User'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
