import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import candymanLogo from "@/assets/candyman-logo.jpg";

const merchProducts = [
  {
    name: "Candyman Exotics T-Shirt",
    price: 29.99,
    image: candymanLogo,
    description: "Premium cotton tee with official Candyman branding"
  },
  {
    name: "Candyman Hoodie",
    price: 54.99,
    image: candymanLogo,
    description: "Cozy pullover hoodie featuring The Candy Shop logo"
  },
  {
    name: "Candyman Snapback",
    price: 24.99,
    image: candymanLogo,
    description: "Classic snapback with embroidered Candyman Exotics logo"
  }
];

export default function UserRoles() {
  return (
    <section className="py-24 px-6 bg-gradient-subtle">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-holographic bg-clip-text text-transparent">
            Official Candyman Merch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rep the brand with exclusive Candyman Exotics apparel and accessories. 
            Premium quality, limited drops.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {merchProducts.map((product, index) => (
            <Card 
              key={index}
              className="bg-card/50 border-border/50 backdrop-blur-sm hover:scale-105 hover:shadow-glow transition-smooth overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  {product.name}
                </CardTitle>
                <p className="text-2xl font-bold text-accent">
                  ${product.price}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {product.description}
                </p>
                
                <Button variant="holographic" className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}