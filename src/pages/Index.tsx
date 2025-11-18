import Hero from "@/components/Hero";
import ExploreMenus from "@/components/ExploreMenus";
import Footer from "@/components/Footer";
import mainBackground from "@/assets/main-background.jpg";

const Index = () => {
  return (
    <main
      className="min-h-screen bg-background bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${mainBackground})` }}
    >
      <Hero />
      <ExploreMenus />
      <Footer />
    </main>
  );
};

export default Index;
