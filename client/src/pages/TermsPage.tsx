import { Link } from "wouter";

export function TermsPage(): JSX.Element {
  return (
    <div className="min-h-screen view-shell">
      <main className="max-w-3xl mx-auto px-8 py-16">
        <div className="prada-card p-8 md:p-10">
        <h1 className="prada-heading text-4xl font-light mb-6">Terms of Service</h1>
        <div className="space-y-4 text-sm text-gray-700">
          <p>By using Lakbay, you agree to use the platform responsibly and provide accurate information during booking and account registration.</p>
          <p>Hosts are responsible for experience safety, schedule accuracy, and participant communication. Travelers are responsible for complying with trip requirements and local laws.</p>
          <p>Payments, refunds, and cancellations are subject to the policy attached to each trip listing.</p>
        </div>
        <div className="mt-8">
          <Link href="/login" className="text-[#D4AF37] hover:text-[#B8941F] text-sm">Back to login</Link>
        </div>
        </div>
      </main>
    </div>
  );
}
