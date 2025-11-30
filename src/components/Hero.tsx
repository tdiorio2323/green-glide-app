import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/LoadingSpinner";
import { Keypad } from "@/components/ui/Keypad";
import { toast } from "sonner";

export default function Hero() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleKeyPress = (key: string) => {
    if (code.length < 4) {
      setCode(prev => prev + key);
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
  };

  const handleEnter = async () => {
    if (code !== "0420") {
      toast.error("Invalid Access Code");
      setCode("");
      return;
    }

    setLoading(true);
    // Simulate a brief loading state for effect
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate("/dashboard");
  };

  return (
    <section className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden bg-luxury-hero p-4 sm:p-6">
      {/* Card Container */}
      <div className="w-full max-w-[400px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-6 sm:gap-8 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-8 max-h-[95vh] overflow-y-auto no-scrollbar">

        {/* Logo */}
        <div className="flex-shrink-0 animate-float">
          <img
            src="/td-studios-xmas-logo.png"
            alt="TD STUDIOS"
            className="h-20 sm:h-24 w-auto drop-shadow-2xl select-none pointer-events-none"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>

        {/* Access Code Interface */}
        <div className="w-full space-y-6 sm:space-y-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-backwards">
          <div className="text-center space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 via-white to-green-600 bg-clip-text text-transparent drop-shadow-lg px-2">
              Enter Access Code
            </h2>

            <div className="flex justify-center">
              <div className="relative flex items-center gap-2 pointer-events-none">
                <InputOTP
                  maxLength={4}
                  value={code}
                  onChange={() => { }} // Read-only, controlled by Keypad
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    {[0, 1, 2, 3].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={cn(
                          "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 ring-1 ring-white/20 shadow-inner text-lg sm:text-xl text-white/90 font-bold transition-all duration-200",
                          code.length > index && "border-green-400 ring-green-400 shadow-[0_0_15px_rgba(74,222,128,0.3)] bg-green-500/10 scale-105"
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </div>

          <Keypad
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            className="w-full max-w-[260px]"
          />

          <LoadingButton
            type="button"
            loading={loading}
            onClick={handleEnter}
            className="
              w-full relative h-12 sm:h-14
              rounded-full
              text-white text-base sm:text-lg font-bold uppercase tracking-wide
              bg-gradient-to-r from-red-600 via-white via-green-600 to-red-600
              shadow-[0_4px_20px_rgba(0,0,0,0.4)]
              hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(220,38,38,0.5)]
              active:scale-[0.98]
              transition-all duration-300 ease-out
              cursor-pointer
              before:content-[''] before:absolute before:inset-0 before:rounded-full
              before:bg-gradient-to-b before:from-white/30 before:to-transparent
              before:pointer-events-none
            "
          >
            Enter TD STUDIOS
          </LoadingButton>
        </div>
      </div>
    </section>
  );
}