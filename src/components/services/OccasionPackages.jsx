"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Container from "../common/Container";
import { OCCASION_PACKAGES } from "@/data/services";

export default function OccasionPackages() {
  return (
    <div className="py-24">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Special Occasion Packages
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Make your milestones unforgettable with our curated celebration packages, fully arranged at your Stayr home.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {OCCASION_PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity: 1,y-80" />
                <h3 className="absolute bottom-6 left-6 text-2xl font-bold font-heading text-white">
                  {pkg.title}
                </h3>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="text-sm font-bold text-foreground mb-3">What&apos;s included:</div>
                <ul className="flex flex-col gap-2 mb-8 flex-1">
                  {pkg.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-border flex justify-between items-center mt-auto">
                  <div className="font-bold text-foreground">{pkg.price}</div>
                  <button className="text-sm font-bold text-primary hover:text-primary-hover transition">
                    View details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
