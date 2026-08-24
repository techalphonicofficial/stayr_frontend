import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

export default async function Footer() {
  let footerSettings = null;
  let footerColumns = [];

  try {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    if (apiUrl.includes('localhost')) {
      apiUrl = apiUrl.replace('localhost', '127.0.0.1');
    }
    const res = await fetch(`${apiUrl}/api/public/footer`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data?.success) {
        footerSettings = data.data.settings;
        footerColumns = data.data.columns;
      }
    }
  } catch (e) {
    console.error("Failed to fetch public footer settings:", e.message);
  }

  const companyLogo = footerSettings?.companyLogo || "/brand-logo.png";
  const copyrightText = footerSettings?.copyright || "© 2026 Stayr, a luxury travel group company. All rights reserved. Stayr and the Stayr logo are trademarks or registered trademarks of Stayr Travel, Inc.";

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
    <footer className="w-full bg-secondary pt-12 pb-6 border-t border-border">
      <Container>
        {/* Header / Logo */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Image
            src={companyLogo}
            alt="Stayr"
            width={180}
            height={120}
            className="w-auto h-24 object-contain mb-2"
          />

          {/* Slogan */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-6">
            <div className="w-8 md:w-12 h-[1px] bg-accent"></div>
            <span className="text-accent text-[10px] md:text-[12px] font-bold tracking-[0.25em] uppercase">
              A STAY THAT STAYS WITH YOU
            </span>
            <div className="w-8 md:w-12 h-[1px] bg-accent"></div>
          </div>

          <p className="text-[15px] font-bold text-foreground">
            Real people, real support—available 24/7 before, during, and after your stay.
          </p>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:flex md:flex-row md:justify-center gap-x-2 gap-y-10 mb-12 w-full max-w-5xl mx-auto">
          {footerColumns && footerColumns.length > 0 ? (
            footerColumns.map((col, index, arr) => (
              <div 
                key={col.id} 
                className={`flex flex-col items-center text-center md:flex-1 md:min-w-[200px] ${
                  index === arr.length - 1 && arr.length % 2 !== 0 ? 'col-span-2 mx-auto' : 'col-span-1'
                }`}
              >
                <h3 className="font-bold text-foreground mb-4">{col.title}</h3>
                <ul className="flex flex-col items-center gap-3">
                  {col.links && col.links.map((link) => (
                    <li key={link.id}>
                      <Link href={link.url} target={link.target || "_self"} className="text-[13px] text-foreground hover:text-primary transition-colors">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              {/* Fallback Columns */}
              <div className="flex flex-col items-center text-center col-span-1 md:flex-1 md:min-w-[200px]">
                <h3 className="font-bold text-foreground mb-4 text-[15px] md:text-base">Explore Stayr</h3>
                <ul className="flex flex-col items-center gap-3">
                  {exploreLinks.map((link, i) => (
                    <li key={i}>
                      <Link href={link.href} className="text-[12px] md:text-[13px] text-foreground hover:text-primary transition-colors text-center block">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center text-center col-span-1 md:flex-1 md:min-w-[200px]">
                <h3 className="font-bold text-foreground mb-4 text-[15px] md:text-base">Company</h3>
                <ul className="flex flex-col items-center gap-3">
                  {companyLinks.map((link, i) => (
                    <li key={i}>
                      <Link href={link.href} className="text-[12px] md:text-[13px] text-foreground hover:text-primary transition-colors text-center block">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center text-center col-span-2 mx-auto md:flex-1 md:min-w-[200px]">
                <h3 className="font-bold text-foreground mb-4 text-[15px] md:text-base">Meet the Stayr family</h3>
                <ul className="flex flex-col items-center gap-3">
                  {familyLinks.map((link, i) => (
                    <li key={i}>
                      <Link href={link.href} className="text-[12px] md:text-[13px] text-foreground hover:text-primary transition-colors text-center block">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-border/80 flex flex-col justify-center items-center gap-4 w-full px-4">
          <p className="text-[12px] text-muted text-center w-full max-w-4xl leading-relaxed">
            {copyrightText}
          </p>

          <div className="flex flex-row items-center gap-4">
            {footerSettings?.itsLogo && (
              <img src={footerSettings.itsLogo} alt="ITS Logo" className="h-6 w-auto object-contain" />
            )}
            {footerSettings?.currencyLogo && (
              <img src={footerSettings.currencyLogo} alt="Currency Logo" className="h-6 w-auto object-contain" />
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
