import React, { forwardRef } from "react";
import { cn } from "@/lib/utils"; // Make sure the cn function is imported correctly

// Define the props type for TypographyLink
interface TypographyLinkProps {
  children: React.ReactNode; // Expecting React node(s) as children
  href?: string; // Optional href for link
  className?: string; // Optional className to allow custom styling
}

// Define the component with forwardRef
const TypographyLink = forwardRef<HTMLAnchorElement, TypographyLinkProps>(
  ({ children, href, className }, ref) => {
    return (
      <a
        href={href}
        ref={ref}
        className={cn(
          "font-medium text-primary underline underline-offset-4",
          className,
        )}
      >
        {children}
      </a>
    );
  },
);

// Set display name for debugging purposes
TypographyLink.displayName = "TypographyLink";

// Export the component
export { TypographyLink };
