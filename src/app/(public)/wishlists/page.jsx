"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { wishlistApi } from "@/lib/api";
import Container from "@/components/common/Container";
import ListingCard from "@/components/listings/ListingCard";
import Link from "next/link";
import { HeartCrack } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { savedPropertyIds, isWishlistLoading } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadWishlist() {
      try {
        const res = await wishlistApi.getWishlist();
        if (res?.success) {
          setWishlistItems(res.data);
        }
      } catch (err) {
        if (err.message.includes("401") || err.message.toLowerCase().includes("unauthorized")) {
          router.push("/login?redirect=/wishlist");
        }
        console.error("Failed to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!isWishlistLoading) {
      loadWishlist();
    }
  }, [isWishlistLoading, router, savedPropertyIds.size]); // Re-fetch if size changes (meaning an item was removed)

  if (loading || isWishlistLoading) {
    return (
      <Container>
        <div className="py-12 md:py-20 min-h-[50vh] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF385C]"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading your wishlist...</p>
        </div>
      </Container>
    );
  }

  // Filter items to ensure we only show what's actually in the context (in case of optimistic deletes)
  const displayItems = wishlistItems.filter(item => savedPropertyIds.has(item.propertyId));

  if (displayItems.length === 0) {
    return (
      <Container>
        <div className="py-16 md:py-32 min-h-[60vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <div className="bg-pink-50 p-6 rounded-full mb-6">
            <HeartCrack className="w-16 h-16 text-[#FF385C]" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Your wishlist is empty</h1>
          <p className="text-muted mb-8 text-lg">
            As you search, tap the heart icon to save your favourite places and Experiences to a wishlist.
          </p>
          <Link 
            href="/" 
            className="px-8 py-4 bg-[#FF385C] text-white rounded-lg font-bold hover:bg-[#E03150] transition shadow-lg hover:shadow-xl active:scale-95"
          >
            Start exploring
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10 md:py-16 min-h-[60vh]">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Wishlists</h1>
        <p className="text-muted mb-10 text-lg">You have {displayItems.length} saved {displayItems.length === 1 ? 'property' : 'properties'}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {displayItems.map((item) => {
            const prop = item.property;
            const primaryImage = prop.images && prop.images.length > 0 ? prop.images[0].url : prop.featuredImage;
            const review = prop.reviews && prop.reviews.length > 0 ? prop.reviews[0] : null;

            return (
              <ListingCard
                key={prop.id}
                id={prop.id}
                image={primaryImage}
                title={prop.title}
                price={`${prop.currency} ${prop.pricePerNight}`}
                nights={1} // Default for display
                rating={prop.averageRating > 0 ? prop.averageRating.toFixed(2) : "New"}
                reviewCount={prop.totalReviews}
                topReview={review}
                guestFavourite={prop.averageRating >= 4.8}
              />
            );
          })}
        </div>
      </div>
    </Container>
  );
}
