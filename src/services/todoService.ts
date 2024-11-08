import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface ErrorResponse {
  message: string;
}

const handleApiError = (error: AxiosError): string => {
  console.error("API Error:", error);

  // Check if error.response is not null or undefined
  if (error.response) {
    const responseData = error.response.data;

    // Ensure responseData is not null or undefined and has a message property
    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData
    ) {
      return (responseData as ErrorResponse).message;
    } else if (typeof responseData === "string") {
      return responseData;
    }
    return "An error occurred";
  } else if (error.request) {
    return "No response from the server";
  } else {
    return "Error in setting up the request";
  }
};

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const { data } = await axios.get<Todo[]>(`${API_URL}/todos`);
    return data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};

export const addTodo = async (newTodo: {
  title: string;
  completed: boolean;
}): Promise<Todo> => {
  try {
    const { data } = await axios.post<Todo>(`${API_URL}/todos`, newTodo);
    return data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};

export const updateTodo = async ({
  id,
  updatedTodo,
}: {
  id: string;
  updatedTodo: { title: string; completed: boolean };
}): Promise<Todo> => {
  try {
    const { data } = await axios.put<Todo>(
      `${API_URL}/todos/${id}`,
      updatedTodo
    );
    return data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};

export const deleteTodo = async (id: string): Promise<string> => {
  try {
    await axios.delete(`${API_URL}/todos/${id}`);
    return id;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};
