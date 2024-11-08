// services/todoService.ts
import axios from "axios";

export const fetchTodos = async () => {
  const { data } = await axios.get(
    "https://61a06a08a647020017613391.mockapi.io/todos"
  );
  return data;
};

export const addTodo = async (newTodo: {
  title: string;
  completed: boolean;
}) => {
  const { data } = await axios.post(
    "https://61a06a08a647020017613391.mockapi.io/todos",
    newTodo
  );
  return data;
};

// Update updateTodo to accept a single object parameter
export const updateTodo = async ({
  id,
  updatedTodo,
}: {
  id: string;
  updatedTodo: { title: string; completed: boolean };
}) => {
  const { data } = await axios.put(
    `https://61a06a08a647020017613391.mockapi.io/todos/${id}`,
    updatedTodo
  );
  return data;
};

export const deleteTodo = async (id: string) => {
  await axios.delete(`https://61a06a08a647020017613391.mockapi.io/todos/${id}`);
  return id;
};
