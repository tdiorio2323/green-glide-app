/**
 * Loading spinner component with Christmas theme
 */
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        "animate-spin",
        size === "sm" && "h-4 w-4",
        size === "md" && "h-6 w-6",
        size === "lg" && "h-8 w-8",
        className
      )}
      aria-hidden="true"
    />
  );
}

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function LoadingButton({
  loading,
  children,
  className,
  disabled,
  onClick,
  type = "button",
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center gap-2",
        className
      )}
      aria-busy={loading}
    >
      {loading && (
        <LoadingSpinner size="sm" className="text-white/80" />
      )}
      <span className={cn(loading && "opacity-70")}>
        {loading ? "Processing..." : children}
      </span>
    </button>
  );
}
