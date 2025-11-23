import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const heroImage = "/td-white.jpg";

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

      {/* Access Code Interface - positioned above button */}
      <div className="relative z-10 px-6 pb-6">
        <div className="w-full max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 via-white to-green-600 bg-clip-text text-transparent drop-shadow-lg">
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
        <button
          type="submit"
          disabled={code.length !== 4}
          onClick={handleSubmit}
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
          Enter TD STUDIOS
        </button>
      </div>
    </section>
  );
}