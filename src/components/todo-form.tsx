import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { sanitizeInput } from "../utils/sanitize";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import GradientButton from "./gradient-button";
import { Todo } from "@/services/todoService";
import { AnimatedDialogContent } from "./animated-dialog-content";

interface TodoFormProps {
  onAddTodo: (title: string) => Promise<void>;
  onUpdateTodo: (id: string, title: string) => Promise<void>;
  isAdding: boolean;
  isUpdating: boolean;
  isEditing: boolean;
  editingTodo: Todo | null; // Passed to the form for editing
  onCancel: () => void;
}

// Define the type for the ref, which includes `open` and `close` methods
export interface TodoFormRef {
  open: () => void;
  close: () => void;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Todo title must be at least 2 characters.",
  }),
});

const TodoForm = forwardRef<TodoFormRef, TodoFormProps>(
  (
    {
      onAddTodo,
      onUpdateTodo,
      isAdding,
      isUpdating,
      isEditing,
      editingTodo,
      onCancel,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "", // Pre-fill title for editing
      },
    });

    // Reset form when editingTodo changes
    useEffect(() => {
      if (isEditing && editingTodo) {
        form.reset({ title: editingTodo.title });
      } else {
        form.reset({
          title: "",
        });
      }
    }, [isEditing, editingTodo, form]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      console.log(isEditing ? "Todo updated:" : "Todo created:", data);
      const newTodoTitle = data.title;
      const sanitizedTitle = sanitizeInput(newTodoTitle);

      if (isEditing && editingTodo) {
        // Update existing Todo
        await onUpdateTodo(editingTodo.id, sanitizedTitle);
      } else {
        // Add new Todo
        await onAddTodo(sanitizedTitle);
      }

      // Close the dialog first, then reset form after a short delay
      setIsOpen(false);
      setTimeout(() => {
        form.reset();
      }, 300); // Adjust the delay (in milliseconds) as needed
    };

    const handleCancel = () => {
      // Reset form and close the dialog on cancel
      setIsOpen(false);
      setTimeout(() => {
        form.reset();

        onCancel();
      }, 300); // Adjust the delay (in milliseconds) as needed
    };

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    return (
      <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <GradientButton fromColor="#a18cd1" toColor="#fbc2ea">
              New Todo
            </GradientButton>
          </DialogTrigger>
          <AnimatedDialogContent
            type="alert-dialog"
            className="sm:max-w-[425px]"
          >
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Todo" : "Create a New Todo"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the details below to edit your Todo item."
                  : "Fill in the details below to create a new Todo item."}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Todo title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    className="mt-2 sm:mt-0"
                    type="button"
                    onClick={handleCancel}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <GradientButton
                    fromColor="#a18cd1"
                    toColor="#fbc2ea"
                    loading={isAdding || isUpdating}
                  >
                    {isEditing ? "Update" : "Add"}
                  </GradientButton>
                </DialogFooter>
              </form>
            </Form>
          </AnimatedDialogContent>
        </Dialog>
      </>
    );
  },
);

TodoForm.displayName = "TodoForm";

export default TodoForm;
