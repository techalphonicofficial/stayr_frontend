"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "../common/Container";

export default function StayrOriginals({ originals }) {
  if (!originals || originals.length === 0) return null;

  return (
    <div className="py-24 bg-foreground text-white rounded-[3rem] my-12 mx-4 md:mx-8">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
              Exclusive Collection
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
              Stayr Originals
            </h2>
            <p className="text-white/70 text-lg md:text-xl">
              Rare moments created exclusively for Stayr guests. You won&apos;t find these anywhere else.
            </p>
          </div>
          <button className="border border-white/30 hover:bg-white hover:text-foreground text-white px-6 py-3 rounded-full font-medium transition-colors shrink-0">
            View all Originals
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {originals.map((item, index) => (
            <Link href={`/experiences/${item.slug}`} key={item.id} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col gap-4"
              >
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white/5">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity: 1,y-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  
                  {/* Gold Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground shadow-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    {item.category}
                  </div>
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity: 1,y-60" />
                  
                  {/* Price info on image bottom */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="text-white/90 font-medium text-sm">
                      {item.duration}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xl leading-tight mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-white/60 text-sm flex justify-between items-center">
                    <span>{item.location}</span>
                    <span className="font-semibold text-white">From ₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
