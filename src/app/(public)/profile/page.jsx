"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, bookingApi } from "@/lib/api";
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/common/Container";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndBookings = async () => {
      try {
        const profileRes = await authApi.getProfile();
        if (!profileRes || !profileRes.success) {
          router.push("/");
          return;
        }
        setProfile(profileRes.data);

        const bookingsRes = await bookingApi.getMyBookings();
        if (bookingsRes && bookingsRes.success) {
          setBookings(bookingsRes.data);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndBookings();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-[120px] flex justify-center items-center">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar forceCompact={true} />

      <main className="pt-[120px]">
        <Container>
          <div className="flex flex-col md:flex-row gap-12">

            {/* Left Column - User Info */}
            <div className="w-full md:w-1/3">
              <div className="bg-white border border-border rounded-2xl p-8 shadow-sm flex flex-col items-center text-center sticky top-28">
                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                  <img
                    src={profile?.profileImage || "https://ui-avatars.com/api/?name=" + (profile?.name || "User") + "&background=E8B65B&color=fff"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-bold text-foreground">{profile?.name}</h1>
                <p className="text-muted">{profile?.email}</p>
                <div className="mt-6 pt-6 border-t border-border w-full text-left">
                  <p className="text-sm font-semibold text-foreground mb-2">Account Details</p>
                  <p className="text-sm text-muted mb-1">Phone: {profile?.phone || "Not provided"}</p>
                  <p className="text-sm text-muted">Role: {profile?.role}</p>
                </div>
                <button
                  onClick={async () => {
                    await authApi.logout();
                    window.location.href = "/";
                  }}
                  className="mt-8 w-full py-2.5 border border-[#B0A89D] text-foreground font-bold rounded-xl hover:bg-gray-50 transition"
                >
                  Log out
                </button>
              </div>
            </div>

            {/* Right Column - Trips/Bookings */}
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Trips</h2>

              {bookings.length === 0 ? (
                <div className="bg-white border border-border rounded-2xl p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No trips booked... yet!</h3>
                  <p className="text-muted mb-6">Time to dust off your bags and start planning your next adventure.</p>
                  <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 bg-primary hover:bg-[#D89C2B] text-white font-bold rounded-xl transition shadow-sm"
                  >
                    Start searching
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition">
                      <div className="w-full sm:w-1/3 aspect-video bg-gray-200 rounded-xl overflow-hidden">
                        <img
                          src={booking.property?.featuredImage || booking.property?.images?.[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"}
                          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"; e.currentTarget.onerror = null; }}
                          alt="Property"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-bold text-muted uppercase tracking-wider mb-1">{booking.property?.city || "Stayr Destination"}</p>
                          <h3 className="text-lg font-bold text-foreground mb-1">{booking.property?.title}</h3>
                          <p className="text-muted text-sm">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                          <p className="text-muted text-sm mt-1">{booking.guestsCount} guests</p>
                        </div>
                        <div className="mt-4 flex justify-between items-end border-t border-border pt-4">
                          <div>
                            <p className="text-sm font-bold text-foreground">₹{booking.totalPrice?.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-gray-500">{booking.status} • {booking.paymentStatus}</p>
                          </div>
                          <button
                            onClick={() => router.push(`/property/${booking.property?.id}`)}
                            className="text-sm font-bold text-primary hover:underline"
                          >
                            View Property
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </Container>
      </main>
    </div>
  );
}
