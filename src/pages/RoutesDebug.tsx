import { routes } from "@/routes";
import { Page } from "@/components/layout/Page";

export default function RoutesDebug() {
    return (
        <main className="min-h-screen text-foreground p-6">
            <Page
                title="Route Map"
                description="Debug view of all registered routes and application flow"
            >
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
1) "/" → OTP Entry (Index) → on 4 digits → "/dashboard"
2) "/dashboard" → category filter → add to cart → checkout button
3) "*" → NotFound

Current Route Details:
• Landing Page: Hero with access code input (4-digit OTP)
• Dashboard: Product browsing with cart functionality
• Categories: Holiday Designs, Candy, Character, MISC
• Cart: Add items, quantity management, price calculation
• Checkout: Fixed bottom bar (payment flow not implemented)

Future Routes to Consider:
• /checkout → Payment processing
• /login → User authentication
• /profile → User account management
• /orders → Order history and tracking`}
                    </pre>
                </div>
            </Page>
        </main>
    );
}