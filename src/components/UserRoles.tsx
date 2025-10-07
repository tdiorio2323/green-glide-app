import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Store, Shield } from "lucide-react";

const roles = [
  {
    icon: ShoppingCart,
    title: "Customers",
    subtitle: "Browse, Order, Enjoy",
    description: "Discover premium cannabis from trusted local brands. Browse curated menus, read reviews, and get products delivered safely to your door.",
    features: [
      "Explore local dispensary menus",
      "Safe & secure delivery",
      "Build loyalty with favorites",
      "Track orders in real-time"
    ],
    cta: "Start Shopping",
    ctaVariant: "holographic" as const
  },
  {
    icon: Store,
    title: "Brands",
    subtitle: "Manage, Engage, Grow",
    description: "Connect directly with your community. Manage your menu, engage customers, and build lasting relationships through our platform.",
    features: [
      "Manage product catalog",
      "Direct customer engagement",
      "Analytics & insights",
      "Loyalty program tools"
    ],
    cta: "Join Platform",
    ctaVariant: "golden" as const
  },
  {
    icon: Shield,
    title: "Super Admin",
    subtitle: "Ensure, Oversee, Optimize",
    description: "Maintain compliance, ensure safety, and keep operations running smoothly. Advanced tools for platform management and oversight.",
    features: [
      "Compliance monitoring",
      "Safety protocols",
      "Platform analytics",
      "User management"
    ],
    cta: "Admin Access",
    ctaVariant: "hero" as const
  }
];

export default function UserRoles() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-holographic bg-clip-text text-transparent">
            Built for Everyone
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're shopping, selling, or overseeing, The Candy Shop creates 
            seamless experiences for every role in the cannabis community.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <Card key={index} className="bg-card/50 border-border/50 backdrop-blur-sm hover:scale-105 transition-bounce group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/20 w-fit group-hover:shadow-glow transition-smooth">
                  <role.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {role.title}
                </CardTitle>
                <CardDescription className="text-accent font-medium">
                  {role.subtitle}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {role.description}
                </p>
                
                <ul className="space-y-2">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-foreground/80">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button variant={role.ctaVariant} className="w-full">
                  {role.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}