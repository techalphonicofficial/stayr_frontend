
import HostLoginBackground from "@/components/host/HostLoginBackground";
import HostLoginCard from "@/components/host/HostLoginCard";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Become a Host | Stayr"
};

export default function BecomeAHostPage() {
  return (
    <div className="relative w-full flex flex-col bg-white overflow-x-hidden">

      {/* Hero Section (Grid + Modal) */}
      <div className="relative w-full min-h-screen flex flex-col">
        {/* Background layer */}
        <HostLoginBackground />

        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 h-20 px-6 flex items-center justify-between z-20 bg-white/90 backdrop-blur-md border-b border-border/50">
          <Link href="/" className="flex items-center">
            <Image
              src="/brand-logo.png"
              alt="Stayr"
              width={180}
              height={60}
              className="w-auto h-8 object-contain"
            />
          </Link>
          <span className="font-bold text-foreground hidden md:block">
            Ready to earn?
          </span>
        </div>

        {/* Centered Modal */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 pt-24 pb-20">
          <HostLoginCard />
        </div>
      </div>
    </div>
  );
}
