import { routes } from "@/routes";

export default function RoutesDebug() {
    return (
        <main
            className="min-h-screen text-foreground p-6 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/candy-shop.png)' }}
        >
            <h1 className="text-2xl font-bold mb-4 bg-gradient-holographic bg-clip-text text-transparent">
                Route Map
            </h1>
            <ul className="space-y-2">
                {routes.map(r => (
                    <li key={r.path} className="rounded-md border border-border p-3 bg-card/50">
                        <div className="font-mono text-sm text-primary">{r.path}</div>
                        <div className="text-muted-foreground text-sm">
                            {r.label}{r.private ? " • private" : ""}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3 text-golden">Application Flow</h2>
                <pre className="text-sm overflow-auto rounded-md border border-border p-4 bg-card/30 text-foreground">
                    {`Flow:
1) "/" → OTP Entry (Index) → on 6 digits → "/dashboard"
2) "/dashboard" → category filter → add to cart → checkout button (future: /checkout)
3) "*" → NotFound

Current Route Details:
• Landing Page: Hero with access code input (6-digit OTP)
• Dashboard: Product browsing with cart functionality
• Categories: Flower, House Flower, Edibles, Brownies, Concentrates, Vapes
• Cart: Add items, quantity management, price calculation
• Checkout: Fixed bottom bar (payment flow not implemented)

Future Routes to Consider:
• /checkout → Payment processing
• /login → User authentication
• /signup → Customer/Brand/Retailer registration
• /profile → User account management
• /orders → Order history and tracking
• /brand/[id] → Individual brand storefronts
• /admin → Administrative interface`}
                </pre>
            </div>
        </main>
    );
}