import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { toast } from "sonner";

const heroImage = "/td-white.jpg";

export default function Hero() {
  const [view, setView] = useState<"entry" | "signup" | "login">("entry");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code && code.length === 4) {
      setView("signup");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !pin) {
      toast.error("Username and PIN are required");
      return;
    }

    if (!phone && !email && !instagram) {
      toast.error("Please provide at least one contact method");
      return;
    }

    setLoading(true);
    const result = await auth.signup({
      username,
      pin,
      phone: phone || undefined,
      email: email || undefined,
      instagram_handle: instagram || undefined,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Signup failed");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !pin) {
      toast.error("Username and PIN are required");
      return;
    }

    setLoading(true);
    const result = await auth.login(username, pin);
    setLoading(false);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
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
      <div className="relative z-10 flex items-center justify-center" style={{ height: '60vh' }}>
        <img
          src="/td-studios-xmas-logo.png"
          alt="TD STUDIOS"
          className="h-64 md:h-80 w-auto drop-shadow-2xl animate-[breathe_3s_ease-in-out_infinite] select-none"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Access Code Interface */}
      {view === "entry" && (
        <div className="relative z-10 px-6 pb-6">
          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="text-center space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 via-white to-green-600 bg-clip-text text-transparent drop-shadow-lg">
                  Enter Access Code
                </h2>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={code}
                    onChange={(value) => setCode(value)}
                    className="gap-2"
                  >
                    <InputOTPGroup className="gap-3">
                      <InputOTPSlot index={0} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 ring-1 ring-white/40 focus:ring-2 focus:ring-emerald-300/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)] text-xl md:text-2xl text-white/90 font-bold" />
                      <InputOTPSlot index={1} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 ring-1 ring-white/40 focus:ring-2 focus:ring-emerald-300/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)] text-xl md:text-2xl text-white/90 font-bold" />
                      <InputOTPSlot index={2} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 ring-1 ring-white/40 focus:ring-2 focus:ring-emerald-300/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)] text-xl md:text-2xl text-white/90 font-bold" />
                      <InputOTPSlot index={3} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 ring-1 ring-white/40 focus:ring-2 focus:ring-emerald-300/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)] text-xl md:text-2xl text-white/90 font-bold" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Form */}
      {view === "signup" && (
        <div className="relative z-10 px-6 pb-6 max-h-[50vh] overflow-y-auto">
          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSignup} className="space-y-4 bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/20">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 via-white to-green-600 bg-clip-text text-transparent">
                Create Your Profile
              </h2>
              
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                required
              />
              
              <Input
                type="text"
                maxLength={4}
                placeholder="4-Digit PIN"
                value={pin}
                onChange={(e) => e.target.value.match(/^\d{0,4}$/) && setPin(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                required
              />

              <div className="space-y-2">
                <p className="text-sm text-white/70 text-center">Provide at least one:</p>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
                
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
                
                <Input
                  type="text"
                  placeholder="Instagram Username"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              <button
                type="button"
                onClick={() => setView("login")}
                className="text-white/80 hover:text-white text-sm underline w-full text-center"
              >
                Already have an account? Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Login Form */}
      {view === "login" && (
        <div className="relative z-10 px-6 pb-6">
          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleLogin} className="space-y-4 bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/20">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-red-600 via-white to-green-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                required
              />
              
              <Input
                type="text"
                maxLength={4}
                placeholder="4-Digit PIN"
                value={pin}
                onChange={(e) => e.target.value.match(/^\d{0,4}$/) && setPin(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                required
              />

              <button
                type="button"
                onClick={() => setView("signup")}
                className="text-white/80 hover:text-white text-sm underline w-full text-center"
              >
                Don't have an account? Sign up
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="relative z-10 px-6 pb-8 md:pb-12">
        <button
          type="button"
          disabled={loading || (view === "entry" && code.length !== 4) || (view !== "entry" && (!username || !pin))}
          onClick={view === "entry" ? handleCodeSubmit : view === "signup" ? handleSignup : handleLogin}
          className="
            w-full relative h-16 px-12
            rounded-full
            text-white text-lg md:text-xl font-bold uppercase tracking-wide
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
          {loading ? "Loading..." : view === "entry" ? "Enter TD STUDIOS" : view === "signup" ? "Create Account" : "Login"}
        </button>
      </div>
    </section>
  );
}