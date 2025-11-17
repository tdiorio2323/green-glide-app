import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import doubleFudgeBrownie from "@/assets/double-fudge-brownie.png";
import blueRaspberryLemonade from "@/assets/blue-raspberry-lemonade.jpeg";
import birthdayCakeCookie from "@/assets/birthday-cake-cookie.png";
import luckyCharms from "@/assets/lucky-charms.jpg";

const brands = [
  {
    name: "1000mg Double Fudge Brownie",
    image: doubleFudgeBrownie,
    rating: 4.9,
    reviews: 247,
    deliveryTime: "30-45 min",
    distance: "2.1 mi",
    specialty: "Premium Brownie",
    badge: "Best Seller"
  },
  {
    name: "Blue Raspberry Lemonade",
    image: blueRaspberryLemonade,
    rating: 4.7,
    reviews: 189,
    deliveryTime: "25-40 min",
    distance: "1.8 mi",
    specialty: "BEVERAGE",
    badge: "Top Rated"
  },
  {
    name: "500mg Birthday Cake Cookie",
    image: birthdayCakeCookie,
    rating: 4.8,
    reviews: 312,
    deliveryTime: "35-50 min",
    distance: "3.2 mi",
    specialty: "Cookie Dough Cookie",
    badge: "Popular"
  },
  {
    name: "Lucky Charms Strawberry Shortcake",
    image: luckyCharms,
    rating: 4.6,
    reviews: 156,
    deliveryTime: "20-35 min",
    distance: "1.2 mi",
    specialty: "Premium Flower",
    badge: "New"
  }
];

export default function ExploreMenus() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-holographic bg-clip-text text-transparent"
            style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.8)' }}
          >
            The Candy Kitchen Best Sellers
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-lg">
            Our most popular products. Lab-tested, premium quality edibles, beverages, and flower 
            with real customer reviews and fast delivery.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {brands.map((brand, index) => (
            <Card 
              key={index} 
              className="bg-card/50 border-border/50 backdrop-blur-sm hover:scale-105 hover:shadow-glow transition-smooth group overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                  {brand.badge}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  {brand.name}
                </CardTitle>
                <CardDescription className="text-accent font-medium">
                  {brand.specialty}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-golden text-golden" />
                    <span className="font-semibold text-foreground">{brand.rating}</span>
                    <span className="text-muted-foreground">({brand.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{brand.distance}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{brand.deliveryTime}</span>
                </div>
                
                <Button variant="holographic" className="w-full">
                  View Menu
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
