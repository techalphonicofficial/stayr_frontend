"use client";

import { useEffect, useState } from "react";
import { bookingApi } from "@/lib/api";
import Container from "@/components/common/Container";
import Link from "next/link";
import { Map, Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import TripDetailsModal from "@/components/modals/TripDetailsModal";

import Navbar from "@/components/navbar/Navbar";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadTrips() {
      try {
        const res = await bookingApi.getMyBookings();
        if (res?.success) {
          setTrips(res.data);
        }
      } catch (err) {
        if (err.message.includes("401") || err.message.toLowerCase().includes("unauthorized")) {
          router.push("/login?redirect=/trips");
        }
        console.error("Failed to load trips:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTrips();
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container>
          <div className="pt-32 pb-12 md:pt-40 md:pb-20 min-h-[50vh] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted font-medium">Loading your trips...</p>
          </div>
        </Container>
      </>
    );
  }

  if (trips.length === 0) {
    return (
      <>
        <Navbar />
        <Container>
          <div className="pt-32 pb-16 md:pt-40 md:pb-32 min-h-[60vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <div className="bg-secondary p-6 rounded-full mb-6">
              <Map className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">No trips booked... yet!</h1>
            <p className="text-muted mb-8 text-lg">
              Time to dust off your bags and start planning your next adventure.
            </p>
            <Link 
              href="/" 
              className="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition shadow-lg hover:shadow-xl active:scale-95"
            >
              Start searching
            </Link>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container>
        <div className="pt-32 pb-10 md:pt-40 md:pb-16 min-h-[60vh]">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Trips</h1>
            <p className="text-muted text-lg">You have {trips.length} upcoming or past {trips.length === 1 ? 'trip' : 'trips'}</p>
          </div>

        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {trips.map((trip) => {
            const property = trip.property;
            const primaryImage = property.featuredImage || "/placeholder-image.jpg";
            
            return (
              <div 
                key={trip._id} 
                className="flex flex-col md:flex-row gap-6 border border-border rounded-xl p-4 md:p-6 hover:shadow-md transition cursor-pointer bg-white group"
                onClick={() => {
                  setSelectedTrip(trip);
                  setIsModalOpen(true);
                }}
              >
                <div className="w-full md:w-64 h-48 md:h-full rounded-lg overflow-hidden shrink-0">
                  <img 
                    src={primaryImage} 
                    alt={property.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                
                <div className="flex flex-col flex-grow justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-foreground">{property.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        trip.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        trip.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        trip.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                    <p className="text-muted text-sm mb-4">{property.city}, {property.country}</p>
                    
                    <div className="flex items-center gap-2 text-foreground font-medium bg-secondary/50 p-3 rounded-lg w-fit">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>{new Date(trip.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-muted mx-1">-</span>
                      <span>{new Date(trip.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-end border-t border-border pt-4">
                    <div>
                      <p className="text-sm text-muted">Total Price</p>
                      <p className="text-lg font-bold">₹{trip.totalPrice}</p>
                    </div>
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-1 transition">
                      View details <ChevronRight className="w-5 h-5 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </Container>

      <TripDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        trip={selectedTrip} 
      />
    </>
  );
}
