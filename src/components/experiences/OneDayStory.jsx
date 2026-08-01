"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import Container from "../common/Container";

const TIMELINE = [
  { time: "8:00 AM", title: "Heritage breakfast", desc: "Start the day with traditional kachoris and chai overlooking the city." },
  { time: "10:00 AM", title: "Block-printing workshop", desc: "Learn ancient textile arts from a master artisan in their home studio." },
  { time: "1:00 PM", title: "Traditional Rajasthani lunch", desc: "An authentic thali experience in a restored 200-year-old courtyard." },
  { time: "4:00 PM", title: "Hidden palace tour", desc: "Exclusive access to private quarters and untold royal histories." },
  { time: "7:00 PM", title: "Rooftop sunset dinner", desc: "End the day with a majestic view of the illuminated fort." },
];

export default function OneDayStory() {
  const containerRef = useRef(null);
  
  return (
    <div className="py-24 bg-secondary/20 relative overflow-hidden" ref={containerRef}>
      <Container>
        <div className="text-center mb-16">
          <div className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
            One Day, One Story
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            A Royal Day in Jaipur
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Experience the Pink City like royalty with a perfectly curated dawn-to-dusk itinerary.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Timeline */}
          <div className="order-2 md:order-1 relative">
            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border rounded-full" />
            
            <div className="flex flex-col gap-10 relative z-10">
              {TIMELINE.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex gap-6 relative"
                >
                  <div className="w-14 h-14 rounded-full bg-white border-4 border-secondary flex items-center justify-center shrink-0 shadow-sm z-10 text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="pt-2">
                    <div className="text-sm font-bold text-primary mb-1">{item.time}</div>
                    <h4 className="text-xl font-bold text-foreground mb-2">{item.title}</h4>
                    <p className="text-muted leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 ml-20 bg-white p-6 rounded-2xl shadow-lg border border-border"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-muted">Complete Package</div>
                  <div className="text-xl font-bold text-foreground">₹12,500 <span className="text-sm font-normal text-muted">/ couple</span></div>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary-hover text-foreground font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                Book the complete day
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 h-[600px] md:h-[800px] relative rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1200"
              alt="Jaipur Royal Day"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

        </div>
      </Container>
    </div>
  );
}
