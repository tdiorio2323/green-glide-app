import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const categories = [
  { id: "flower", label: "Flower" },
  { id: "house-flower", label: "House Flower" },
  { id: "edibles", label: "Edibles" },
  { id: "brownies", label: "Brownies" },
  { id: "concentrates", label: "Concentrates" },
  { id: "vapes", label: "Vapes" },
];

const products = [
  // Flower
  { id: 1, name: "Candy Kush 3.5g", category: "flower", price: 45, img: "/placeholder.svg" },
  { id: 2, name: "Bubble Pop 7g", category: "flower", price: 80, img: "/placeholder.svg" },
  { id: 3, name: "Purple Haze 3.5g", category: "flower", price: 50, img: "/placeholder.svg" },

  // House Flower
  { id: 4, name: "House Blend #1 – 1oz", category: "house-flower", price: 120, img: "/placeholder.svg" },
  { id: 5, name: "Shake Mix (½oz)", category: "house-flower", price: 40, img: "/placeholder.svg" },
  { id: 6, name: "Loose Flower Mix 1oz", category: "house-flower", price: 100, img: "/placeholder.svg" },

  // Edibles
  { id: 7, name: "Gummy Pack (100mg)", category: "edibles", price: 25, img: "/placeholder.svg" },
  { id: 8, name: "Chocolate Bar (100mg)", category: "edibles", price: 30, img: "/placeholder.svg" },

  // Brownies
  { id: 9, name: "Double Fudge Brownie (100mg)", category: "brownies", price: 30, img: "/placeholder.svg" },
  { id: 10, name: "Mint Chocolate Brownie (100mg)", category: "brownies", price: 32, img: "/placeholder.svg" },

  // Concentrates
  { id: 11, name: "Candy Wax 1g", category: "concentrates", price: 60, img: "/placeholder.svg" },
  { id: 12, name: "Shatter 1g", category: "concentrates", price: 55, img: "/placeholder.svg" },
  { id: 13, name: "Live Resin 1g", category: "concentrates", price: 70, img: "/placeholder.svg" },

  // Vapes
  { id: 14, name: "Cotton Candy Vape Pen 1g", category: "vapes", price: 55, img: "/placeholder.svg" },
  { id: 15, name: "Blue Dream Cart 0.5g", category: "vapes", price: 40, img: "/placeholder.svg" },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("flower");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filtered = products.filter((p) => p.category === selectedCategory);

  const addToCart = (item: typeof products[0]) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-2xl font-bold bg-gradient-holographic bg-clip-text text-transparent text-center">
          Candyman Exotics
        </h1>
      </div>

      {/* Category Slider */}
      <div className="sticky top-0 bg-background/90 backdrop-blur-md z-20 border-b border-border">
        <div className="flex gap-3 overflow-x-auto p-3 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={cat.id === selectedCategory ? "default" : "ghost"}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap font-semibold px-4 py-2 ${
                cat.id === selectedCategory
                  ? "bg-gradient-holographic text-foreground shadow-glow"
                  : "hover:bg-accent/20"
              }`}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="grid gap-4 p-6">
        {filtered.map((p) => (
          <Card
            key={p.id}
            className="flex items-center gap-4 p-4 bg-card/60 backdrop-blur-sm border-border hover:border-primary/50 transition-all"
          >
            <img
              src={p.img}
              alt={p.name}
              className="w-20 h-20 object-cover rounded-md border border-border"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-sm text-golden font-semibold">${p.price.toFixed(2)}</p>
            </div>
            <Button
              variant="default"
              onClick={() => addToCart(p)}
              className="bg-gradient-holographic hover:opacity-90 text-foreground font-semibold shadow-glow"
            >
              Add to Cart
            </Button>
          </Card>
        ))}
      </div>

      {/* Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 flex justify-between items-center shadow-glow z-30">
          <div>
            <p className="font-medium text-foreground">
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </p>
            <p className="text-golden font-bold text-lg">${totalPrice.toFixed(2)}</p>
          </div>
          <Button
            size="lg"
            className="bg-gradient-holographic hover:opacity-90 text-foreground font-bold shadow-golden px-8"
          >
            Checkout
          </Button>
        </div>
      )}
    </main>
  );
}
