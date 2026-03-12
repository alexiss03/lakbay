import { Link } from "wouter";

export function PrivacyPage(): JSX.Element {
  return (
    <div className="min-h-screen view-shell">
      <main className="max-w-3xl mx-auto px-8 py-16">
        <div className="prada-card p-8 md:p-10">
        <h1 className="prada-heading text-4xl font-light mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-sm text-gray-700">
          <p>Lakbay collects account, booking, and communication data to operate trip discovery, reservations, and customer support.</p>
          <p>We use your data to improve platform reliability, prevent fraud, and provide personalized recommendations.</p>
          <p>You can request account data updates or deletion through support channels, subject to legal and transaction-retention requirements.</p>
        </div>
        <div className="mt-8">
          <Link href="/login" className="text-[#D4AF37] hover:text-[#B8941F] text-sm">Back to login</Link>
        </div>
        </div>
      </main>
    </div>
  );
}
