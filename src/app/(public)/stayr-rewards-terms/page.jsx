import LegalPageLayout from "@/components/footer-pages/LegalPageLayout";

export const metadata = {
  title: "Stayr Rewards Terms & Conditions | Stayr",
  description: "Terms and conditions for the Stayr Rewards program.",
};

export default function RewardsTermsPage() {
  return (
    <LegalPageLayout title="Stayr Rewards Terms & Conditions" lastUpdated="August 10, 2026">
      <h2>1. Overview of the Program</h2>
      <p>
        The Stayr Rewards program ("Program") is offered by Stayr Travel, Inc. ("Stayr") to reward loyal customers who book eligible properties. By participating in the Program, you agree to these Terms & Conditions.
      </p>

      <h2>2. Eligibility and Enrollment</h2>
      <p>
        Membership is free and available to any individual who is at least 18 years old and resides in a jurisdiction that legally permits participation. Corporations and other entities are not eligible to participate.
      </p>

      <h2>3. Earning Points</h2>
      <p>
        Members earn points for eligible bookings completed through the Stayr platform. The number of points earned is based on the final booking value, excluding taxes and certain fees. Points are deposited into the member's account approximately 72 hours after check-out.
      </p>
      <ul>
        <li>Standard Members earn 10 points per $1 USD spent.</li>
        <li>Gold Members earn 12 points per $1 USD spent.</li>
        <li>Platinum Members earn 15 points per $1 USD spent.</li>
      </ul>

      <h2>4. Redeeming Points</h2>
      <p>
        Points can be redeemed for free nights, upgrades, or experiential rewards available on the Stayr platform. The redemption value of points is determined by Stayr and may vary by property, season, and demand.
      </p>

      <h2>5. Point Expiration</h2>
      <p>
        Points do not expire as long as the member remains active. An account is considered active if there is at least one qualifying earning or redemption activity within a 24-month period.
      </p>

      <h2>6. Program Modifications and Termination</h2>
      <p>
        Stayr reserves the right to modify or terminate the Program, including its rules, benefits, and point values, at any time with or without prior notice.
      </p>

      <div className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 italic">
        This is a placeholder legal document. It does not constitute actual legal advice or represent the official legal terms of Stayr.
      </div>
    </LegalPageLayout>
  );
}
