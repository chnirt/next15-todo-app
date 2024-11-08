"use client";

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
    <div className="w-full h-12 bg-gray-300 animate-pulse rounded-md"></div>
    <div className="w-1/4 h-8 bg-gray-300 animate-pulse rounded-md"></div>
    <div className="w-3/4 h-8 bg-gray-300 animate-pulse rounded-md"></div>
    <div className="w-1/2 h-10 bg-gray-300 animate-pulse rounded-md"></div>
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
      className={`transition-opacity ${isReady ? "opacity-100" : "opacity-0"}`}
      style={{ transition: "opacity 0.5s ease-in-out" }}
    >
      {!isReady ? (
        <SkeletonDashboard />
      ) : (
        <>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </>
      )}
    </div>
  );
}
