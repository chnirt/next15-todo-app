"use server";

import { handleApiError } from "@/utils/apiErrorHandler";
import { getUserId } from "@/utils/authUtils";
import { buildUrlWithParams } from "@/utils/urlUtils";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

// CRUD Operations

// 1. Fetch all Todos for the authenticated user
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const userId = await getUserId();
    const params = {
      createdBy: userId,
    };
    const url = buildUrlWithParams(`${API_URL}/todos`, params);
    const { data } = await axios.get<Todo[]>(url);
    return data || [];
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      console.warn("Todos not found, returning empty array.");
      return [];
    }
    throw new Error(handleApiError(axiosError));
  }
};

// 2. Create a new Todo
export const createTodo = async (newTodo: {
  title: string;
  completed: boolean;
}): Promise<Todo> => {
  try {
    const userId = await getUserId();
    const { data } = await axios.post<Todo>(`${API_URL}/todos`, {
      ...newTodo,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};

// 3. Update a Todo by id
export const updateTodo = async ({
  id,
  updatedTodo,
}: {
  id: string;
  updatedTodo: { title?: string; completed?: boolean };
}): Promise<Todo> => {
  try {
    const userId = await getUserId();
    const { data } = await axios.put<Todo>(`${API_URL}/todos/${id}`, {
      ...updatedTodo,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
    });
    return data;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};

// 4. Delete a Todo by id
export const deleteTodo = async (id: string): Promise<string> => {
  await getUserId(); // Ensure the user is authenticated
  try {
    await axios.delete(`${API_URL}/todos/${id}`);
    return id;
  } catch (error) {
    throw new Error(handleApiError(error as AxiosError));
  }
};
