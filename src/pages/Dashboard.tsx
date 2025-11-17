import { useState } from "react";
import { categories } from "@/data/categories";
import products from "@/data/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("flower");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filtered = products.filter(p => p.category === selectedCategory);

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
    <main
      className="min-h-screen text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/candy-shop.png)' }}
    >
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex justify-center">
          <img
            src="/candy-kitchen-logo.png"
            alt="The Candy Kitchen"
            className="h-16 w-auto drop-shadow-lg"
          />
        </div>
      </div>

      {/* Category Slider */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex overflow-x-auto gap-2 px-4 py-3">
          {categories.map(cat => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                rounded-full px-5 py-2 text-sm font-semibold
                ${cat.id === selectedCategory
                  ? "bg-gradient-to-r from-fuchsia-400 via-amber-300 to-cyan-300 text-black"
                  : "bg-white/8 text-white/80 ring-1 ring-white/10 hover:bg-white/12"}
              `}
              variant="ghost"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-4 px-4 py-6">
        {filtered.map(p => (
          <Card
            key={p.id}
            className="
              flex items-center gap-4 p-4
              rounded-3xl
              bg-white/6 backdrop-blur-2xl
              ring-1 ring-white/10 hover:ring-white/20
              shadow-[0_10px_30px_rgba(0,0,0,0.35)]
              transition
            "
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/15 bg-black/30"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white/95">{p.name}</h3>
              <p className="text-sm font-semibold text-amber-300">${p.price.toFixed(2)}</p>
            </div>
            <Button
              onClick={() => addToCart(p)}
              className="
                relative rounded-full px-4 py-2 text-sm font-bold text-slate-900
                bg-gradient-to-r from-fuchsia-300 via-amber-200 to-cyan-300
                shadow-[0_8px_24px_rgba(0,0,0,0.35)]
                hover:opacity-95
                before:content-[''] before:absolute before:inset-0 before:rounded-full
                before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(255,255,255,0.08))]
                before:pointer-events-none
              "
            >
              Add to Cart
            </Button>
          </Card>
        ))}
      </div>

      {/* Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 flex justify-between items-center z-30">
          <div>
            <p className="font-medium text-white">
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </p>
            <p className="text-green-400 font-bold text-lg">${totalPrice.toFixed(2)}</p>
          </div>
          <button className="bg-gradient-to-r from-green-400 to-emerald-500 text-black font-bold px-8 py-3 rounded-full hover:opacity-90">
            Checkout
          </button>
        </div>
      )}
    </main>
  );
}
