// hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  Todo,
} from "../services/todoService";
import { useState } from "react";
import { debounce } from "lodash";
import { useDebounce } from "use-debounce";

interface AddTodoInput {
  title: string;
  completed: boolean;
}

interface UpdateTodoInput {
  id: string;
  updatedTodo: {
    title?: string; // Make title optional
    completed?: boolean; // Make completed optional
  };
}

export const useTodos = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("");
  const [debouncedFilter] = useDebounce(filter, 300); // 300ms debounce

  // Fetch todos
  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery<Todo[], Error>(
    ["todos", debouncedFilter],
    () => fetchTodos(debouncedFilter),
    {
      staleTime: 5000,
      refetchOnWindowFocus: false,
    },
  );

  // Add Todo Mutation
  const {
    mutate: addTodoMutation,
    isLoading: isAdding,
    isError: isAddError,
    error: addError,
  } = useMutation<Todo, Error, AddTodoInput>(addTodo, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("todos");
    },
  });

  // Update Todo Mutation
  const {
    mutate: updateTodoMutation,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation<Todo, Error, UpdateTodoInput>(updateTodo, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("todos");
    },
  });

  // Delete Todo Mutation
  const {
    mutate: deleteTodoMutation,
    isLoading: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation<string, Error, string>(deleteTodo, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("todos");
    },
  });

  // Debounced Add Todo function
  const handleAddTodo = debounce(
    (
      title: string,
      onSuccess?: () => void,
      onError?: (error: Error) => void,
    ) => {
      if (title.trim()) {
        addTodoMutation(
          { title, completed: false },
          {
            onSuccess: () => {
              if (onSuccess) onSuccess();
            },
            onError: (error: Error) => {
              if (onError) onError(error);
            },
          },
        );
      }
    },
    300,
  );

  // Update Todo function with partial updates (only title or completed)
  const handleUpdateTodo = debounce(
    (
      id: string,
      updatedTodo: { title?: string; completed?: boolean }, // Partial update
      onSuccess?: () => void,
      onError?: (error: Error) => void,
    ) => {
      if (updatedTodo.title || updatedTodo.completed !== undefined) {
        updateTodoMutation(
          { id, updatedTodo }, // Pass id and updatedTodo
          {
            onSuccess: () => {
              if (onSuccess) onSuccess();
            },
            onError: (error: Error) => {
              if (onError) onError(error);
            },
          },
        );
      }
    },
    300,
  );

  // Delete Todo function
  const handleDeleteTodo = (
    id: string,
    onSuccess?: () => void,
    onError?: (error: Error) => void,
  ) => {
    deleteTodoMutation(id, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
      onError: (error: Error) => {
        if (onError) onError(error);
      },
    });
  };

  return {
    todos,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    isError,
    isAddError,
    isUpdateError,
    isDeleteError,
    error,
    addError,
    updateError,
    deleteError,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
    filter,
    setFilter,
  };
};
