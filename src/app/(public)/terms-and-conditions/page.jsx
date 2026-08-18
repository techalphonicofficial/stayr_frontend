import LegalPageLayout from "@/components/footer-pages/LegalPageLayout";

export const metadata = {
  title: "Terms and Conditions | Stayr",
  description: "Terms of service for using the Stayr platform.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms and Conditions" lastUpdated="August 10, 2026">
      <h2>1. Introduction</h2>
      <p>
        Welcome to Stayr. These Terms and Conditions ("Terms") govern your access to and use of the Stayr website, mobile applications, and services (collectively, the "Platform"). Please read these Terms carefully before using the Platform.
      </p>

      <h2>2. Use of the Platform</h2>
      <p>
        By using our Platform, you agree to comply with all applicable laws and regulations. You must be at least 18 years old to create an account and use the services provided by Stayr.
      </p>

      <h2>3. Booking and Accommodations</h2>
      <p>
        When you book an accommodation, you are entering into a direct contract with the Host. Stayr acts as a facilitator for the transaction and is not a party to the rental agreement. You agree to follow the Host's rules and any local laws applicable to your stay.
      </p>

      <h2>4. Fees and Payments</h2>
      <p>
        Stayr may charge fees for the use of the Platform (such as service fees). All applicable fees will be displayed to you before you book. You agree to pay all charges associated with your booking, including taxes and fees.
      </p>

      <h2>5. Cancellations and Refunds</h2>
      <p>
        Cancellation policies vary by property and are set by the Host. You should review the cancellation policy carefully before booking. Refunds, if applicable, will be processed according to the specific cancellation policy of your reservation.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Stayr shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, arising from your use of the Platform or any interactions with other users.
      </p>

      <h2>7. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Stayr is headquartered, without regard to its conflict of law principles.
      </p>

      <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 italic">
        This is a placeholder legal document. It does not constitute actual legal advice or represent the official legal terms of Stayr.
      </div>
    </LegalPageLayout>
  );
}
