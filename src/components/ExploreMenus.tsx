import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import products from "@/data/products";

const prePackagedFlower = products.filter(p => p.category === "pre-packaged-flower");

const brands = [
  {
    name: prePackagedFlower[9]?.name || "Super Mario (3.5g)",
    image: prePackagedFlower[9]?.image || "/pre-packaged-flower/SUPER-MARIO.png",
    price: prePackagedFlower[9]?.price || 45,
    rating: 4.9,
    reviews: 247,
    deliveryTime: "30-45 min",
    distance: "2.1 mi",
    specialty: "Pre-Packaged Flower",
    badge: "Best Seller"
  },
  {
    name: prePackagedFlower[1]?.name || "Bowser (3.5g)",
    image: prePackagedFlower[1]?.image || "/pre-packaged-flower/BOWSER.png",
    price: prePackagedFlower[1]?.price || 45,
    rating: 4.7,
    reviews: 189,
    deliveryTime: "25-40 min",
    distance: "1.8 mi",
    specialty: "Pre-Packaged Flower",
    badge: "Top Rated"
  },
  {
    name: prePackagedFlower[11]?.name || "Yoshi (3.5g)",
    image: prePackagedFlower[11]?.image || "/pre-packaged-flower/YOSHI.png",
    price: prePackagedFlower[11]?.price || 45,
    rating: 4.8,
    reviews: 312,
    deliveryTime: "35-50 min",
    distance: "3.2 mi",
    specialty: "Pre-Packaged Flower",
    badge: "Popular"
  },
  {
    name: prePackagedFlower[4]?.name || "Luigi (3.5g)",
    image: prePackagedFlower[4]?.image || "/pre-packaged-flower/LUIGI.png",
    price: prePackagedFlower[4]?.price || 45,
    rating: 4.6,
    reviews: 156,
    deliveryTime: "20-35 min",
    distance: "1.2 mi",
    specialty: "Pre-Packaged Flower",
    badge: "New"
  },
  {
    name: prePackagedFlower[2]?.name || "Crunch Berries (3.5g)",
    image: prePackagedFlower[2]?.image || "/pre-packaged-flower/CRUNCH-BERRIES.jpeg",
    price: prePackagedFlower[2]?.price || 45,
    rating: 4.7,
    reviews: 203,
    deliveryTime: "25-40 min",
    distance: "1.5 mi",
    specialty: "Pre-Packaged Flower",
    badge: "Trending"
  },
  {
    name: prePackagedFlower[3]?.name || "Donkey Kong (3.5g)",
    image: prePackagedFlower[3]?.image || "/pre-packaged-flower/DONKEY-KONG.png",
    price: prePackagedFlower[3]?.price || 45,
    rating: 4.8,
    reviews: 278,
    deliveryTime: "30-45 min",
    distance: "2.3 mi",
    specialty: "Pre-Packaged Flower",
    badge: "Top Rated"
  },
  {
    name: prePackagedFlower[6]?.name || "Princess Peach (3.5g)",
    image: prePackagedFlower[6]?.image || "/pre-packaged-flower/PRINCESS-PEACH.jpg",
    price: prePackagedFlower[6]?.price || 45,
    rating: 4.9,
    reviews: 341,
    deliveryTime: "20-35 min",
    distance: "1.4 mi",
    specialty: "Pre-Packaged Flower",
    badge: "Best Seller"
  },
  {
    name: prePackagedFlower[10]?.name || "Vanilla Milkshake (3.5g)",
    image: prePackagedFlower[10]?.image || "/pre-packaged-flower/VANILLA-MILKSHAKE.png",
    price: prePackagedFlower[10]?.price || 45,
    rating: 4.7,
    reviews: 192,
    deliveryTime: "30-45 min",
    distance: "2.0 mi",
    specialty: "Pre-Packaged Flower",
    badge: "Popular"
  }
];

export default function ExploreMenus() {
  const navigate = useNavigate();

  const handleViewMenu = () => {
    navigate('/dashboard');
  };

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
            style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.8)' }}
          >
            The Candy Kitchen Best Sellers
          </h2>
          <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-lg">
            Our most popular pre-packaged flower. Lab-tested, premium quality cannabis
            with real customer reviews and fast delivery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {brands.map((brand, index) => (
            <Card
              key={index}
              className="bg-card/50 border-border/50 backdrop-blur-sm hover:scale-105 hover:shadow-glow transition-smooth group overflow-hidden cursor-pointer"
              onClick={handleViewMenu}
            >
              <div className="relative h-96 overflow-hidden bg-black/30">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                />
                <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                  {brand.badge}
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-foreground">
                  {brand.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <button className="
                  w-full relative rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide
                  text-white
                  bg-gradient-to-r from-[#FFC93B] via-[#FF4B4B] via-[#00A3FF] to-[#3CC65A]
                  shadow-[0_8px_24px_rgba(0,0,0,0.35)]
                  hover:scale-105 hover:shadow-[0_12px_30px_rgba(255,201,59,0.5)]
                  active:scale-95
                  transition-all duration-300 ease-out
                  cursor-pointer
                  before:content-[''] before:absolute before:inset-0 before:rounded-full
                  before:bg-gradient-to-b before:from-white/30 before:to-transparent
                  before:pointer-events-none
                ">
                  View Menu
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
