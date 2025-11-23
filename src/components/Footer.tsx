export default function Footer() {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50">
      <div className="container mx-auto px-6 py-16">
        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">
            © 2025 TD STUDIOS. All rights reserved.
          </p>
          <p className="text-xs">
            This product is for adults 21+ only. Please consume responsibly. 
            Not available in all areas. Licensed under state cannabis laws.
          </p>
        </div>
      </div>
    </footer>
  );
}
