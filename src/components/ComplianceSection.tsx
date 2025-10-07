import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, FileCheck, Lock, Award } from "lucide-react";

const compliancePoints = [
  {
    icon: ShieldCheck,
    title: "Age Verification",
    description: "ID checked on every delivery - 21+ only"
  },
  {
    icon: FileCheck,
    title: "Licensed Brands",
    description: "All products from state-licensed dispensaries"
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Bank-level encryption protects your data"
  },
  {
    icon: Award,
    title: "Lab Tested",
    description: "Third-party tested for purity and potency"
  }
];

export default function ComplianceSection() {
  return (
    <section className="py-16 px-6 bg-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Safe, Legal, & Trusted
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your safety is our priority. Every step is compliant, secure, and transparent
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {compliancePoints.map((point, index) => (
            <Card 
              key={index} 
              className="bg-card/30 border-border/30 backdrop-blur-sm hover:bg-card/50 transition-smooth text-center"
            >
              <CardContent className="p-6">
                <div className="mx-auto mb-3 p-3 rounded-full bg-accent/20 w-fit">
                  <point.icon className="h-6 w-6 text-accent" />
                </div>
                <h4 className="text-base font-semibold text-foreground mb-2">
                  {point.title}
                </h4>
                <p className="text-sm text-muted-foreground">
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
