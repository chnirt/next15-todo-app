"use client";

import { useCallback, useRef, useState } from "react";
import TodoForm, { TodoFormRef } from "./todo-form";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
// import dynamic from "next/dynamic";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

import Confetti from "react-confetti";
// import TodoTable from "./todo-table";
import { Todo } from "@/services/todoService";
// import { Badge } from "./ui/badge";
import { AnimatedDialogContent } from "./animated-dialog-content";
import { ButtonLoading } from "./button-loading";
// import { Input } from "./ui/input";
import DraggableTodo, { DraggableTodoRef } from "./draggable-todo";
import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
  useTodos,
} from "@/hooks/useTodo";

// // Dynamically import the TodoList component
// const TodoList = dynamic(() => import("./TodoList"), {
//   loading: () => <p>Loading Todo List...</p>, // Optional loading state
// });

const TodoApp = () => {
  // const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedCount, setCompletedCount] = useState<number>(0);
  // const [showAchievement, setShowAchievement] = useState(false);
  const todoIdToDeleteRef = useRef<string | null>(null); // Use ref to store the todo ID for deletion
  const todoIdToUpdateRef = useRef<string | null>(null); // Use ref to store the todo ID for deletion
  const todoFormRef = useRef<TodoFormRef>(null);
  const draggableTodoRef = useRef<DraggableTodoRef>(null);
  const { data: todos, isLoading, isError, error } = useTodos();
  const { mutate: createTodo, isLoading: isAdding } = useCreateTodo();
  const { mutate: updateTodo, isLoading: isUpdating } = useUpdateTodo();
  const { mutate: deleteTodo, isLoading: isDeleting } = useDeleteTodo();

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleOnAddTodo = useCallback(
    (title: string) => {
      createTodo(
        { title, completed: false },
        {
          onSuccess: (data) => {
            toast({
              title: "Todo Added",
              description: `"${data.title}" has been successfully added to your list.`,
            });
            triggerConfetti();
            draggableTodoRef.current?.add(data.id);
          },
          onError: (error) => {
            toast({
              title: "Add Todo Error",
              description: `Failed to add todo: ${error.message}`,
            });
          },
        },
      );
    },
    [createTodo],
  );

  const handleOnUpdateTodo = useCallback(
    (id: string, title: string) => {
      updateTodo(
        { id, updatedTodo: { title } },
        {
          onSuccess: () => {
            toast({
              title: "Todo Updated",
              description: `"${title}" has been updated successfully.`,
            });
            setEditingTodo(null);
          },
          onError: (error) => {
            toast({
              title: "Update Todo Error",
              description: `Failed to update todo: ${error.message}`,
            });
          },
        },
      );
    },
    [updateTodo],
  );

  const handleOnCancel = () => {
    setEditingTodo(null);
    closeForm();
  };

  const handleDelete = (id: string) => {
    // setDeletingIds((prev) => new Set(prev).add(id));
    deleteTodo(id, {
      onSuccess: () => {
        toast({
          title: "Todo Deleted",
          description: "Todo has been deleted successfully.",
        });
        // setDeletingIds((prev) => {
        //   const updated = new Set(prev);
        //   updated.delete(id);
        //   return updated;
        // });
        setIsDialogOpen(false); // Close the dialog after deletion
        draggableTodoRef.current?.delete(id);
      },
      onError: (error) => {
        toast({
          title: "Delete Todo Error",
          description: `Failed to delete todo: ${error.message}`,
        });
      },
    });
  };

  const handleConfirmDelete = () => {
    const todoId = todoIdToDeleteRef.current;
    if (todoId) {
      handleDelete(todoId);
    }
  };

  const openDeleteDialog = (id: string) => {
    todoIdToDeleteRef.current = id; // Store the todo ID in the ref
    setIsDialogOpen(true); // Open the dialog
  };

  const openForm = () => {
    todoFormRef.current?.open();
  };

  const closeForm = () => {
    todoFormRef.current?.close();
  };

  const openUpdateDialog = (id: string, title: string) => {
    todoIdToUpdateRef.current = id; // Store the todo ID in the ref
    setEditingTodo({ id, title, completed: false });
    openForm();
  };

  const countCompletedTodos = useCallback(() => {
    if (todos && todos?.length > 0) {
      const completedTasks = todos.filter((todo) => todo.completed).length;
      setCompletedCount(completedTasks);
    }
  }, [todos]);

  const triggerAchievement = () => {
    // setShowAchievement(true);
    toast({
      title: "Task Master Achieved! 🏅",
      description: "You’ve unlocked an achievement! 🎉",
    });
  };

  const toggleTodoCompletion = useCallback(
    async (id: string, title: string, completed: boolean) => {
      updateTodo(
        { id, updatedTodo: { completed } },
        {
          onSuccess: () => {
            toast({
              title: completed
                ? `Task Completed! 🎉`
                : `Task Back to Pending! 🔄`,
              description: completed
                ? `"Congrats! "${title}" is now completed. Well done!" 😊`
                : `"${title}" is back to being pending. Keep going! 💪`,
            });
            setEditingTodo(null);

            if (completed) {
              countCompletedTodos();
              if (completedCount + 1 === 2) {
                triggerAchievement();
              }
            }
          },
          onError: (error) => {
            toast({
              title: "Update Todo Error",
              description: `Failed to update todo: ${error.message}`,
            });
          },
        },
      );
    },
    [completedCount, countCompletedTodos, updateTodo],
  );

  // useEffect(() => {
  //   countCompletedTodos();
  // }, [countCompletedTodos]);

  // if (isLoading) {
  //   return (
  //     <div className="flex-1 space-y-4">
  //       <div className="flex items-center justify-between space-y-2">
  //         <Skeleton className="h-12 w-40" />
  //         <Skeleton className="h-12 w-24" />
  //       </div>
  //       <div>
  //         <Skeleton className="h-56 w-full" />
  //       </div>
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertCircle className="h-4 w-4" />
  //       <AlertTitle>Error</AlertTitle>
  //       <AlertDescription>{(error as Error).message}</AlertDescription>
  //     </Alert>
  //   );
  // }

  return (
    <div>
      {showConfetti && (
        <Confetti
          className="fixed inset-0 h-full w-full"
          recycle={false}
          numberOfPieces={1000}
        />
      )}

      <div className="flex-1 space-y-4">
        {/* Show badge when the milestone is reached */}
        {/* {showAchievement && (
          <div className="achievement-container">
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-yellow-400 to-red-500 text-white"
            >
              Task Master
            </Badge>
            <p>You’ve unlocked an achievement!</p>
          </div>
        )} */}

        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <TodoForm
              ref={todoFormRef}
              onAddTodo={handleOnAddTodo}
              isAdding={isAdding}
              onUpdateTodo={handleOnUpdateTodo}
              isUpdating={isUpdating}
              isEditing={!!editingTodo} // If editingTodo is not null, we are editing
              editingTodo={editingTodo}
              onCancel={handleOnCancel}
            />
          </div>
        </div>

        <div>
          {/* <div className="flex items-center py-4">
            <Input
              placeholder="Filter titles..."
              value={filter ?? ""}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-full sm:max-w-sm"
            />
          </div> */}

          {isLoading && (
            <div>
              <Skeleton className="h-56 w-full" />
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{(error as Error).message}</AlertDescription>
            </Alert>
          )}

          {/* {todos && (
            <TodoTable
              todos={todos || []}
              openUpdateDialog={openUpdateDialog}
              openDeleteDialog={openDeleteDialog}
              toggleTodoCompletion={toggleTodoCompletion}
            />
          )} */}

          {todos && (
            <DraggableTodo
              ref={draggableTodoRef}
              todos={todos || []}
              openUpdateDialog={openUpdateDialog}
              openDeleteDialog={openDeleteDialog}
              toggleTodoCompletion={toggleTodoCompletion}
            />
          )}

          {/* {todos && todos.length > 0 ? (
        <TodoList
          todos={todos}
          isDeleting={deletingIds}
          isUpdating={isUpdating}
          onDelete={openDeleteDialog}
          onEdit={openUpdateDialog}
          editingTodo={editingTodo}
          setEditingTodo={setEditingTodo}
        />
      ) : (
        <div>
          <p>No todos available</p>
        </div>
      )} */}
        </div>
      </div>

      <AlertDialog open={isDialogOpen}>
        <AnimatedDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              todo item and remove it from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-y-8 sm:space-y-0">
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <ButtonLoading
                loading={isDeleting}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                Delete
              </ButtonLoading>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AnimatedDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TodoApp;
