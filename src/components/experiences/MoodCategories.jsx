"use client";

import { motion } from "framer-motion";
import { Utensils, Brush, Compass, Sparkles, Map, GlassWater } from "lucide-react";
import Container from "../common/Container";

import Link from "next/link";
import { MOODS } from "@/data/moods";

export default function MoodCategories() {
  return (
    <div className="py-16 bg-secondary/30">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Explore by Mood
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Find the perfect experience to match how you want to feel today.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {MOODS.map((mood, index) => {
            const Icon = mood.icon;
            return (
              <Link href={`/experiences/mood/${mood.id}`} key={mood.id} className="block">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer flex flex-col gap-3"
                >
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${mood.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-primary/20 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <Icon className="w-5 h-5 text-foreground group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                  <div className="text-center font-semibold text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                    {mood.label}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
