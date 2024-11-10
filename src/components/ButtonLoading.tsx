import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ButtonLoading({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode | string;
}) {
  return (
    <Button disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="animate-spin" />
          Please wait
        </>
      ) : (
        children
      )}
    </Button>
  );
}
