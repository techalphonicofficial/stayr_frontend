"use client";

import { Menu, User } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AuthModal from "../modals/AuthModal";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const openAuthModal = useCallback(() => {
    setIsOpen(false);
    setIsAuthModalOpen(true);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative" ref={menuRef}>
        <div className="flex flex-row items-center gap-3">
          <div 
            onClick={() => router.push('/become-a-host')}
            className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-secondary transition cursor-pointer text-primary"
          >
            Become a Host
          </div>

          <div 
            onClick={toggleOpen}
            className="p-4 md:py-2 md:px-3 border border-border flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition bg-white"
          >
            <Menu size={18} className="text-primary" />
            <div className="hidden md:block bg-muted text-white rounded-full p-1">
              <User size={18} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute rounded-theme shadow-lg border border-border w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-14 text-sm flex flex-col cursor-pointer z-[100]"
            >
              <div className="flex flex-col cursor-pointer pb-2 pt-2">
                <div onClick={openAuthModal} className="px-4 py-3 hover:bg-secondary transition font-semibold text-primary">Sign up</div>
                <div onClick={openAuthModal} className="px-4 py-3 hover:bg-secondary transition text-primary">Log in</div>
                <hr className="border-border my-1" />
                <div 
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/become-a-host');
                  }} 
                  className="px-4 py-3 hover:bg-secondary transition text-primary"
                >
                  Stayr your home
                </div>
                <div 
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/help');
                  }} 
                  className="px-4 py-3 hover:bg-secondary transition text-primary"
                >
                  Help Center
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
