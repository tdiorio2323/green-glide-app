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

    // Any 4-digit code grants entry
    if (code && code.length === 4) {
      navigate("/dashboard");
    }
  };

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Full-Screen Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="The Candy Kitchen"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      {/* Centered Logo with breathing animation */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <img
          src="/candy-kitchen-logo.png"
          alt="The Candy Kitchen"
          className="h-32 md:h-40 w-auto drop-shadow-2xl animate-[breathe_3s_ease-in-out_infinite]"
        />
      </div>

      {/* Access Code Interface - centered on screen */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-holographic bg-clip-text text-transparent drop-shadow-lg">
                Enter Access Code
              </h2>

              {/* 4-Digit OTP Input with holographic styling */}
              <div className="flex justify-center">
                <InputOTP
                  maxLength={4}
                  value={code}
                  onChange={(value) => setCode(value)}
                  className="gap-2"
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot
                      index={0}
                      className="
                        w-16 h-16 md:w-20 md:h-20 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-xl md:text-2xl text-white/90 font-bold
                      "
                    />
                    <InputOTPSlot
                      index={1}
                      className="
                        w-16 h-16 md:w-20 md:h-20 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-xl md:text-2xl text-white/90 font-bold
                      "
                    />
                    <InputOTPSlot
                      index={2}
                      className="
                        w-16 h-16 md:w-20 md:h-20 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-xl md:text-2xl text-white/90 font-bold
                      "
                    />
                    <InputOTPSlot
                      index={3}
                      className="
                        w-16 h-16 md:w-20 md:h-20 rounded-full
                        bg-white/20 backdrop-blur-xl
                        border border-white/40 ring-1 ring-white/40
                        focus:ring-2 focus:ring-emerald-300/80
                        shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_4px_12px_rgba(0,0,0,0.25)]
                        text-xl md:text-2xl text-white/90 font-bold
                      "
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Candy-Colored Button at Bottom */}
      <div className="relative z-10 px-6 pb-8 md:pb-12">
        <Button
          type="submit"
          size="lg"
          disabled={code.length !== 4}
          onClick={handleSubmit}
          className="
            w-full relative rounded-full px-8 py-6 text-lg md:text-xl font-extrabold
            text-white
            bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500
            border-2 border-white/50
            shadow-[0_10px_30px_rgba(236,72,153,0.5)]
            hover:shadow-[0_15px_40px_rgba(236,72,153,0.7)]
            hover:scale-105
            transition-all duration-300
            before:content-[''] before:absolute before:inset-0 before:rounded-full
            before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.4),rgba(255,255,255,0))]
            before:pointer-events-none
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          Enter The Candy Kitchen
        </Button>
      </div>
    </section>
  );
}