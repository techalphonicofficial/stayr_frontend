"use client";

import Image from "next/image";
import { Star, ShieldCheck, Languages, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../common/Container";
import { HOSTS } from "@/data/hosts";

export default function LocalHosts() {
  return (
    <div className="py-24">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Meet the Locals
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Our experiences are crafted by passionate locals who love sharing their slice of the world with you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOSTS.map((host, index) => (
            <motion.div
              key={host.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-border hover:shadow-xl transition-shadow flex flex-col items-center text-center group"
            >
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-secondary group-hover:border-primary transition-colors">
                <Image
                  src={host.image}
                  alt={host.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-1 text-primary mb-1">
                <ShieldCheck className="w-5 h-5 fill-primary text-white" />
                <span className="text-sm font-bold">Verified</span>
              </div>

              <h3 className="text-2xl font-bold font-heading text-foreground mb-1">{host.name}</h3>
              <div className="text-muted text-sm font-medium mb-4">{host.profession}</div>

              <div className="flex items-center gap-4 text-sm text-foreground/80 mb-6 bg-secondary px-4 py-2 rounded-full">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="font-bold">{host.rating}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted" />
                  <span>{host.experience}</span>
                </div>
              </div>

              <p className="text-muted text-sm mb-6 leading-relaxed italic">
                &quot;{host.story}&quot;
              </p>

              <div className="mt-auto w-full pt-4 border-t border-border flex items-center justify-center gap-2 text-sm text-foreground">
                <Languages className="w-4 h-4 text-muted" />
                <span>{host.languages.join(", ")}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
}
