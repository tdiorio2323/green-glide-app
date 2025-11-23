import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Page } from "@/components/layout/Page";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Page title="404 - Page Not Found">
          <div className="text-center py-8">
            <div className="text-6xl font-bold mb-4 bg-gradient-holographic bg-clip-text text-transparent">404</div>
            <p className="text-xl text-muted-foreground mb-6">
              The page <code className="text-primary font-mono">{location.pathname}</code> doesn't exist
            </p>
            <a href="/" className="text-primary hover:text-primary/80 underline font-semibold">
              Return to Home
            </a>
          </div>
        </Page>
      </div>
    </main>
  );
};

export default NotFound;
