import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import heroImage from "@/assets/candy-shop-hero.png";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-Screen Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="The Candy Shop"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient at bottom only */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      </div>

      {/* Centered Access Code Interface */}
      <div className="relative z-10 container mx-auto px-6">
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
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot
                      index={0}
                      className="w-12 h-14 text-xl border-primary/50 bg-card/50 backdrop-blur-sm text-foreground focus:border-primary focus:ring-primary/50 shadow-glow"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-12 h-14 text-xl border-primary/50 bg-card/50 backdrop-blur-sm text-foreground focus:border-primary focus:ring-primary/50 shadow-glow"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-12 h-14 text-xl border-primary/50 bg-card/50 backdrop-blur-sm text-foreground focus:border-primary focus:ring-primary/50 shadow-glow"
                    />
                    <InputOTPSlot
                      index={3}
                      className="w-12 h-14 text-xl border-primary/50 bg-card/50 backdrop-blur-sm text-foreground focus:border-primary focus:ring-primary/50 shadow-glow"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-12 h-14 text-xl border-primary/50 bg-card/50 backdrop-blur-sm text-foreground focus:border-primary focus:ring-primary/50 shadow-glow"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-12 h-14 text-xl border-primary/50 bg-card/50 backdrop-blur-sm text-foreground focus:border-primary focus:ring-primary/50 shadow-glow"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            {/* Submit Button with holographic gradient */}
            <Button
              type="submit"
              size="lg"
              disabled={code.length !== 6}
              className="w-full bg-gradient-holographic hover:opacity-90 text-foreground font-semibold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Enter
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}