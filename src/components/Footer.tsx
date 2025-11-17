import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import candyKitchenLogo from "@/assets/candy-kitchen-logo.png";

export default function Footer() {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50">
      <div className="container mx-auto px-6 py-16">
        {/* CTA Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <img 
              src={candyKitchenLogo} 
              alt="The Candy Kitchen" 
              className="h-24 w-auto"
            />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-holographic bg-clip-text text-transparent">
            Join The Candy Club Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sign up now and get $10 off your first order. Start earning rewards, discover local favorites, 
            and enjoy safe delivery straight to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="holographic" size="lg" className="text-lg px-8">
              🍬 Get Started Free
            </Button>
            <Button variant="hero" size="lg" className="text-lg px-8">
              Log In
            </Button>
          </div>
        </div>
        
        <Separator className="mb-12" />
        
        {/* Footer Links */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-smooth">Browse Brands</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Featured Products</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Deals</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">New Arrivals</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Brands</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-smooth">Join Platform</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Brand Portal</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Resources</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-smooth">Help Center</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Delivery Info</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Returns</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Compliance</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Accessibility</a></li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">
            © 2025 The Candy Kitchen. All rights reserved.
          </p>
          <p className="text-xs">
            This product is for adults 21+ only. Please consume responsibly. 
            Not available in all areas. Licensed under state cannabis laws.
          </p>
        </div>
      </div>
    </footer>
  );
}
