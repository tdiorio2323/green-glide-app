import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  className?: string;
}

export function Keypad({ onKeyPress, onDelete, className }: KeypadProps) {
  const keys = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "", "0", "del"
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-4 max-w-[280px] mx-auto", className)}>
      {keys.map((key, index) => {
        if (key === "") return <div key={index} />; // Empty slot for alignment

        const isDelete = key === "del";

        return (
          <button
            key={key}
            type="button"
            onClick={() => isDelete ? onDelete() : onKeyPress(key)}
            className={cn(
              "h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center text-xl sm:text-2xl font-semibold transition-all duration-200 active:scale-95",
              "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg",
              "hover:bg-white/20 hover:border-white/40",
              isDelete && "text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20"
            )}
            aria-label={isDelete ? "Delete" : key}
          >
            {isDelete ? <Delete className="h-8 w-8" /> : key}
          </button>
        );
      })}
    </div>
  );
}
