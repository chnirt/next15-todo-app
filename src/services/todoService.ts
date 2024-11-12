"use server";

import { auth } from "@clerk/nextjs/server";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string; // added createdAt
  updatedAt?: string; // added updatedAt
  createdBy?: string;
  updatedBy?: string;
}

interface ErrorResponse {
  message: string;
}

const handleApiError = (error: AxiosError): string => {
  console.error("API Error:", error);

  if (error.response) {
    const responseData = error.response.data;

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

// Get the current user from Clerk and return the userId, or throw an error if not authenticated
const getUserId = async (): Promise<string> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated. Please log in.");
  }

  return userId; // Return the userId if authenticated
};

// Fetch all Todos for the authenticated user
export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const userId = await getUserId(); // Fetch the userId from Clerk
    const { data } = await axios.get<Todo[]>(
      `${API_URL}/todos?createdBy=${userId}`,
    );
    return data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};

// Add a new Todo and set createdAt and updatedAt
export const addTodo = async (newTodo: {
  title: string;
  completed: boolean;
}): Promise<Todo> => {
  try {
    const userId = await getUserId();
    const { data } = await axios.post<Todo>(`${API_URL}/todos`, {
      ...newTodo,
      createdBy: userId, // Send the userId with the new todo
      updatedBy: userId, // Send the userId with the new todo
      createdAt: new Date().toISOString(), // Add createdAt field
      updatedAt: new Date().toISOString(), // Add updatedAt field
    });
    return data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};

// Update a Todo and set updatedAt
export const updateTodo = async ({
  id,
  updatedTodo,
}: {
  id: string;
  updatedTodo: { title: string; completed: boolean };
}): Promise<Todo> => {
  try {
    const userId = await getUserId();
    const { data } = await axios.put<Todo>(`${API_URL}/todos/${id}`, {
      ...updatedTodo,
      updatedBy: userId, // Set updatedBy to the userId
      updatedAt: new Date().toISOString(), // Set updatedAt to the current time
    });
    return data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};

// Delete a Todo by its id
export const deleteTodo = async (id: string): Promise<string> => {
  await getUserId(); // Ensure the user is authenticated
  try {
    await axios.delete(`${API_URL}/todos/${id}`);
    return id;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};
