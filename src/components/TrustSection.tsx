import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Leaf, Truck } from "lucide-react";

const trustPoints = [
  {
    icon: Heart,
    title: "Community First",
    description: "Building relationships between neighbors, not just transactions"
  },
  {
    icon: Users,
    title: "Local Brands",
    description: "Supporting small businesses and artisan cultivators in your area"
  },
  {
    icon: Leaf,
    title: "Premium Quality",
    description: "Curated selection of tested, compliant cannabis products"
  },
  {
    icon: Truck,
    title: "Safe Delivery",
    description: "Secure, discreet delivery with verified age and compliance checks"
  }
];

export default function TrustSection() {
  return (
    <section className="py-24 px-6 bg-card/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
            style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.8)' }}
          >
            Why Choose The Candy Shop?
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-lg">
            More than a marketplace—we're building a trusted community where 
            quality, safety, and relationships come first.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {trustPoints.map((point, index) => (
            <Card key={index} className="bg-card/30 border-border/30 backdrop-blur-sm hover:bg-card/50 transition-smooth group">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-accent/20 w-fit group-hover:bg-accent/30 transition-smooth">
                  <point.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}