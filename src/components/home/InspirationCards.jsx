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
    <section className="w-full py-8 md:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card) => (
              <div key={card.id} className="flex flex-col bg-white border border-[#EFE7D8] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image Half */}
                <div className="relative w-full aspect-[16/10]">
                  <Image
                    src={card.image}
                    alt={card.tag}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content Half */}
                <div className="flex flex-col flex-grow p-5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B7468] mb-1.5">
                    {card.tag}
                  </span>
                  <h3 className="text-[15px] font-semibold text-[#2B2B2B] leading-snug mb-5 flex-grow">
                    {card.title}
                  </h3>
                  <Link
                    href={card.link}
                    className="self-start px-5 py-2 rounded-full border-2 border-[#EFE7D8] text-[#2B2B2B] font-bold text-sm hover:border-[#2B2B2B] transition-colors"
                  >
                    {card.btnText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
