"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const POSTERS = [
  { id: 1, url: "https://images.unsplash.com/photo-1502602881460-5c96ddeb12b8?auto=format&fit=crop&q=80&w=400", title: "PARIS" },
  { id: 2, url: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&q=80&w=400", title: "MIAMI" },
  { id: 3, url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=400", title: "SYDNEY" },
  { id: 4, url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=400", title: "LONDON" },
  { id: 5, url: "https://images.unsplash.com/photo-1522083111860-2a819b5c3d4a?auto=format&fit=crop&q=80&w=400", title: "TOKYO" },
  { id: 6, url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=400", title: "DUBAI" },
  { id: 7, url: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&q=80&w=400", title: "LONDON" },
  { id: 8, url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=400", title: "PARIS" },
  { id: 9, url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=400", title: "LISBON" },
  { id: 10, url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=400", title: "SYDNEY" },
  { id: 11, url: "https://images.unsplash.com/photo-1542051812871-75f56cc9a3af?auto=format&fit=crop&q=80&w=400", title: "KYOTO" },
  { id: 12, url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80&w=400", title: "ROME" },
  { id: 13, url: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&q=80&w=400", title: "VENICE" },
  { id: 14, url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=400", title: "PARIS" },
  { id: 15, url: "https://images.unsplash.com/photo-1522083111860-2a819b5c3d4a?auto=format&fit=crop&q=80&w=400", title: "TOKYO" },
  { id: 16, url: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&q=80&w=400", title: "MIAMI" },
  { id: 17, url: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&q=80&w=400", title: "LONDON" },
  { id: 18, url: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&q=80&w=400", title: "ROME" },
  { id: 19, url: "https://images.unsplash.com/photo-1542051812871-75f56cc9a3af?auto=format&fit=crop&q=80&w=400", title: "KYOTO" },
  { id: 20, url: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&q=80&w=400", title: "VENICE" },
];

export default function HostLoginBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#F5F5F5] z-0">
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4 md:p-8 animate-[pan_100s_linear_infinite] md:animate-none opacity: 1,y-80">
        {POSTERS.map((poster, idx) => (
          <motion.div
            key={`${poster.id}-${idx}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
            className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-sm bg-gray-200"
          >
            <Image
              src={poster.url}
              alt={poster.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
            />
            {/* Poster Overlay Text matching the vibrant style */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <h3 className="text-white font-black text-xl md:text-2xl lg:text-3xl tracking-widest drop-shadow-lg">
                {poster.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Soft gradient overlay to make the center card pop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
    </div>
  );
}
