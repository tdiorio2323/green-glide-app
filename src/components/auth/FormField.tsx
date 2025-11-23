/**
 * FormField component with inline validation and error display
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  isValid?: boolean;
  showValidation?: boolean;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  pattern?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  helperText?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  isValid,
  showValidation = false,
  placeholder,
  maxLength,
  required = false,
  disabled = false,
  autoComplete,
  pattern,
  inputMode,
  helperText,
}: FormFieldProps) {
  const hasError = showValidation && error;
  const hasSuccess = showValidation && isValid && value.length > 0;

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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete={autoComplete}
          pattern={pattern}
          inputMode={inputMode}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={cn(
            "bg-white/10 border-white/30 text-white placeholder:text-white/50",
            "transition-all duration-200",
            "focus:ring-2 focus:ring-offset-0",
            hasError && "border-red-400 focus:border-red-400 focus:ring-red-400/50",
            hasSuccess && "border-green-400 focus:border-green-400 focus:ring-green-400/50 pr-10",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />

        {/* Success indicator */}
        {hasSuccess && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
        )}
      </div>

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

      {/* Helper text */}
      {helperText && !hasError && (
        <p
          id={`${id}-helper`}
          className="text-white/60 text-xs"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
