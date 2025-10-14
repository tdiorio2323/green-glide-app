import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Users, Trophy, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Gift,
    title: "Earn on Every Order",
    description: "Collect 10 points per $1 spent. Redeem anytime for discounts and free products."
  },
  {
    icon: Users,
    title: "Refer & Earn $20",
    description: "Share your code. When friends place their first order, you both get $20 credit."
  },
  {
    icon: Trophy,
    title: "Level Up for Perks",
    description: "Unlock tiers: Silver, Gold, Platinum. Get early access to new drops and exclusive deals."
  },
  {
    icon: Sparkles,
    title: "VIP Treatment",
    description: "Birthday surprises, free delivery upgrades, and members-only flash sales."
  }
];

export default function LoyaltySection() {
  return (
    <section className="py-24 px-6 bg-card/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
            style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.8)' }}
          >
            Join The Candy Club Rewards
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-lg">
            Turn every order into rewards. Earn points automatically, refer friends for instant credit, 
            and unlock VIP perks as you level up.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="bg-gradient-to-br from-primary/10 to-accent/10 border-border/50 backdrop-blur-sm hover:scale-105 transition-bounce group"
            >
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-holographic w-fit group-hover:shadow-glow transition-smooth">
                  <benefit.icon className="h-8 w-8 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="golden" size="lg" className="text-lg px-8">
            Sign Up Free
          </Button>
        </div>
      </div>
    </section>
  );
}
