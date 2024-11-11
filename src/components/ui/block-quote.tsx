import React, { forwardRef } from "react";
import { cn } from "@/lib/utils"; // Make sure the cn function is imported correctly

// Define the props type for TypographyBlockquote
interface TypographyBlockquoteProps {
  children: React.ReactNode; // Expecting React node(s) as children
  className?: string; // Optional className to allow custom styling
}

// Define the component with forwardRef
const TypographyBlockquote = forwardRef<
  HTMLQuoteElement,
  TypographyBlockquoteProps
>(({ children, className }, ref) => {
  return (
    <blockquote
      ref={ref}
      className={cn(
        "mt-6 border-l-2 pl-6 italic", // Default styles
        className, // Allow additional custom styles
      )}
    >
      {children}
    </blockquote>
  );
});

// Set display name for debugging purposes
TypographyBlockquote.displayName = "TypographyBlockquote";

// Export the component
export { TypographyBlockquote };
