"use client";

// components/TodoApp.tsx
import { useState } from "react";
import { useTodos } from "../hooks/useTodos";

const TodoApp = () => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editingTodo, setEditingTodo] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const {
    todos,
    isLoading,
    isError,
    error,
    isAdding,
    isUpdating,
    isDeleting,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
  } = useTodos();

  // Function to handle adding a new Todo
  const handleCreateTodo = () => {
    if (newTodoTitle.trim()) {
      handleAddTodo(
        newTodoTitle,
        () => {
          setNewTodoTitle(""); // Reset input field after adding
        },
        (error) => {
          console.error("Add Todo Error:", error);
        }
      );
    }
  };

  // Function to handle updating a Todo
  const handleUpdateBlur = (id: string, title: string) => {
    if (title.trim()) {
      handleUpdateTodo(
        id,
        title,
        false,
        () => {
          setEditingTodo(null); // Reset editingTodo after successful update
        },
        (error) => {
          console.error("Update Todo Error:", error);
        }
      );
    }
  };

  // Function to handle deleting a Todo
  const handleDelete = (id: string) => {
    handleDeleteTodo(
      id,
      () => {
        console.log("Todo deleted successfully");
      },
      (error) => {
        console.error("Delete Todo Error:", error);
      }
    );
  };

  // Show loading or error messages if applicable
  if (isLoading) return <p>Loading todos...</p>;
  if (isError)
    return <p style={{ color: "red" }}>{(error as Error).message}</p>;

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        placeholder="Enter new todo..."
      />
      <button onClick={handleCreateTodo} disabled={isAdding}>
        {isAdding ? "Adding..." : "Add"}
      </button>

      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            {editingTodo?.id === todo.id ? (
              <input
                type="text"
                defaultValue={todo.title}
                onBlur={(e) => handleUpdateBlur(todo.id, e.target.value)}
                autoFocus
              />
            ) : (
              <span>{todo.title}</span>
            )}

            <button onClick={() => handleDelete(todo.id)} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>

            <button
              onClick={() => setEditingTodo({ id: todo.id, title: todo.title })}
              disabled={isUpdating}
            >
              {isUpdating && editingTodo?.id === todo.id
                ? "Updating..."
                : "Edit"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
