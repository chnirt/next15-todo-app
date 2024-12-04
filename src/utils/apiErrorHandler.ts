import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

// Handle API errors and return user-friendly messages
export const handleApiError = (error: AxiosError): string => {
  console.error("API Error:", error);

  if (error.response) {
    const status = error.response.status;

    switch (status) {
      case 404:
        return "Resource not found (404). Please check the URL or provided parameters.";
      case 500:
        return "Internal server error (500). Please try again later.";
      case 401:
        return "Unauthorized access (401). Please log in.";
      case 403:
        return "Forbidden access (403). You do not have permission to access this resource.";
      default:
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
        return `Unexpected error occurred (HTTP ${status}).`;
    }
  } else if (error.request) {
    return "No response from the server";
  } else {
    return "Error in setting up the request";
  }
};
