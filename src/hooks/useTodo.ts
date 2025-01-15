import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  Todo,
} from "../services/todoService";

// Hook to fetch todos
export const useTodos = (filter?: string) => {
  const queryKey = ["todos", filter];
  return useQuery<Todo[], Error>(queryKey, () => getTodos(filter), {
    keepPreviousData: true,
    onError: (error) => {
      console.error("Error fetching todos:", error.message);
    },
  });
};

// Hook to create a new todo
export const useCreateTodo = (filter?: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["todos", filter];

  return useMutation<
    Todo,
    Error,
    { title: string; completed: boolean },
    { previousTodos: Todo[]; fakeId: string }
  >(createTodo, {
    onMutate: async (newTodo) => {
      const fakeId = Math.floor(Math.random() * 10000).toString();
      await queryClient.cancelQueries(queryKey);

      // Get current todos data from cache
      const previousTodos = queryClient.getQueryData<Todo[]>(queryKey) || [];

      // Check if there is a filter (search)
      if (filter) {
        // If there is a filter, only add the new todo if its title matches the filter
        if (!newTodo.title.toLowerCase().includes(filter.toLowerCase())) {
          // If the title does not match the filter, do not add it
          return { previousTodos, fakeId };
        }
      }

      // If there is a filter and the title matches, or no filter, add the new todo to queryData
      queryClient.setQueryData(queryKey, [
        ...previousTodos,
        { ...newTodo, id: fakeId },
      ]);

      // Return values to revert if needed
      return { previousTodos, fakeId };
    },
    onError: (_error, _newTodo, context) => {
      queryClient.setQueryData(queryKey, context?.previousTodos);
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData(queryKey, (oldTodos: Todo[] | undefined) =>
        (oldTodos ?? []).map((todo: Todo) =>
          todo.id === context?.fakeId
            ? { ...todo, ...data, id: data.id }
            : todo,
        ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

// Hook to update a todo
export const useUpdateTodo = (filter?: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["todos", filter];

  return useMutation<
    Todo,
    Error,
    { id: string; updatedTodo: Partial<Todo> },
    { previousTodos: Todo[] }
  >(updateTodo, {
    onMutate: async ({ id, updatedTodo }) => {
      await queryClient.cancelQueries(queryKey);
      const previousTodos = queryClient.getQueryData<Todo[]>(queryKey) || [];

      // Optimistically update the cache
      queryClient.setQueryData<Todo[]>(queryKey, (oldTodos) =>
        (oldTodos ?? []).map((todo) =>
          todo.id === id ? { ...todo, ...updatedTodo } : todo,
        ),
      );

      return { previousTodos };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousTodos);
    },
    onSuccess: (updatedTodo) => {
      // Update cache with the API's returned data
      queryClient.setQueryData<Todo[]>(queryKey, (oldTodos) =>
        (oldTodos ?? []).map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });
};

// Hook to delete a todo
export const useDeleteTodo = (filter?: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["todos", filter];

  return useMutation<string, Error, string, { previousTodos: Todo[] }>(
    deleteTodo,
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries(queryKey);
        const previousTodos = queryClient.getQueryData<Todo[]>(queryKey) || [];

        // Optimistically remove the todo from cache
        queryClient.setQueryData<Todo[]>(queryKey, (oldTodos) =>
          (oldTodos ?? []).filter((todo) => todo.id !== id),
        );

        return { previousTodos };
      },
      onError: (_error, _variables, context) => {
        queryClient.setQueryData(queryKey, context?.previousTodos);
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey);
      },
    },
  );
};
