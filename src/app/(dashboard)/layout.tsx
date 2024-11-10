"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const SkeletonDashboard = () => (
  <div className="space-y-4">
    <div className="h-12 w-full animate-pulse rounded-md bg-gray-300"></div>
    <div className="h-8 w-1/4 animate-pulse rounded-md bg-gray-300"></div>
    <div className="h-8 w-3/4 animate-pulse rounded-md bg-gray-300"></div>
    <div className="h-10 w-1/2 animate-pulse rounded-md bg-gray-300"></div>
  </div>
);

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoaded, user } = useUser();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setIsReady(true);
    }
  }, [isLoaded, user]);

  return (
    <div
      className={cn(
        `transition-opacity ${isReady ? "opacity-100" : "opacity-0"}`,
        "min-h-dvh w-full",
      )}
      style={{ transition: "opacity 0.5s ease-in-out" }}
    >
      {!isReady ? (
        <SkeletonDashboard />
      ) : (
        <>
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <div>
                <h3 className="inline-block scroll-m-20 bg-gradient-to-r from-[#a18cd1] to-[#fbc2ea] bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
                  Todo
                </h3>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <ModeToggle />
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>

          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </>
      )}
    </div>
  );
}
