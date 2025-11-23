import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { auth } from "@/lib/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { FormField } from "@/components/auth/FormField";
import { PINInput } from "@/components/auth/PINInput";
import { LoadingButton } from "@/components/auth/LoadingSpinner";
import {
  validateUsername,
  validatePhone,
  validateEmail,
  validateInstagram,
  validateAccessCode,
  validateContactMethods,
} from "@/lib/validation";

const heroImage = "/td-white.jpg";

interface FieldState {
  value: string;
  error?: string;
  touched: boolean;
}

export default function Hero() {
  const [view, setView] = useState<"entry" | "signup" | "login">("entry");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string>("");
  const [codeValidated, setCodeValidated] = useState(false);

  // Form states
  const [username, setUsername] = useState<FieldState>({ value: "", touched: false });
  const [pin, setPin] = useState<FieldState>({ value: "", touched: false });
  const [pinConfirm, setPinConfirm] = useState<FieldState>({ value: "", touched: false });
  const [phone, setPhone] = useState<FieldState>({ value: "", touched: false });
  const [email, setEmail] = useState<FieldState>({ value: "", touched: false });
  const [instagram, setInstagram] = useState<FieldState>({ value: "", touched: false });

  const [loading, setLoading] = useState(false);
  const [contactError, setContactError] = useState<string>("");
  const navigate = useNavigate();

  // Refs for focus management
  const usernameRef = useRef<HTMLInputElement>(null);
  const pinRef = useRef<HTMLInputElement>(null);

  // Validate access code on change
  useEffect(() => {
    if (code.length === 4) {
      const validation = validateAccessCode(code);
      if (validation.valid) {
        setCodeError("");
        setCodeValidated(true);
      } else {
        setCodeError(validation.error || "Invalid code");
        setCodeValidated(false);
      }
    } else {
      setCodeError("");
      setCodeValidated(false);
    }
  }, [code]);

  // Focus management on view change
  useEffect(() => {
    if (view === "signup" || view === "login") {
      setTimeout(() => usernameRef.current?.focus(), 100);
    }
  }, [view]);

  // Real-time validation functions
  const validateUsernameField = (value: string) => {
    const result = validateUsername(value);
    setUsername(prev => ({ ...prev, value, error: result.error }));
  };

  const validatePINField = (value: string) => {
    setPin(prev => ({ ...prev, value, error: value.length === 4 ? undefined : "PIN must be 4 digits" }));
  };

  const validatePINConfirmField = (value: string) => {
    const error = value !== pin.value && value.length === 4 ? "PINs do not match" : undefined;
    setPinConfirm(prev => ({ ...prev, value, error }));
  };

  const validatePhoneField = (value: string) => {
    const result = validatePhone(value);
    setPhone(prev => ({ ...prev, value, error: result.error }));
    if (value || email.value || instagram.value) {
      setContactError("");
    }
  };

  const validateEmailField = (value: string) => {
    const result = validateEmail(value);
    setEmail(prev => ({ ...prev, value, error: result.error }));
    if (value || phone.value || instagram.value) {
      setContactError("");
    }
  };

  const validateInstagramField = (value: string) => {
    const result = validateInstagram(value);
    setInstagram(prev => ({ ...prev, value, error: result.error }));
    if (value || phone.value || email.value) {
      setContactError("");
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 4 && codeValidated) {
      setView("signup");
    } else if (code.length === 4) {
      const validation = validateAccessCode(code);
      setCodeError(validation.error || "Invalid code");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setUsername(prev => ({ ...prev, touched: true }));
    setPin(prev => ({ ...prev, touched: true }));
    setPinConfirm(prev => ({ ...prev, touched: true }));
    setPhone(prev => ({ ...prev, touched: true }));
    setEmail(prev => ({ ...prev, touched: true }));
    setInstagram(prev => ({ ...prev, touched: true }));

    // Validate all fields
    const usernameValidation = validateUsername(username.value);
    const contactValidation = validateContactMethods(phone.value, email.value, instagram.value);
    const phoneValidation = validatePhone(phone.value);
    const emailValidation = validateEmail(email.value);
    const instagramValidation = validateInstagram(instagram.value);

    if (!usernameValidation.valid) {
      setUsername(prev => ({ ...prev, error: usernameValidation.error }));
      toast.error(usernameValidation.error);
      return;
    }

    if (pin.value.length !== 4) {
      setPin(prev => ({ ...prev, error: "PIN must be 4 digits" }));
      toast.error("PIN must be 4 digits");
      return;
    }

    if (pinConfirm.value !== pin.value) {
      setPinConfirm(prev => ({ ...prev, error: "PINs do not match" }));
      toast.error("PINs do not match");
      return;
    }

    if (!contactValidation.valid) {
      setContactError(contactValidation.error || "");
      toast.error(contactValidation.error);
      return;
    }

    if (!phoneValidation.valid || !emailValidation.valid || !instagramValidation.valid) {
      toast.error("Please fix the errors in your contact information");
      return;
    }

    setLoading(true);
    try {
      const result = await auth.signup({
        username: username.value,
        pin: pin.value,
        phone: phone.value || undefined,
        email: email.value || undefined,
        instagram_handle: instagram.value || undefined,
      });

      if (result.success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        // Clear sensitive fields on error
        setPin({ value: "", touched: false, error: undefined });
        setPinConfirm({ value: "", touched: false, error: undefined });
        toast.error(result.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      // Clear sensitive fields on error
      setPin({ value: "", touched: false, error: undefined });
      setPinConfirm({ value: "", touched: false, error: undefined });
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark fields as touched
    setUsername(prev => ({ ...prev, touched: true }));
    setPin(prev => ({ ...prev, touched: true }));

    // Validate
    const usernameValidation = validateUsername(username.value);

    if (!usernameValidation.valid) {
      setUsername(prev => ({ ...prev, error: usernameValidation.error }));
      toast.error(usernameValidation.error);
      return;
    }

    if (pin.value.length !== 4) {
      setPin(prev => ({ ...prev, error: "PIN must be 4 digits" }));
      toast.error("PIN must be 4 digits");
      return;
    }

    setLoading(true);
    try {
      const result = await auth.login(username.value, pin.value);

      if (result.success) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        // Clear PIN on error
        setPin({ value: "", touched: false, error: undefined });
        toast.error(result.error || "Invalid username or PIN");
      }
    } catch (error) {
      // Clear PIN on error
      setPin({ value: "", touched: false, error: undefined });
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle view switching with form reset
  const switchToSignup = () => {
    setView("signup");
    setUsername({ value: "", touched: false, error: undefined });
    setPin({ value: "", touched: false, error: undefined });
    setPinConfirm({ value: "", touched: false, error: undefined });
  };

  const switchToLogin = () => {
    setView("login");
    setUsername({ value: "", touched: false, error: undefined });
    setPin({ value: "", touched: false, error: undefined });
  };

  return (
    <section className="relative min-h-screen h-screen flex flex-col overflow-hidden">
      {/* Full-Screen Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="TD STUDIOS"
          className="w-full h-full object-cover select-none"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      {/* Centered Logo with breathing animation */}
      <div className="relative z-10 flex items-center justify-center flex-1 pt-safe pb-4">
        <img
          src="/td-studios-xmas-logo.png"
          alt="TD STUDIOS"
          className="h-32 sm:h-48 md:h-64 lg:h-80 w-auto max-w-[90vw] drop-shadow-2xl animate-[breathe_3s_ease-in-out_infinite] select-none"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* Access Code Interface */}
      {view === "entry" && (
        <div className="relative z-10 px-4 sm:px-6 pb-safe pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleCodeSubmit} className="space-y-4 sm:space-y-6">
              <div className="text-center space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 via-white to-green-600 bg-clip-text text-transparent drop-shadow-lg px-4">
                  Enter Access Code
                </h2>

                <div className="flex flex-col items-center gap-4">
                  <div className="relative flex items-center gap-2">
                    <InputOTP
                      maxLength={4}
                      value={code}
                      onChange={(value) => setCode(value)}
                      className="gap-2"
                      disabled={loading}
                    >
                      <InputOTPGroup className="gap-2 sm:gap-3">
                        <InputOTPSlot
                          index={0}
                          className={cn(
                            "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 ring-1 ring-white/40 focus:ring-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)] text-lg sm:text-xl md:text-2xl text-white/90 font-bold transition-all duration-200",
                            codeValidated && "border-green-400 ring-green-400 focus:ring-green-400/80",
                            codeError && code.length === 4 && "border-red-400 ring-red-400 focus:ring-red-400/80"
                          )}
                        />
                        <InputOTPSlot
                          index={1}
                          className={cn(
                            "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 ring-1 ring-white/40 focus:ring-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)] text-lg sm:text-xl md:text-2xl text-white/90 font-bold transition-all duration-200",
                            codeValidated && "border-green-400 ring-green-400 focus:ring-green-400/80",
                            codeError && code.length === 4 && "border-red-400 ring-red-400 focus:ring-red-400/80"
                          )}
                        />
                        <InputOTPSlot
                          index={2}
                          className={cn(
                            "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 ring-1 ring-white/40 focus:ring-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)] text-lg sm:text-xl md:text-2xl text-white/90 font-bold transition-all duration-200",
                            codeValidated && "border-green-400 ring-green-400 focus:ring-green-400/80",
                            codeError && code.length === 4 && "border-red-400 ring-red-400 focus:ring-red-400/80"
                          )}
                        />
                        <InputOTPSlot
                          index={3}
                          className={cn(
                            "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 ring-1 ring-white/40 focus:ring-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)] text-lg sm:text-xl md:text-2xl text-white/90 font-bold transition-all duration-200",
                            codeValidated && "border-green-400 ring-green-400 focus:ring-green-400/80",
                            codeError && code.length === 4 && "border-red-400 ring-red-400 focus:ring-red-400/80"
                          )}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                    {codeValidated && (
                      <div className="animate-in zoom-in duration-300 ml-1">
                        <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-400" aria-label="Valid code" />
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {codeError && code.length === 4 && (
                    <div className="flex items-center gap-2 text-red-400 text-sm animate-in slide-in-from-top-2 duration-200" role="alert">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      <span>{codeError}</span>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Form */}
      {view === "signup" && (
        <div className="relative z-10 px-4 sm:px-6 pb-safe pb-4 sm:pb-6 max-h-[60vh] sm:max-h-[55vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4 bg-black/40 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20">
              <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-red-600 via-white to-green-600 bg-clip-text text-transparent">
                Create Your Profile
              </h2>

              <FormField
                id="signup-username"
                label="Username"
                value={username.value}
                onChange={validateUsernameField}
                onBlur={() => setUsername(prev => ({ ...prev, touched: true }))}
                error={username.error}
                isValid={!username.error && username.value.length >= 3}
                showValidation={username.touched}
                placeholder="Choose a username"
                required
                disabled={loading}
                autoComplete="username"
                helperText="3-20 characters, letters, numbers, and underscores only"
              />

              <PINInput
                id="signup-pin"
                label="Create PIN"
                value={pin.value}
                onChange={validatePINField}
                onBlur={() => setPin(prev => ({ ...prev, touched: true }))}
                placeholder="4-Digit PIN"
                required
                disabled={loading}
                showStrength={true}
                error={pin.error}
                showValidation={pin.touched}
              />

              <PINInput
                id="signup-pin-confirm"
                label="Confirm PIN"
                value={pinConfirm.value}
                onChange={validatePINConfirmField}
                onBlur={() => setPinConfirm(prev => ({ ...prev, touched: true }))}
                placeholder="Re-enter PIN"
                required
                disabled={loading}
                error={pinConfirm.error}
                showValidation={pinConfirm.touched}
              />

              <div className="space-y-3 pt-2">
                <div className={cn(
                  "text-sm text-center py-2 px-3 rounded-lg",
                  contactError ? "bg-red-500/20 text-red-300" : "bg-white/10 text-white/70"
                )}>
                  Provide at least one contact method:
                </div>

                <FormField
                  id="signup-phone"
                  label="Phone Number"
                  type="tel"
                  value={phone.value}
                  onChange={validatePhoneField}
                  onBlur={() => setPhone(prev => ({ ...prev, touched: true }))}
                  error={phone.error}
                  isValid={!phone.error && phone.value.length > 0}
                  showValidation={phone.touched}
                  placeholder="(555) 123-4567"
                  disabled={loading}
                  inputMode="tel"
                  autoComplete="tel"
                />

                <FormField
                  id="signup-email"
                  label="Email"
                  type="email"
                  value={email.value}
                  onChange={validateEmailField}
                  onBlur={() => setEmail(prev => ({ ...prev, touched: true }))}
                  error={email.error}
                  isValid={!email.error && email.value.length > 0}
                  showValidation={email.touched}
                  placeholder="your@email.com"
                  disabled={loading}
                  inputMode="email"
                  autoComplete="email"
                />

                <FormField
                  id="signup-instagram"
                  label="Instagram"
                  type="text"
                  value={instagram.value}
                  onChange={validateInstagramField}
                  onBlur={() => setInstagram(prev => ({ ...prev, touched: true }))}
                  error={instagram.error}
                  isValid={!instagram.error && instagram.value.length > 0}
                  showValidation={instagram.touched}
                  placeholder="@username"
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              <button
                type="button"
                onClick={switchToLogin}
                disabled={loading}
                className="text-white/80 hover:text-white text-sm underline w-full text-center transition-colors disabled:opacity-50"
              >
                Already have an account? Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Login Form */}
      {view === "login" && (
        <div className="relative z-10 px-4 sm:px-6 pb-safe pb-4 sm:pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4 bg-black/40 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20">
              <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-red-600 via-white to-green-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>

              <FormField
                id="login-username"
                label="Username"
                value={username.value}
                onChange={validateUsernameField}
                onBlur={() => setUsername(prev => ({ ...prev, touched: true }))}
                error={username.error}
                isValid={!username.error && username.value.length >= 3}
                showValidation={username.touched}
                placeholder="Enter your username"
                required
                disabled={loading}
                autoComplete="username"
              />

              <PINInput
                id="login-pin"
                label="PIN"
                value={pin.value}
                onChange={validatePINField}
                onBlur={() => setPin(prev => ({ ...prev, touched: true }))}
                placeholder="4-Digit PIN"
                required
                disabled={loading}
                error={pin.error}
                showValidation={pin.touched}
              />

              <button
                type="button"
                onClick={switchToSignup}
                disabled={loading}
                className="text-white/80 hover:text-white text-sm underline w-full text-center transition-colors disabled:opacity-50"
              >
                Don't have an account? Sign up
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="relative z-10 px-4 sm:px-6 pb-safe pb-6 sm:pb-8 md:pb-12">
        <LoadingButton
          type="button"
          loading={loading}
          disabled={
            loading ||
            (view === "entry" && (!codeValidated || code.length !== 4)) ||
            (view !== "entry" && (username.value.length < 3 || pin.value.length !== 4))
          }
          onClick={view === "entry" ? handleCodeSubmit : view === "signup" ? handleSignup : handleLogin}
          className="
            w-full relative h-14 sm:h-16 px-8 sm:px-12
            rounded-full
            text-white text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide
            bg-gradient-to-r from-red-600 via-white via-green-600 to-red-600
            shadow-[0_10px_30px_rgba(0,0,0,0.3)]
            hover:scale-105 hover:shadow-[0_15px_40px_rgba(220,38,38,0.6)]
            active:scale-95
            transition-all duration-300 ease-out
            cursor-pointer
            before:content-[''] before:absolute before:inset-0 before:rounded-full
            before:bg-gradient-to-b before:from-white/30 before:to-transparent
            before:pointer-events-none
            disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-50
          "
        >
          {view === "entry" ? "Enter TD STUDIOS" : view === "signup" ? "Create Account" : "Login"}
        </LoadingButton>
      </div>
    </section>
  );
}