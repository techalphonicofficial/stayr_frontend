"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plane, ShoppingBag, PartyPopper, Flower, Baby, Coffee, Luggage, Wifi, Check } from "lucide-react";
import Container from "../common/Container";

const ARRIVAL_SERVICES = [
  { id: "arr1", title: "Airport Pickup", icon: Plane, desc: "A premium vehicle waiting at arrivals" },
  { id: "arr2", title: "Grocery Stocking", icon: ShoppingBag, desc: "Your favorite essentials ready in the fridge" },
  { id: "arr3", title: "Room Decoration", icon: PartyPopper, desc: "For birthdays, anniversaries or surprises" },
  { id: "arr4", title: "Flowers & Gifts", icon: Flower, desc: "Fresh local blooms to welcome you" },
  { id: "arr5", title: "Baby Equipment", icon: Baby, desc: "Cribs, high chairs and safety gates" },
  { id: "arr6", title: "Breakfast Setup", icon: Coffee, desc: "Morning spread ready for your first day" },
  { id: "arr7", title: "Early Luggage Drop", icon: Luggage, desc: "Leave bags safely before check-in time" },
  { id: "arr8", title: "Connectivity Setup", icon: Wifi, desc: "Local SIMs and upgraded Wi-Fi ready" },
];

export default function ArrivalServices() {
  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="py-24 bg-secondary/30">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/3">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-6 leading-tight">
              Arrive and feel at home
            </h2>
            <p className="text-muted text-lg mb-8">
              Select the services you need before you arrive, and our team will have everything perfectly arranged for your Stayr home.
            </p>
            {selectedServices.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
                className="bg-primary/10 border border-primary/30 p-6 rounded-2xl"
              >
                <div className="font-bold text-foreground mb-2 flex justify-between">
                  <span>{selectedServices.length} service(s) selected</span>
                </div>
                <button className="w-full bg-foreground text-white font-medium py-3 rounded-xl mt-4 hover:bg-foreground/90 transition">
                  Request arrangement
                </button>
              </motion.div>
            )}
          </div>

          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARRIVAL_SERVICES.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedServices.includes(service.id);
              
              return (
                <div 
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`cursor-pointer border-2 rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-primary/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-primary text-white' : 'bg-secondary text-primary'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-foreground mb-1">{service.title}</h3>
                    <p className="text-sm text-muted">{service.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-2 transition-colors ${
                    isSelected ? 'bg-primary border-primary' : 'border-border'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </Container>
    </div>
  );
}
