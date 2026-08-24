"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, propertyApi } from "@/lib/api";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";

export default function HostDashboard() {
  const [profile, setProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHostData = async () => {
      try {
        const profileRes = await authApi.getProfile();
        if (!profileRes || !profileRes.success) {
          router.push("/");
          return;
        }
        setProfile(profileRes.data);

        // Fetch properties (backend should ideally filter by hostId if user is Host)
        // Or we just get all properties and filter if necessary (for MVP)
        const propsRes = await propertyApi.getProperties();
        if (propsRes && propsRes.success) {
          const hostProps = propsRes.data.filter(p => p.hostId === profileRes.data.id);
          setProperties(hostProps);
        } else if (Array.isArray(propsRes)) {
           setProperties(propsRes.filter(p => p.hostId === profileRes.data.id));
        }

      } catch (err) {
        console.error("Failed to load host dashboard", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchHostData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-[120px] flex justify-center items-center">
        <p className="text-gray-500">Loading Host Dashboard...</p>
      </div>
    );
  }

  // Calculate some basic stats
  const totalListings = properties.length;
  const activeListings = properties.filter(p => p.isActive).length;
  const totalReviews = properties.reduce((sum, p) => sum + (p.totalReviews || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar forceCompact={true} />

      <main className="pt-[120px]">
        <Container>
          <div className="flex justify-between items-center mb-8">
             <h1 className="text-3xl font-bold text-foreground">Host Dashboard</h1>
             <button 
                onClick={() => alert("To add a property, use the Admin panel or create a listing form.")}
                className="px-6 py-2.5 bg-primary hover:bg-[#D89C2B] text-white font-bold rounded-xl transition shadow-sm"
             >
                Create Listing
             </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
               <p className="text-muted font-bold text-sm uppercase tracking-wider mb-2">Total Listings</p>
               <h2 className="text-4xl font-bold text-foreground">{totalListings}</h2>
            </div>
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
               <p className="text-muted font-bold text-sm uppercase tracking-wider mb-2">Active Listings</p>
               <h2 className="text-4xl font-bold text-foreground">{activeListings}</h2>
            </div>
            <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
               <p className="text-muted font-bold text-sm uppercase tracking-wider mb-2">Total Reviews</p>
               <h2 className="text-4xl font-bold text-foreground">{totalReviews}</h2>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Properties</h2>

          {properties.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-10 text-center flex flex-col items-center">
              <h3 className="text-xl font-bold text-foreground mb-2">No properties listed yet</h3>
              <p className="text-muted mb-6">Start earning by listing your first property on Stayr.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                 <div key={property.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition cursor-pointer" onClick={() => router.push(`/property/${property.id}`)}>
                    <div className="w-full aspect-[4/3] bg-gray-200 overflow-hidden relative">
                       <img src={property.featuredImage || property.images?.[0]?.url || "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"} onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"; e.currentTarget.onerror = null; }} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                       <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold shadow-sm ${property.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {property.isActive ? 'Active' : 'Inactive'}
                       </div>
                    </div>
                    <div className="p-4 flex flex-col">
                       <h3 className="font-bold text-foreground truncate">{property.title}</h3>
                       <p className="text-sm text-muted mt-1">{property.city}</p>
                       <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                          <span className="font-bold text-foreground">₹{property.pricePerNight?.toLocaleString('en-IN')}/night</span>
                          <span className="text-sm text-muted">⭐ {property.averageRating || "New"}</span>
                       </div>
                    </div>
                 </div>
              ))}
            </div>
          )}

        </Container>
      </main>
    </div>
  );
}
