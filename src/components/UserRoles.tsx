import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Store, Shield } from "lucide-react";

const roles = [
  {
    icon: ShoppingCart,
    title: "Customers",
    subtitle: "Browse, Order, Enjoy",
    description: "Shop from licensed local dispensaries. Browse real-time menus, compare products and prices, read verified reviews, and track your delivery from checkout to your door.",
    features: [
      "Real-time menus & inventory",
      "Verified reviews & ratings",
      "Earn rewards on every order",
      "Same-day delivery available"
    ],
    cta: "🍬 Start Shopping",
    ctaVariant: "holographic" as const
  },
  {
    icon: Store,
    title: "Brands",
    subtitle: "Manage, Engage, Grow",
    description: "Reach customers directly through your own storefront. Update menus in real-time, run promotions, respond to reviews, and build customer loyalty—all from one dashboard.",
    features: [
      "Custom storefront & branding",
      "Real-time menu management",
      "Customer insights & analytics",
      "Built-in marketing tools"
    ],
    cta: "🍭 List Your Brand",
    ctaVariant: "golden" as const
  },
  {
    icon: Shield,
    title: "Super Admin",
    subtitle: "Oversee, Protect, Scale",
    description: "Keep the marketplace safe, compliant, and running smoothly. Monitor all transactions, verify licenses, manage disputes, and maintain platform integrity with comprehensive admin tools.",
    features: [
      "License & compliance verification",
      "Transaction monitoring",
      "Dispute resolution tools",
      "Platform-wide analytics"
    ],
    cta: "Admin Dashboard",
    ctaVariant: "hero" as const
  }
];

export default function UserRoles() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-holographic bg-clip-text text-transparent">
            A Platform Built for Everyone
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're ordering your favorites, growing your brand, or managing the marketplace, 
            The Candy Shop delivers the tools you need to succeed.
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