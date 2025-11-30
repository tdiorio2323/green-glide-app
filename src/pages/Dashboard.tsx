import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Instagram, Phone, ShoppingBag, Sparkles } from "lucide-react";
import { categories } from "@/data/categories";
import products from "@/data/products";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { tds } from "@/lib/theme";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("holiday");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const filtered = products.filter(p => p.category === selectedCategory);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <main className="min-h-screen text-white bg-luxury-spotlight pb-24">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          scrolled ? "bg-luxury-dark/80 backdrop-blur-xl border-white/5 py-2 shadow-lg" : "bg-transparent py-4"
        )}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
          <div className="flex-1 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-golden">
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
            </div>
            <p className={cn("text-sm transition-opacity duration-300", scrolled ? "opacity-100" : "opacity-0 hidden sm:block")}>
              <span className="font-bold text-white tracking-wider">TD STUDIOS</span>
            </p>
          </div>

          <Link to="/" className="flex-1 flex justify-center hover:scale-105 transition-transform duration-300">
            <img
              src="/td-studios-xmas-logo.png"
              alt="TD STUDIOS"
              className={cn(
                "w-auto drop-shadow-2xl cursor-pointer select-none pointer-events-none transition-all duration-300",
                scrolled ? "h-12" : "h-20 animate-float"
              )}
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </Link>

          <div className="flex gap-4 items-center flex-1 justify-end">
            <a
              href="tel:+13474859935"
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/tdstudiosco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero / Welcome Section */}
      <section className="pt-32 pb-8 px-4 text-center space-y-4">
        <ScrollReveal>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
            Premium Selection
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
            Curated exotic snacks and essentials for the connoisseur.
          </p>
        </ScrollReveal>
      </section>

      {/* Category Slider */}
      <div className="sticky top-[60px] z-40 bg-luxury-dark/80 backdrop-blur-xl border-y border-white/5 shadow-2xl">
        <div className="flex overflow-x-auto gap-3 px-4 py-4 no-scrollbar items-center">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "relative flex-shrink-0 rounded-full px-6 py-2.5 text-sm font-bold tracking-wide transition-all duration-300",
                cat.id === selectedCategory
                  ? "text-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white hover:scale-105 border border-white/5"
              )}
              style={{
                background: cat.id === selectedCategory
                  ? "linear-gradient(90deg, #FFC93B 0%, #FF4B4B 50%, #00A3FF 100%)"
                  : undefined
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, idx) => (
          <ScrollReveal key={p.id} delay={(idx % 5) * 50} className="h-full">
            <Card
              className={cn(
                "group relative h-full flex flex-row sm:flex-col items-center gap-4 p-4 rounded-[2rem] overflow-hidden border-0",
                "bg-white/5 backdrop-blur-md border border-white/10",
                "hover:bg-white/10 transition-all duration-500",
                "glass-card-hover"
              )}
            >
              {/* Image Container */}
              <div className="relative w-32 h-32 sm:w-full sm:h-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-white/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  draggable="false"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-xs font-bold text-amber-300">${p.price}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between w-full gap-3">
                <div>
                  <h3 className="font-bold text-lg text-white/90 leading-tight group-hover:text-white transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{p.category}</p>
                </div>

                <button
                  onClick={() => addToCart(p)}
                  className="
                    w-full mt-auto
                    relative overflow-hidden rounded-xl py-3 px-4
                    bg-white/10 hover:bg-white/20
                    border border-white/10 hover:border-white/30
                    group/btn transition-all duration-300
                  "
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </span>
                </button>
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {/* Checkout Bar */}
      <div className={cn(
        "fixed bottom-6 left-4 right-4 z-50 transition-all duration-500 transform",
        cart.length > 0 ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"
      )}>
        <div className="max-w-md mx-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 pr-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 pl-4">
            <div className="bg-white/10 rounded-full p-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Total</p>
              <p className="text-white font-bold text-lg leading-none">${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <button className="
            relative rounded-2xl px-8 py-3.5 text-sm font-bold uppercase tracking-wide
            text-white
            bg-gradient-to-r from-[#FFC93B] via-[#FF4B4B] via-[#00A3FF] to-[#3CC65A]
            shadow-lg shadow-amber-500/20
            hover:shadow-amber-500/40 hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-300
          ">
            Checkout ({totalItems})
          </button>
        </div>
      </div>
    </main>
  );
}
