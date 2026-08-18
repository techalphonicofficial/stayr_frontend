import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FooterPageCard({ title, description, icon: Icon, href }) {
  const CardContent = () => (
    <div className="bg-white p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-all duration-300 group h-full flex flex-col cursor-pointer hover:border-[var(--color-primary)]">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] text-[var(--color-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">{title}</h3>
      <p className="text-[var(--color-muted)] leading-relaxed flex-1">{description}</p>
      
      {href && (
        <div className="mt-6 flex items-center text-[var(--color-primary)] font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
          Learn more <ArrowRight size={16} className="ml-2" />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}
