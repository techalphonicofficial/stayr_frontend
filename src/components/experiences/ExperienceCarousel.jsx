"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Container from "../common/Container";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceCarousel({ title, subtitle, experiences }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [experiences]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="py-12">
      <Container>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">{title}</h2>
            {subtitle && <p className="text-muted text-lg">{subtitle}</p>}
          </div>
          
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                canScrollLeft 
                  ? 'border-border text-foreground hover:border-foreground hover:shadow-md' 
                  : 'border-border/50 text-border cursor-not-allowed opacity: 1,y-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                canScrollRight 
                  ? 'border-border text-foreground hover:border-foreground hover:shadow-md' 
                  : 'border-border/50 text-border cursor-not-allowed opacity: 1,y-50'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {experiences.map((exp) => (
            <div key={exp.id} className="min-w-[85vw] md:min-w-[320px] lg:min-w-[280px] flex-shrink-0 snap-start">
              <ExperienceCard experience={exp} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
