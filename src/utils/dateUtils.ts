// utils/dateUtils.ts
import { format } from "date-fns";

// Function to safely parse and format a date string
export const safeFormatDate = (date: string | undefined): string => {
  if (!date) {
    return "Invalid Date"; // Return fallback if date is undefined or null
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date"; // Return fallback if date is invalid
  }

  return format(parsedDate, "MMM dd, yyyy HH:mm");
};
