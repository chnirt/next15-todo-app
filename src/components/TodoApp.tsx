"use client";

import { useRef, useState } from "react";
import { Todo, useTodos } from "../hooks/useTodos";
import TodoForm, { TodoFormRef } from "./TodoForm";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, Loader2, MoreHorizontal } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
// import dynamic from "next/dynamic";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

// // Dynamically import the TodoList component
// const TodoList = dynamic(() => import("./TodoList"), {
//   loading: () => <p>Loading Todo List...</p>, // Optional loading state
// });

const TodoApp = () => {
  // const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const todoIdToDeleteRef = useRef<string | null>(null); // Use ref to store the todo ID for deletion
  const todoIdToUpdateRef = useRef<string | null>(null); // Use ref to store the todo ID for deletion
  const todoFormRef = useRef<TodoFormRef>(null);
  const {
    todos,
    isLoading,
    isError,
    error,
    isAdding,
    isDeleting,
    isUpdating,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
  } = useTodos();

  const handleOnAddTodo = (title: string) => {
    return new Promise<void>((resolve, reject) => {
      handleAddTodo(
        title,
        () => {
          toast({
            title: "Todo Added",
            description: `"${title}" has been successfully added to your list.`,
          });
          resolve();
        },
        (error) => {
          toast({
            title: "Add Todo Error",
            description: `Failed to add todo: ${error.message}`,
          });
          reject(error);
        },
      );
    });
  };

  const handleOnUpdateTodo = (id: string, title: string) => {
    return new Promise<void>((resolve, reject) => {
      handleUpdateTodo(
        id,
        title,
        false,
        () => {
          toast({
            title: "Todo Updated",
            description: `"${title}" has been updated successfully.`,
          });
          setEditingTodo(null);
          resolve();
        },
        (error) => {
          toast({
            title: "Update Todo Error",
            description: `Failed to update todo: ${error.message}`,
          });
          reject(error);
        },
      );
    });
  };

  const handleOnCancel = () => {
    setEditingTodo(null);
    closeForm();
  };

  const handleDelete = (id: string) => {
    // setDeletingIds((prev) => new Set(prev).add(id));
    return new Promise<void>((resolve, reject) => {
      handleDeleteTodo(
        id,
        () => {
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
          resolve();
        },
        (error) => {
          toast({
            title: "Delete Todo Error",
            description: `Failed to delete todo: ${error.message}`,
          });
          // setDeletingIds((prev) => {
          //   const updated = new Set(prev);
          //   updated.delete(id);
          //   setIsDialogOpen(false); // Close the dialog even on error
          //   return updated;
          // });
          reject(error);
        },
      );
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

  if (isLoading) {
    return <Skeleton className="h-[20px] w-[100px] rounded-full" />;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex-1 space-y-4 p-8 pt-6">
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
          <Table>
            <TableCaption>A list of your recent todos.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos?.length ? (
                todos.map((todo) => (
                  <TableRow key={todo.id}>
                    <TableCell className="font-medium">{todo.title}</TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              openUpdateDialog(todo.id, todo.title)
                            }
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(todo.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              todo item and remove it from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deleting
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TodoApp;
