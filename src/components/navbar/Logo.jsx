"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Logo() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push('/')}
      className="hidden md:flex items-center cursor-pointer transition hover:opacity: 1,y-80"
    >
      <Image
        src="/brand-logo.png"
        alt="Stayr Logo"
        width={150}
        height={100}
        priority
        className="w-auto h-[50px] object-contain pb-1"
      />
    </div>
  );
}
