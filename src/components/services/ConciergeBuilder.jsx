"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Heart, Users, Sparkles, Briefcase, Map, Target, CheckCircle2 } from "lucide-react";
import Container from "../common/Container";

const TRIP_TYPES = [
  { id: "romantic", label: "Romantic Escape", icon: Heart },
  { id: "family", label: "Family Vacation", icon: Users },
  { id: "celebration", label: "Celebration", icon: Sparkles },
  { id: "business", label: "Business Trip", icon: Briefcase },
  { id: "wellness", label: "Wellness Retreat", icon: Target },
  { id: "adventure", label: "Adventure Seekers", icon: Map },
];

const COMPANIONS = [
  "Just me", "Partner", "Family with kids", "Friends group", "Colleagues"
];

const BUDGETS = [
  "Value (Under ₹10,000)", 
  "Standard (₹10,000 - ₹25,000)", 
  "Premium (₹25,000 - ₹50,000)", 
  "Luxury (₹50,000+)"
];

const SPECIAL_REQUESTS = [
  "Private dining", "Spa treatments", "Local tours", "Photography", "Surprise setups", "Childcare", "Fitness coach", "Chauffeur"
];

export default function ConciergeBuilder() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  
  // State for selections
  const [tripType, setTripType] = useState("");
  const [companion, setCompanion] = useState("");
  const [budget, setBudget] = useState("");
  const [specials, setSpecials] = useState([]);
  
  const [isGenerating, setIsGenerating] = useState(false);

  const totalSteps = 5; // Step 5 is the result

  const nextStep = () => {
    if (step < totalSteps) {
      if (step === 4) {
        setIsGenerating(true);
        setTimeout(() => {
          setIsGenerating(false);
          setDirection(1);
          setStep(step + 1);
        }, 2000); // Fake generation time
      } else {
        setDirection(1);
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const toggleSpecial = (req) => {
    setSpecials(prev => 
      prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]
    );
  };

  const canProceed = () => {
    if (step === 1) return tripType !== "";
    if (step === 2) return companion !== "";
    if (step === 3) return budget !== "";
    if (step === 4) return true; // Specials are optional
    return false;
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 1 }),
    center: {
      x: 0,
      opacity: 1 },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 1 })
  };

  return (
    <div className="py-24">
      <Container>
        <div className="text-center mb-12">
          <div className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
            Personalised Service
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Build My Perfect Stay
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Tell us about your trip, and our digital concierge will craft a customized package just for you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-border overflow-hidden">
          
          {/* Progress Bar */}
          <div className="w-full bg-secondary h-2 relative">
            <motion.div 
              className="absolute top-0 left-0 bottom-0 bg-primary"
              initial={{ width: "20%" }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          <div className="p-8 md:p-12 relative min-h-[400px] flex flex-col">
            
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                <div className="relative w-20 h-20 mb-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-secondary border-t-primary"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-heading text-foreground mb-2">Curating your experience...</h3>
                <p className="text-muted">Matching the best services for a {tripType} trip.</p>
              </div>
            ) : (
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-1 flex flex-col"
                >
                  
                  {/* STEP 1 */}
                  {step === 1 && (
                    <>
                      <h3 className="text-2xl font-bold text-foreground mb-8">What type of trip is this?</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {TRIP_TYPES.map(type => {
                          const Icon = type.icon;
                          const isSelected = tripType === type.label;
                          return (
                            <div 
                              key={type.id}
                              onClick={() => setTripType(type.label)}
                              className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center gap-3 transition ${
                                isSelected ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted hover:border-primary/40'
                              }`}
                            >
                              <Icon className={`w-8 h-8 ${isSelected ? 'text-primary' : ''}`} />
                              <span className="font-semibold">{type.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <>
                      <h3 className="text-2xl font-bold text-foreground mb-8">Who are you travelling with?</h3>
                      <div className="flex flex-col gap-3">
                        {COMPANIONS.map(comp => (
                          <div 
                            key={comp}
                            onClick={() => setCompanion(comp)}
                            className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-between transition ${
                              companion === comp ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted hover:border-primary/40'
                            }`}
                          >
                            <span className="font-semibold text-lg">{comp}</span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              companion === comp ? 'border-primary bg-primary' : 'border-border'
                            }`}>
                              {companion === comp && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <>
                      <h3 className="text-2xl font-bold text-foreground mb-8">What is your approximate budget?</h3>
                      <div className="flex flex-col gap-3">
                        {BUDGETS.map(b => (
                          <div 
                            key={b}
                            onClick={() => setBudget(b)}
                            className={`cursor-pointer border-2 rounded-xl p-4 flex items-center justify-between transition ${
                              budget === b ? 'border-primary bg-primary/5 text-foreground' : 'border-border text-muted hover:border-primary/40'
                            }`}
                          >
                            <span className="font-semibold text-lg">{b}</span>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              budget === b ? 'border-primary bg-primary' : 'border-border'
                            }`}>
                              {budget === b && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <>
                      <h3 className="text-2xl font-bold text-foreground mb-2">What would make the stay special?</h3>
                      <p className="text-muted mb-8">Select as many as you like (optional)</p>
                      <div className="flex flex-wrap gap-3">
                        {SPECIAL_REQUESTS.map(req => {
                          const isSelected = specials.includes(req);
                          return (
                            <button
                              key={req}
                              onClick={() => toggleSpecial(req)}
                              className={`px-5 py-3 border-2 rounded-full font-semibold transition ${
                                isSelected ? 'border-primary bg-primary text-white' : 'border-border text-muted hover:border-primary/50'
                              }`}
                            >
                              {req}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* STEP 5 - RESULT */}
                  {step === 5 && (
                    <div className="flex flex-col items-center text-center py-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-3xl font-heading font-bold text-foreground mb-2">
                        Your {tripType} Package
                      </h3>
                      <p className="text-muted mb-8 max-w-md">
                        Based on your selections, we&apos;ve curated the perfect set of services to make your stay unforgettable.
                      </p>

                      <div className="w-full bg-secondary/30 rounded-2xl p-6 text-left border border-border mb-8">
                        <h4 className="font-bold text-foreground mb-4">Included in your package:</h4>
                        <ul className="flex flex-col gap-3 mb-6">
                          <li className="flex items-center gap-3 text-foreground">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            Premium Airport Transfer
                          </li>
                          <li className="flex items-center gap-3 text-foreground">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            Welcome Setup (Flowers & Refreshments)
                          </li>
                          <li className="flex items-center gap-3 text-foreground">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            Private Chef (One Evening)
                          </li>
                          {specials.map(s => (
                            <li key={s} className="flex items-center gap-3 text-foreground">
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                              {s} arrangement
                            </li>
                          ))}
                        </ul>
                        <div className="border-t border-border pt-4 flex justify-between items-center">
                          <span className="font-bold text-foreground">Estimated Total:</span>
                          <span className="text-xl font-bold text-primary">₹22,500</span>
                        </div>
                      </div>

                      <div className="flex gap-4 w-full">
                        <button 
                          onClick={() => { setStep(1); setTripType(""); setCompanion(""); setBudget(""); setSpecials([]); }}
                          className="flex-1 py-4 border border-border text-foreground font-bold rounded-xl hover:bg-secondary transition"
                        >
                          Start Over
                        </button>
                        <button className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition">
                          Book Package
                        </button>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation Buttons (Hide on Step 5) */}
            {!isGenerating && step < 5 && (
              <div className="mt-auto pt-8 flex items-center justify-between">
                <button 
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`flex items-center gap-1 font-semibold transition ${
                    step === 1 ? 'text-transparent cursor-default' : 'text-muted hover:text-foreground'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                
                <button 
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition ${
                    canProceed() ? 'bg-foreground text-white hover:bg-foreground/90' : 'bg-secondary text-muted cursor-not-allowed'
                  }`}
                >
                  {step === 4 ? "Curate Package" : "Continue"}
                  {step < 4 && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            )}
            
          </div>
        </div>
      </Container>
    </div>
  );
}
