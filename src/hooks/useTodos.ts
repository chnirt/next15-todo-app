// hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../services/todoService";
import debounce from "lodash/debounce";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface AddTodoInput {
  title: string;
  completed: boolean;
}

interface UpdateTodoInput {
  id: string;
  updatedTodo: {
    title: string;
    completed: boolean;
  };
}

export const useTodos = () => {
  const queryClient = useQueryClient();

  // Fetch todos
  const {
    data: todos,
    isLoading,
    isError,
    error,
  } = useQuery<Todo[], Error>("todos", fetchTodos, {
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  // Add Todo Mutation
  const {
    mutate: addTodoMutation,
    isLoading: isAdding,
    isError: isAddError,
    error: addError,
  } = useMutation<Todo, Error, AddTodoInput>(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  // Update Todo Mutation
  const {
    mutate: updateTodoMutation,
    isLoading: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation<Todo, Error, UpdateTodoInput>(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  // Delete Todo Mutation
  const {
    mutate: deleteTodoMutation,
    isLoading: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation<string, Error, string>(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  // Debounced Add Todo function
  const handleAddTodo = debounce(
    (
      title: string,
      onSuccess?: () => void,
      onError?: (error: Error) => void
    ) => {
      if (title.trim()) {
        addTodoMutation(
          { title, completed: false },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("todos");
              if (onSuccess) onSuccess();
            },
            onError: (error: Error) => {
              console.log("🚀 ~ useTodos ~ error:", error);
              if (onError) onError(error);
            },
          }
        );
      }
    },
    300
  );

  // Update Todo function with debounce
  const handleUpdateTodo = debounce(
    (
      id: string,
      title: string,
      completed: boolean,
      onSuccess?: () => void,
      onError?: (error: Error) => void
    ) => {
      if (title.trim()) {
        updateTodoMutation(
          { id, updatedTodo: { title, completed } },
          {
            onSuccess: () => {
              queryClient.invalidateQueries("todos");
              if (onSuccess) onSuccess();
            },
            onError: (error: Error) => {
              if (onError) onError(error);
            },
          }
        );
      }
    },
    300
  );

  // Delete Todo function
  const handleDeleteTodo = (
    id: string,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    deleteTodoMutation(id, {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
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
  };
};
