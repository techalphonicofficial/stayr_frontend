"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "../common/Container";

export default function FooterPageHero({
  title,
  subtitle,
  description,
  imageSrc,
  variant = "centered", // 'centered', 'split', 'editorial', 'legal'
}) {
  if (variant === "legal") {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-white border-b border-gray-100">
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center flex flex-col items-center"
          >
            {subtitle && <span className="text-[var(--color-primary)] font-bold text-sm tracking-wider uppercase mb-3 block">{subtitle}</span>}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-6 leading-tight">{title}</h1>
            {description && <p className="text-lg text-[var(--color-muted)] leading-relaxed">{description}</p>}
          </motion.div>
        </Container>
      </section>
    );
  }

  if (variant === "split") {
    return (
      <section className="pt-20 md:pt-28 pb-16 md:pb-24 bg-[var(--color-background)] overflow-hidden">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full md:w-1/2"
            >
              {subtitle && <span className="text-[var(--color-primary)] font-bold text-sm tracking-wider uppercase mb-4 block">{subtitle}</span>}
              <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-foreground)] mb-6 leading-tight">{title}</h1>
              {description && <p className="text-lg text-[var(--color-muted)] mb-8 leading-relaxed">{description}</p>}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="w-full md:w-1/2 relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image 
                src={imageSrc || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200"}
                alt={title}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </Container>
      </section>
    );
  }

  // Default: centered
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[var(--color-background)]">
      {/* Optional decorative background circle */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <Container>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto z-10 relative">
          {subtitle && (
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[var(--color-primary)] font-bold text-sm tracking-[0.2em] uppercase mb-4 block"
            >
              {subtitle}
            </motion.span>
          )}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--color-foreground)] mb-6 leading-tight"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>
      </Container>
    </section>
  );
}
