import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavigationBar } from "@/components/NavigationBar";
import { Link } from "wouter";

export function StoryPage(): JSX.Element {
  return (
    <div className="min-h-screen view-shell">
      <header className="view-header">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="w-8 h-8 bg-black cursor-pointer" style={{ borderRadius: "1px" }}></div>
          </Link>
          <NavigationBar currentPage="story" />
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
          <h1 className="prada-heading text-5xl font-light text-black mb-4">Our Story</h1>
          <p className="text-gray-600 font-light text-lg">
            Lakbay was built to connect travelers with local hosts, regional culture, and responsible adventures across the Philippines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-2">Local First</h2>
            <p className="text-sm text-gray-600">We prioritize local communities, guides, and businesses in every experience.</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-2">Safe Travel</h2>
            <p className="text-sm text-gray-600">Clear booking workflows, host vetting, and transparent policies for travelers.</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-2">Real Discovery</h2>
            <p className="text-sm text-gray-600">Experiences beyond tourist checklists, designed with local expertise.</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
