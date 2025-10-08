import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/candy-shop.png)' }}
    >
      <div className="text-center bg-card/80 backdrop-blur-sm p-8 rounded-lg border border-border">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-holographic bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline font-semibold">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
