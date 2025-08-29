import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import cabanaLogo from "@/assets/cabana-logo.png";
import tropicalBg from "@/assets/tropical-background.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${tropicalBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-tropical opacity-80" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="flex justify-center mb-8">
          <img 
            src={cabanaLogo} 
            alt="CABANA" 
            className="h-32 w-auto drop-shadow-2xl animate-pulse"
          />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-holographic bg-clip-text text-transparent">
          Cannabis Delivered
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Your neighborhood cannabis marketplace. Connect with local brands, 
          explore premium products, and enjoy safe delivery to your door.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="holographic" size="lg" className="min-w-48">
            Start Shopping
          </Button>
          <Button variant="hero" size="lg" className="min-w-48">
            Join as Brand
          </Button>
        </div>
      </div>
    </section>
  );
}