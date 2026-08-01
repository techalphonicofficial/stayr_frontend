"use client";

import { ShieldCheck, Award, Star, Lock, RefreshCcw, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../common/Container";

const TRUST_FEATURES = [
  { icon: ShieldCheck, title: "Identity Verification", desc: "Every professional undergoes rigorous background and identity checks." },
  { icon: Award, title: "Professional Experience", desc: "We only partner with seasoned experts in their respective fields." },
  { icon: Star, title: "Customer Reviews", desc: "Transparent ratings from verified Stayr guests ensure consistent quality." },
  { icon: Lock, title: "Secure Booking", desc: "Your payments are protected and held securely until the service is delivered." },
  { icon: RefreshCcw, title: "Clear Cancellation", desc: "Flexible and transparent policies for peace of mind." },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Our concierge team is always available to assist with your bookings." }
];

export default function TrustedProfessionals() {
  return (
    <div className="py-24 bg-secondary/20">
      <Container>
        <div className="text-center mb-16">
          <div className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
            The Stayr Standard
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Trusted Professionals
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Your safety, comfort and satisfaction are our top priorities. We hold our service partners to the highest standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-border flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center mb-2">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-foreground">{feature.title}</h3>
                <p className="text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
