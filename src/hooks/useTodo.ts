import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  Todo,
} from "../services/todoService";

// Hook to fetch todos
export const useTodos = () =>
  useQuery<Todo[], Error>("todos", getTodos, {
    onError: (error) => {
      console.error("Error fetching todos:", error.message);
    },
  });

// Hook to create a new todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Todo,
    Error,
    { title: string; completed: boolean },
    { previousTodos: Todo[]; fakeId: string }
  >(createTodo, {
    onMutate: async (newTodo) => {
      const fakeId = Math.floor(Math.random() * 10000).toString();
      await queryClient.cancelQueries("todos");
      const previousTodos = queryClient.getQueryData<Todo[]>("todos") || [];

      queryClient.setQueryData("todos", [
        ...previousTodos,
        { ...newTodo, id: fakeId },
      ]);

      return { previousTodos, fakeId };
    },
    onError: (_error, _newTodo, context) => {
      queryClient.setQueryData("todos", context?.previousTodos);
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData("todos", (oldTodos: Todo[] | undefined) =>
          (oldTodos ?? []).map((todo: Todo) =>
            todo.id === context?.fakeId
              ? { ...todo, ...data, id: data.id }
              : todo,
          ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries("todos");
    },
  });
};

// Hook to update a todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Todo,
    Error,
    { id: string; updatedTodo: Partial<Todo> },
    { previousTodos: Todo[] }
  >(updateTodo, {
    onMutate: async ({ id, updatedTodo }) => {
      await queryClient.cancelQueries("todos");
      const previousTodos = queryClient.getQueryData<Todo[]>("todos") || [];

      // Optimistically update the cache
      queryClient.setQueryData<Todo[]>("todos", (oldTodos) =>
        (oldTodos ?? []).map((todo) =>
          todo.id === id ? { ...todo, ...updatedTodo } : todo
        )
      );

      return { previousTodos };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData("todos", context?.previousTodos);
    },
    onSuccess: (updatedTodo) => {
      // Update cache with the API's returned data
      queryClient.setQueryData<Todo[]>("todos", (oldTodos) =>
        (oldTodos ?? []).map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries("todos");
    },
  });
};

// Hook to delete a todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<
    string,
    Error,
    string,
    { previousTodos: Todo[] }
  >(deleteTodo, {
    onMutate: async (id) => {
      await queryClient.cancelQueries("todos");
      const previousTodos = queryClient.getQueryData<Todo[]>("todos") || [];

      // Optimistically remove the todo from cache
      queryClient.setQueryData<Todo[]>("todos", (oldTodos) =>
        (oldTodos ?? []).filter((todo) => todo.id !== id),
      );

      return { previousTodos };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData("todos", context?.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries("todos");
    },
  });
};
