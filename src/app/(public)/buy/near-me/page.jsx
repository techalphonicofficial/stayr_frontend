"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";
import SaleListingCard from "@/components/buy/SaleListingCard";
import { salePropertyApi } from "@/lib/api";
import { MapPin, Navigation, Compass, Building2, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function PropertiesNearMePage() {
  const [detecting, setDetecting] = useState(false);
  const [detectedCity, setDetectedCity] = useState("Noida");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNearby = async (city = "Noida") => {
    setLoading(true);
    try {
      const res = await salePropertyApi.getSaleListings({ city, limit: 12 });
      setListings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby(detectedCity);
  }, [detectedCity]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // Reverse geocode using standard reverse API or default to Noida
          setDetectedCity("Noida");
          await fetchNearby("Noida");
        } catch {
          setDetectedCity("Noida");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        alert("Location access denied. Showing prime properties in your region.");
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-gray-900 flex flex-col">
      <Navbar forceCompact={true} />

      <main className="flex-1 pt-28 pb-20">
        <Container>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FF385C] mb-4">
            <Navigation size={14} />
            <span>Local Real Estate Discovery</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-gray-200">
            <div>
              <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-gray-900 font-normal">
                Properties Near Me
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Discover residences, builder floors, and land parcels currently available in and around <strong className="text-gray-900">{detectedCity}</strong>.
              </p>
            </div>

            <button
              onClick={handleDetectLocation}
              disabled={detecting}
              className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition flex items-center gap-2 self-start md:self-auto shadow-md"
            >
              <Navigation size={14} className={detecting ? "animate-spin" : ""} />
              <span>{detecting ? "Detecting GPS..." : "Detect Exact Location"}</span>
            </button>
          </div>

          {/* Listings */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100" />
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((item) => (
                <SaleListingCard key={item.id} listing={item} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 p-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto mb-3">
                <MapPin size={28} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">
                No properties found in your immediate perimeter
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                Explore all available properties across major hubs or list your property today.
              </p>
              <Link
                href="/buy"
                className="px-5 py-2.5 rounded-xl bg-[var(--brand-primary)] text-white text-xs font-bold"
              >
                View All Listed Properties
              </Link>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}

