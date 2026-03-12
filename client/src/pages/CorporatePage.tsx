import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavigationBar } from "@/components/NavigationBar";
import { Link } from "wouter";

export function CorporatePage(): JSX.Element {
  return (
    <div className="min-h-screen view-shell">
      <header className="view-header">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="w-8 h-8 bg-black cursor-pointer" style={{ borderRadius: "1px" }}></div>
          </Link>
          <NavigationBar currentPage="corporate" />
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="outline" className="prada-button h-9 px-6 text-xs font-light border-black text-black hover:bg-black hover:text-white">
                LOG IN
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="prada-button prada-gold-accent h-9 px-6 text-xs font-light">REGISTER</Button>
            </Link>
            <span className="text-xs text-gray-500 font-light ml-4">EN</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-16 space-y-8">
        <div>
          <h1 className="prada-heading text-5xl font-light text-black mb-4">Corporate</h1>
          <p className="text-gray-600 font-light text-lg">
            Partner with Lakbay for team travel, corporate retreats, and branded destination programs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-2">Team Retreats</h2>
            <p className="text-sm text-gray-600 mb-4">Custom trip plans for remote teams, leadership groups, and offsite programs.</p>
            <p className="text-sm text-gray-900">Email: corporate@lakbay.ph</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-2">Partnerships</h2>
            <p className="text-sm text-gray-600 mb-4">Work with us as a destination partner, brand sponsor, or travel services provider.</p>
            <p className="text-sm text-gray-900">Email: partnerships@lakbay.ph</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
