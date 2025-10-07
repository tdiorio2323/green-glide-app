import { Button } from "@/components/ui/button";
import candymanLogo from "@/assets/candyman-logo.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-tropical" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="flex justify-center mb-8">
          <img 
            src={candymanLogo} 
            alt="Candyman Exotics" 
            className="h-48 w-auto drop-shadow-2xl hover:scale-105 transition-smooth"
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-holographic bg-clip-text text-transparent">
          The Candy Shop
        </h1>
        
        <p className="text-2xl md:text-3xl text-accent font-semibold mb-6">
          Powered by Candyman Exotics
        </p>
        
        <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Browse curated menus from licensed local dispensaries. Order premium cannabis 
          and get it delivered safely to your door—just like your favorite food delivery.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="holographic" size="lg" className="min-w-48">
            🍬 Start Shopping
          </Button>
          <Button variant="hero" size="lg" className="min-w-48">
            🍭 List Your Brand
          </Button>
        </div>
        
        <p className="text-sm text-foreground/60 mt-6">
          Must be 21+ with valid ID • Free delivery on orders $50+
        </p>
      </div>
    </section>
  );
}