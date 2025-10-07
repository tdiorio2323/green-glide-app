import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Users, Trophy, Sparkles } from "lucide-react";

const benefits = [
  {
    icon: Gift,
    title: "Earn Points",
    description: "Get 10 points for every dollar spent on orders"
  },
  {
    icon: Users,
    title: "Refer Friends",
    description: "Earn $20 credit when friends make their first order"
  },
  {
    icon: Trophy,
    title: "Level Up",
    description: "Unlock exclusive perks and early access to drops"
  },
  {
    icon: Sparkles,
    title: "VIP Rewards",
    description: "Birthday gifts, free delivery, and surprise bonuses"
  }
];

export default function LoyaltySection() {
  return (
    <section className="py-24 px-6 bg-card/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Join The Candy Club
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get rewarded for every order. Share the love, earn points, and unlock exclusive benefits
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
