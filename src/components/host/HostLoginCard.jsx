"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";

export default function HostLoginCard() {
  const router = useRouter();
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    // Check if user is logged in
    authApi.getProfile()
      .then((res) => {
        if (res && res.success) {
          setUser(res.data);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterAndUpgrade = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // 1. Register User
      const regRes = await authApi.register(formData.name, formData.email, formData.password, formData.phone);
      if (!regRes.success) throw new Error("Failed to register account");

      // 2. Upgrade to Host
      const upgRes = await authApi.becomeHost();
      if (!upgRes.success) throw new Error("Registered successfully, but failed to upgrade to host.");

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/become-a-host/wizard";
      }, 1200);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpgradeOnly = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const upgRes = await authApi.becomeHost();
      if (!upgRes.success) throw new Error("Failed to upgrade to host.");

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/become-a-host/wizard";
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="animate-spin text-[#FF385C]" size={32} />
        </div>
      );
    }

    if (success) {
      return (
        <div className="flex flex-col items-center text-center gap-4 py-8">
          <CheckCircle2 className="text-emerald-500 w-16 h-16 mb-2" />
          <h2 className="text-[22px] font-bold text-foreground">Welcome, Host!</h2>
          <p className="text-muted">Opening your property listing wizard...</p>
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex flex-col items-center text-center gap-4 py-4 w-full">
          <h2 className="text-[22px] font-bold text-foreground">
            {user.role === 'Host' || user.role === 'Admin' ? `Welcome back, ${user.name}!` : `Ready to host, ${user.name}?`}
          </h2>
          <p className="text-muted mb-2 text-sm">
            {user.role === 'Host' || user.role === 'Admin'
              ? "Create a new property listing or manage your existing listings from your host dashboard."
              : "Start earning by listing your place on Stayr. Takes only 5 minutes to set up."}
          </p>

          {error && <div className="w-full p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-2">{error}</div>}

          {/* Primary Action: Start Listing */}
          <button 
            onClick={() => {
              if (user.role === 'Host' || user.role === 'Admin') {
                router.push("/become-a-host/wizard");
              } else {
                handleUpgradeOnly();
              }
            }}
            disabled={isSubmitting}
            className="w-full py-4 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold rounded-xl transition shadow-md text-base disabled:opacity-70 flex justify-center items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <span>Start Listing Your Property</span>
            )}
          </button>

          {/* Secondary Action: Host Dashboard */}
          {(user.role === 'Host' || user.role === 'Admin') && (
            <button 
              onClick={() => router.push("/host/dashboard")}
              className="w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold rounded-xl transition text-sm cursor-pointer"
            >
              Go to Host Dashboard
            </button>
          )}
        </div>
      );
    }

    return (
      <form onSubmit={handleRegisterAndUpgrade} className="w-full flex flex-col gap-4">
        <h2 className="text-[22px] font-bold text-foreground mb-2 text-center">
          Register as a Host
        </h2>

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <div className="border border-[#B0A89D] rounded-xl overflow-hidden focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground transition flex flex-col">
          <input 
            type="text" 
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name" 
            className="w-full p-4 outline-none text-foreground placeholder:text-muted border-b border-border"
          />
          <input 
            type="email" 
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address" 
            className="w-full p-4 outline-none text-foreground placeholder:text-muted border-b border-border"
          />
          <input 
            type="tel" 
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number" 
            className="w-full p-4 outline-none text-foreground placeholder:text-muted border-b border-border"
          />
          <input 
            type="password" 
            name="password"
            required
            minLength={6}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password" 
            className="w-full p-4 outline-none text-foreground placeholder:text-muted"
          />
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#E00B41] hover:bg-[#C00032] text-white font-bold rounded-xl transition shadow-sm text-lg mt-2 flex justify-center items-center"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Agree and continue"}
        </button>
      </form>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col relative z-10 m-4"
    >
      {/* Close Button */}
      <button 
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-black/5 transition z-20"
      >
        <X size={20} className="text-foreground" />
      </button>

      {/* Body */}
      <div className="px-8 pb-10 pt-12 flex flex-col items-center relative z-10">
        <Image 
          src="/brand-logo.png" 
          alt="Stayr" 
          width={50} 
          height={50} 
          className="w-auto h-12 object-contain mb-4"
        />

        {renderContent()}

        {!user && !success && !isLoading && (
          <>
            <div className="flex flex-row items-center gap-4 w-full my-6">
              <div className="flex-1 h-[1px] bg-border"></div>
              <div className="text-sm text-muted">or</div>
              <div className="flex-1 h-[1px] bg-border"></div>
            </div>
            
            <p className="text-sm text-muted text-center">
              Already have an account? <br/> Log in from the top menu first to upgrade.
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
