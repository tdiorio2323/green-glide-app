import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import products from "@/data/products";

const holidayProducts = products.filter(p => p.category === "holiday").slice(0, 8);

const brands = holidayProducts.map(product => ({
  name: product.name,
  image: product.image,
  price: product.price,
  rating: 4.9,
  reviews: Math.floor(Math.random() * 300) + 100,
  deliveryTime: "30-45 min",
  distance: "2.1 mi",
  specialty: "Holiday Special",
  badge: "Best Seller"
}));

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
            TD STUDIOS Best Sellers
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
                  className="w-full h-full object-cover group-hover:scale-110 transition-smooth select-none pointer-events-none"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
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
