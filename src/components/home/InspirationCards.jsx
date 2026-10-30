"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Container from "../common/Container";

export default function InspirationCards() {
  const cards = [
    {
      id: "hill-stations",
      tag: "Last-minute weekend",
      title: "Book a last-minute vacation rental for a hill station getaway.",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1000",
      link: "/s/himachal/homes",
      btnText: "Book now"
    },
    {
      id: "beaches",
      tag: "Save on beach stays",
      title: "Last-minute private pool villas for group getaways in Goa.",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1000",
      link: "/s/goa/homes",
      btnText: "Book now"
    },
    {
      id: "heritage",
      tag: "Royal Escapes",
      title: "Hot travel destinations to inspire your next royal Rajasthan trip.",
      image: "/rajasthan_palace.png",
      link: "/s/rajasthan/homes",
      btnText: "Find out more"
    }
  ];

  return (
    <section className="w-full py-4 md:py-8">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card) => (
              <motion.div 
                key={card.id} 
                className="flex flex-col bg-white border border-border rounded-2xl overflow-hidden shadow-sm group cursor-pointer transition-colors"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Outer wrapper for card hover effects */}
                <div className="flex flex-col h-full rounded-2xl transition-all duration-300 group-hover:shadow-[0_10px_40px_rgba(232,182,91,0.25)] group-hover:border group-hover:border-primary/30">
                  
                  {/* Image Half */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.tag}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Subtle shine effect on hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full z-10 pointer-events-none"
                      whileHover={{ translateX: ["-100%", "200%"] }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>

                  {/* Content Half */}
                  <div className="flex flex-col flex-grow p-5 z-20 bg-white">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                      {card.tag}
                    </span>
                    <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-5 flex-grow group-hover:text-primary transition-colors duration-300">
                      {card.title}
                    </h3>
                    <Link
                      href={card.link}
                      className="self-start px-5 py-2 rounded-full border-2 border-border text-foreground font-bold text-sm transition-all duration-300 group-hover:border-primary group-hover:bg-primary shadow-sm"
                    >
                      {card.btnText}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
