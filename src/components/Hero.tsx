import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import heroImage from "@/assets/candy-kitchen-hero.png";

export default function Hero() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic stub validation - check if code is entered
    if (code && code.length === 6) {
      // In production, validate against backend
      navigate("/dashboard");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Full-Screen Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="The Candy Shop"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient at bottom only */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
      </div>

      {/* Logo at top - slightly lower with breathing animation */}
      <div className="relative z-10 flex items-center justify-center pt-[15vh] pb-[10vh]">
        <img
          src="/candy-kitchen-logo.png"
          alt="The Candy Kitchen"
          className="h-32 w-auto drop-shadow-2xl animate-[breathe_3s_ease-in-out_infinite]"
        />
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-1"></div>

      {/* Access Code Interface - positioned at bottom 25% of viewport */}
      <div className="relative z-10 container mx-auto px-6 pb-[15vh] w-full">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-holographic bg-clip-text text-transparent">
                Enter Access Code
              </h2>

              {/* OTP Input with holographic styling */}
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => setCode(value)}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot
                      index={0}
                      className="
                        w-14 h-14 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-lg text-white/90
                      "
                    />
                    <InputOTPSlot
                      index={1}
                      className="
                        w-14 h-14 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-lg text-white/90
                      "
                    />
                    <InputOTPSlot
                      index={2}
                      className="
                        w-14 h-14 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-lg text-white/90
                      "
                    />
                    <InputOTPSlot
                      index={3}
                      className="
                        w-14 h-14 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-lg text-white/90
                      "
                    />
                    <InputOTPSlot
                      index={4}
                      className="
                        w-14 h-14 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-lg text-white/90
                      "
                    />
                    <InputOTPSlot
                      index={5}
                      className="
                        w-14 h-14 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-lg text-white/90
                      "
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {/* Submit Button with vibrant glossy gradient */}
            <Button
              type="submit"
              size="lg"
              disabled={code.length !== 6}
              className="
                w-full relative rounded-full px-6 py-5 text-base font-extrabold
                text-slate-900
                bg-gradient-to-r from-pink-300 via-amber-200 to-cyan-300
                border border-white/40
                shadow-[0_8px_24px_rgba(16,24,40,0.45)]
                hover:shadow-[0_12px_28px_rgba(16,24,40,0.55)]
                transition
                before:content-[''] before:absolute before:inset-0 before:rounded-full
                before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(255,255,255,0.08))]
                before:pointer-events-none
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Enter
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}