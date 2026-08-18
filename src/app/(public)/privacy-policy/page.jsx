import LegalPageLayout from "@/components/footer-pages/LegalPageLayout";

export const metadata = {
  title: "Privacy Policy | Stayr",
  description: "Learn how Stayr collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="August 10, 2026">
      <h2>1. Introduction</h2>
      <p>
        At Stayr, your privacy is our priority. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you use our Platform.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as when you create an account, update your profile, make a booking, or communicate with us. This may include your name, email address, phone number, payment information, and government-issued ID (if required for verification).
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>
        We use your information to provide, maintain, and improve our services. This includes processing transactions, providing customer support, sending booking confirmations, personalizing your experience, and detecting fraud or security incidents.
      </p>

      <h2>4. Sharing of Information</h2>
      <p>
        We may share your information with Hosts when you book a property, with third-party service providers who assist us in operating our Platform, or as required by law. We do not sell your personal information to third parties for marketing purposes.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement robust technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration. However, no internet transmission is entirely secure, and we cannot guarantee absolute security.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Depending on your location, you may have the right to access, correct, delete, or restrict the processing of your personal data. You can manage your information through your account settings or by contacting our Privacy Team.
      </p>

      <h2>7. Cookies and Tracking</h2>
      <p>
        We use cookies and similar technologies to track activity on our Platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
      </p>

      <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 italic">
        This is a placeholder legal document. It does not constitute actual legal advice or represent the official legal terms of Stayr.
      </div>
    </LegalPageLayout>
  );
}
