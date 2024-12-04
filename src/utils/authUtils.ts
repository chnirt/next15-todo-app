import { auth } from "@clerk/nextjs/server";

// Get the current userId from Clerk
export const getUserId = async (): Promise<string> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated. Please log in.");
  }

  return userId;
};
