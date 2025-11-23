/**
 * PIN Input component with strength indicator and visual feedback
 */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { checkPINStrength, type PINStrength } from "@/lib/validation";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

interface PINInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showStrength?: boolean;
  error?: string;
  showValidation?: boolean;
}

export function PINInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder = "4-Digit PIN",
  required = false,
  disabled = false,
  showStrength = false,
  error,
  showValidation = false,
}: PINInputProps) {
  const [showPIN, setShowPIN] = useState(false);
  const strength: PINStrength | null = showStrength && value.length === 4 ? checkPINStrength(value) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Only allow digits and max 4 characters
    if (/^\d{0,4}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const hasError = showValidation && error;
  const hasSuccess = showValidation && !error && value.length === 4;

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-white/90 text-sm font-medium flex items-center gap-2"
      >
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={showPIN ? "text" : "password"}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={4}
          disabled={disabled}
          inputMode="numeric"
          pattern="\d{4}"
          autoComplete="off"
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${id}-error` : strength ? `${id}-strength` : undefined}
          className={cn(
            "bg-white/10 border-white/30 text-white placeholder:text-white/50",
            "transition-all duration-200 pr-10",
            "focus:ring-2 focus:ring-offset-0 text-center text-lg tracking-[0.5em] font-bold",
            hasError && "border-red-400 focus:border-red-400 focus:ring-red-400/50",
            hasSuccess && "border-green-400 focus:border-green-400 focus:ring-green-400/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />

        {/* Toggle visibility button */}
        <button
          type="button"
          onClick={() => setShowPIN(!showPIN)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          aria-label={showPIN ? "Hide PIN" : "Show PIN"}
        >
          {showPIN ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* PIN Strength Indicator */}
      {strength && showStrength && (
        <div
          id={`${id}-strength`}
          className="space-y-1 animate-in slide-in-from-top-1 duration-200"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  strength.strength === 'weak' && "w-1/3 bg-red-500",
                  strength.strength === 'medium' && "w-2/3 bg-yellow-500",
                  strength.strength === 'strong' && "w-full bg-green-500"
                )}
              />
            </div>
            {strength.strength === 'strong' && (
              <CheckCircle2 className="h-4 w-4 text-green-400" aria-hidden="true" />
            )}
          </div>
          <p
            className={cn(
              "text-xs flex items-center gap-1.5",
              strength.strength === 'weak' && "text-red-400",
              strength.strength === 'medium' && "text-yellow-400",
              strength.strength === 'strong' && "text-green-400"
            )}
          >
            {strength.strength === 'weak' && <AlertCircle className="h-3 w-3" aria-hidden="true" />}
            {strength.message}
          </p>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div
          id={`${id}-error`}
          className="flex items-start gap-2 text-red-400 text-sm animate-in slide-in-from-top-1 duration-200"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper text for dots display */}
      {!showPIN && value.length > 0 && (
        <p className="text-white/40 text-xs text-center">
          {'•'.repeat(value.length)}
        </p>
      )}
    </div>
  );
}
