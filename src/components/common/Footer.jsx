import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  const exploreLinks = [
    { label: "List your property", href: "/list-your-property" },
    { label: "StayrCare", href: "/stayrcare" },
    { label: "Trust and safety", href: "/trust-and-safety" },
    { label: "Vacation rental guides", href: "/vacation-rental-guides" },
    { label: "Stayr Rewards credit cards", href: "/stayr-rewards-credit-cards" },
    { label: "Stayr Travel Insurance", href: "/stayr-travel-insurance" },
  ];

  const companyLinks = [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Newsroom", href: "/newsroom" },
    { label: "Stayr Rewards terms and conditions", href: "/stayr-rewards-terms" },
    { label: "Terms and conditions", href: "/terms-and-conditions" },
    { label: "Privacy policy", href: "/privacy-policy" },
  ];

  const familyLinks = [
    { label: "Stayr India", href: "/stayr-india" },
    { label: "Stayr Asia", href: "/stayr-asia" },
    { label: "Stayr Europe", href: "/stayr-europe" },
    { label: "Stayr US", href: "/stayr-us" },
  ];

  return (
    <footer className="w-full bg-[#F6F4F0] pt-12 pb-6 border-t border-[#EFE7D8]">
      <Container>
        {/* Header / Logo */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Image
            src="/brand-logo.png"
            alt="Stayr"
            width={180}
            height={120}
            className="w-auto h-24 object-contain mb-2"
          />
          
          {/* Slogan */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-6">
            <div className="w-8 md:w-12 h-[1px] bg-[#C8A165]"></div>
            <span className="text-[#C8A165] text-[10px] md:text-[12px] font-bold tracking-[0.25em] uppercase">
              A STAY THAT STAYS WITH YOU
            </span>
            <div className="w-8 md:w-12 h-[1px] bg-[#C8A165]"></div>
          </div>

          <p className="text-[15px] font-bold text-[#2B2B2B]">
            Real people, real support—available 24/7 before, during, and after your stay.
          </p>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 mb-12">
          {/* Column 1 */}
          <div className="flex flex-col items-center text-center">
            <h3 className="font-bold text-[#2B2B2B] mb-4">Explore Stayr</h3>
            <ul className="flex flex-col items-center gap-3">
              {exploreLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-[13px] text-[#2B2B2B] hover:text-[#E8B65B] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center text-center">
            <h3 className="font-bold text-[#2B2B2B] mb-4">Company</h3>
            <ul className="flex flex-col items-center gap-3">
              {companyLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-[13px] text-[#2B2B2B] hover:text-[#E8B65B] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center text-center col-span-2 md:col-span-1">
            <h3 className="font-bold text-[#2B2B2B] mb-4">Meet the Stayr family</h3>
            <ul className="flex flex-col items-center gap-3">
              {familyLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-[13px] text-[#2B2B2B] hover:text-[#E8B65B] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[#EFE7D8]/80 text-center">
          <p className="text-[11px] text-[#7B7468]">
            © 2026 Stayr, a luxury travel group company. All rights reserved. Stayr and the Stayr logo are trademarks or registered trademarks of Stayr Travel, Inc.
          </p>
        </div>
      </Container>
    </footer>
  );
}
