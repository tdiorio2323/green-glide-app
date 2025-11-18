import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { categories } from "@/data/categories";
import products from "@/data/products";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/candy-kitchen-hero.png";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("pre-packaged-flower");
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
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/" className="flex-1 flex justify-center">
            <img
              src="/candy-kitchen-logo.png"
              alt="The Candy Kitchen"
              className="h-16 w-auto drop-shadow-lg hover:opacity-90 transition cursor-pointer"
            />
          </Link>
          <a
            href="https://www.instagram.com/thecandykitchen_213/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-accent transition-colors"
          >
            <Instagram className="h-6 w-6" />
          </a>
        </div>
      </div>

      {/* Category Slider */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex overflow-x-auto gap-2 px-4 py-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                rounded-full px-5 py-2 text-sm font-semibold
                ${cat.id === selectedCategory
                  ? "bg-gradient-to-r from-[#FFC93B] via-[#FF4B4B] via-[#00A3FF] to-[#3CC65A] text-white"
                  : "bg-white/8 text-white/80 ring-1 ring-white/10 hover:bg-white/12"}
              `}
            >
              {cat.name}
            </button>
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
              className="w-16 h-16 rounded-2xl object-contain ring-1 ring-white/15 bg-black/30"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white/95">{p.name}</h3>
              <p className="text-sm font-semibold text-amber-300">${p.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => addToCart(p)}
              className="
                relative rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wide
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
              "
            >
              Add to Cart
            </button>
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
          <button className="
            relative rounded-full px-8 py-3 text-base font-bold uppercase tracking-wide
            text-white
            bg-gradient-to-r from-[#FFC93B] via-[#FF4B4B] via-[#00A3FF] to-[#3CC65A]
            shadow-[0_10px_30px_rgba(0,0,0,0.3)]
            hover:scale-105 hover:shadow-[0_15px_40px_rgba(255,201,59,0.6)]
            active:scale-95
            transition-all duration-300 ease-out
            cursor-pointer
            before:content-[''] before:absolute before:inset-0 before:rounded-full
            before:bg-gradient-to-b before:from-white/30 before:to-transparent
            before:pointer-events-none
          ">
            Checkout
          </button>
        </div>
      )}
    </main>
  );
}
