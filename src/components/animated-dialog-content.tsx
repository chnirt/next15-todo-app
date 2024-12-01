// https://www.youtube.com/watch?v=ezP4kbOvs_E

import { AlertDialogContent } from "./ui/alert-dialog";
import { AlertDialogContentProps } from "@radix-ui/react-alert-dialog";
import { DialogContent } from "./ui/dialog";
import { cn } from "@/lib/utils";

interface AnimatedAlertDialogContentProps extends AlertDialogContentProps {
  type?: "alert-dialog" | "dialog";
  children: React.ReactNode | string;
}

export function AnimatedDialogContent({
  children,
  type = "dialog",
  className,
  ...rest // Collect all other props like onClick, type, etc.
}: AnimatedAlertDialogContentProps) {
  if (type === "alert-dialog") {
    return (
      <DialogContent
        {...rest}
        className={cn(
          "flex items-center justify-center overflow-hidden border-none p-[0.125rem]",
          className,
        )}
      >
        <div className="bg-conic animate-border-spin-slow absolute -z-10 h-full w-full"></div>
        <div className="h-full w-full bg-background p-6 sm:rounded-lg">
          {children}
        </div>
      </DialogContent>
    );
  }
  return (
    <AlertDialogContent
      {...rest}
      className={cn(
        "flex items-center justify-center overflow-hidden border-none p-[0.125rem]",
        className,
      )}
    >
      <div className="bg-conic animate-border-spin-slow absolute -z-10 h-full w-full"></div>
      <div className="h-full w-full bg-background p-6 sm:rounded-lg">
        {children}
      </div>
    </AlertDialogContent>
  );
}
