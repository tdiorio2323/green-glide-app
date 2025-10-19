import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const merch = [
  {
    name: "Candyman Logo Hat",
    image: "/merch/candyman-hat.png",
    price: 28,
    description: "Structured snapback with the holographic Candyman wordmark and soft mesh back."
  },
  {
    name: "Official Black Hoodie",
    image: "/merch/candyman-black-hoodie.png",
    price: 68,
    description: "Heavyweight fleece hoodie with glow-in-the-dark sleeve print and kangaroo pocket."
  },
  {
    name: "Candy Shop Tee",
    image: "/merch/candyman-shirt.jpg",
    price: 34,
    description: "Pigment-dyed tee featuring our classic drip logo and soft-hand screen print."
  }
];

export default function OfficialMerch() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background via-background/95 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-holographic bg-clip-text text-transparent">
            Official Candyman Merch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rep the Candy Shop everywhere you go. Limited-release drops ship in 3-5 business days 
            with free stickers in every box.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {merch.map(item => (
            <Card
              key={item.name}
              className="bg-card/60 border-border/50 backdrop-blur-sm overflow-hidden hover:shadow-glow transition-bounce group"
            >
              <div className="relative h-80 bg-muted/20">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              <CardHeader>
                <CardTitle className="text-2xl text-foreground">{item.name}</CardTitle>
                <CardDescription className="text-accent font-semibold">${item.price}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                <Button variant="hero" className="w-full">
                  Add to Merch Drop
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
