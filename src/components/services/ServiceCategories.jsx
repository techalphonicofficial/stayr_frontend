"use client";

import { motion } from "framer-motion";
import { Utensils, Sparkles, Camera, Dumbbell, Scissors, Brush, Car, CalendarHeart } from "lucide-react";
import Container from "../common/Container";

const CATEGORIES = [
  { id: 'sc1', title: 'Private Chefs', icon: Utensils, image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600" },
  { id: 'sc2', title: 'Massage & Wellness', icon: Sparkles, image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=600" },
  { id: 'sc3', title: 'Photography', icon: Camera, image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600" },
  { id: 'sc4', title: 'Personal Training', icon: Dumbbell, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600" },
  { id: 'sc5', title: 'Beauty & Styling', icon: Scissors, image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600" },
  { id: 'sc6', title: 'Housekeeping', icon: Brush, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600" },
  { id: 'sc7', title: 'Local Drivers', icon: Car, image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600" },
  { id: 'sc8', title: 'Event Planning', icon: CalendarHeart, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600" }
];

export default function ServiceCategories() {
  return (
    <div className="py-16">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Services for your stay
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Everything you need to elevate your experience, brought right to your door.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-pointer flex flex-col gap-3"
              >
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-primary/20 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-md">
                      <Icon className="w-5 h-5 text-foreground group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm md:text-base">
                  {cat.title}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
