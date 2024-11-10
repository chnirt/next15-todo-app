"use client";

import { useState } from "react";
import { Todo, useTodos } from "../hooks/useTodos";
import TodoForm from "./TodoForm";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import dynamic from "next/dynamic";

// Dynamically import the TodoList component
const TodoList = dynamic(() => import("./TodoList"), {
  loading: () => <p>Loading Todo List...</p>, // Optional loading state
});

const TodoApp = () => {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const {
    todos,
    isLoading,
    isError,
    error,
    isAdding,
    isUpdating,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
  } = useTodos();

  const handleCreateTodo = (title: string) => {
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
        }
      );
    });
  };

  const handleUpdateBlur = (id: string, title: string) => {
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
          resolve();
        },
        (error) => {
          toast({
            title: "Update Todo Error",
            description: `Failed to update todo: ${error.message}`,
          });
          reject(error);
        }
      );
    });
  };

  const handleDelete = (id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    return new Promise<void>((resolve, reject) => {
      handleDeleteTodo(
        id,
        () => {
          toast({
            title: "Todo Deleted",
            description: "Todo has been deleted successfully.",
          });
          setDeletingIds((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });
          resolve();
        },
        (error) => {
          toast({
            title: "Delete Todo Error",
            description: `Failed to delete todo: ${error.message}`,
          });
          setDeletingIds((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });
          reject(error);
        }
      );
    });
  };

  if (isLoading) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
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
      <h1>Todo List</h1>
      <TodoForm onAddTodo={handleCreateTodo} isAdding={isAdding} />
      {todos && todos.length > 0 ? (
        <TodoList
          todos={todos}
          isDeleting={deletingIds}
          isUpdating={isUpdating}
          onDelete={handleDelete}
          onEdit={handleUpdateBlur}
          editingTodo={editingTodo}
          setEditingTodo={setEditingTodo}
        />
      ) : (
        <div>
          <p>No todos available</p>
          {/* <button onClick={() => handleCreateTodo("Sample Todo")}>
            Create your first todo!
          </button> */}
        </div>
      )}
    </div>
  );
};

export default TodoApp;
