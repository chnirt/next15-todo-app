import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button"; // Assuming Button is exported from this file

interface ButtonLoadingProps extends ButtonProps {
  loading?: boolean;
  children: React.ReactNode | string;
}

export function ButtonLoading({
  loading,
  children,
  ...rest // Collect all other props like onClick, type, etc.
}: ButtonLoadingProps) {
  return (
    <Button disabled={loading} {...rest}>
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          <span className="ml-2">Please wait</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
