import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

const merchProducts = [
  {
    name: "Candyman Logo Hat",
    price: 28,
    image: "/merch/candyman-hat.png",
    description: "Structured snapback with holographic logo embroidery and ventilated mesh back."
  },
  {
    name: "Candyman Black Hoodie",
    price: 68,
    image: "/merch/candyman-black-hoodie.png",
    description: "Heavyweight fleece hoodie with glow-in-the-dark sleeve print and kangaroo pocket."
  },
  {
    name: "Candy Shop Tee",
    price: 34,
    image: "/merch/candyman-shirt.jpg",
    description: "Pigment-dyed tee featuring the classic drip logo and soft-hand screen print."
  }
];

export default function UserRoles() {
  return (
    <section className="py-24 px-6 bg-gradient-subtle">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-holographic bg-clip-text text-transparent"
            style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.8)' }}
          >
            Official Candyman Merch
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-lg">
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
              <div className="relative h-80 overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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
