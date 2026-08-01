
const assignAmenities = (listings) => {
  return listings.map(listing => {
    const seed = listing.id;
    const amenities = [];
    if (seed % 2 === 0 || seed % 3 === 0) amenities.push('Wifi');
    if (seed % 2 !== 0 || seed % 5 === 0) amenities.push('Free parking');
    if (seed % 3 === 0 || seed % 4 === 0) amenities.push('Kitchen');
    if (seed % 4 === 0 || seed % 7 === 0) amenities.push('Air conditioning');
    if (seed % 5 === 0 || seed % 2 === 0) amenities.push('1+ bathrooms');
    if (seed % 6 === 0 || seed % 3 === 0) amenities.push('TV');
    if (seed % 7 === 0 || seed % 2 !== 0) amenities.push('Self check-in');
    if (seed % 8 === 0 || seed % 11 === 0) amenities.push('Washing machine');
    if (seed % 9 === 0 || seed % 13 === 0) amenities.push('Allows pets');
    if (amenities.length < 3) amenities.push('Wifi', '1+ bathrooms', 'TV');
    return { ...listing, amenities: [...new Set(amenities)] };
  });
};

export const NOIDA_LISTINGS = assignAmenities([
  { id: 1, title: "Home in Noida", price: "₹11,736", nights: 2, rating: "4.83", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 2, title: "Flat in Noida", price: "₹12,000", nights: 2, rating: "5.0", image: "/melrose-by-the-lake-43vHzsfrmxk-unsplash.jpg", guestFavourite: false },
  { id: 3, title: "Guest suite in Noida", price: "₹5,044", nights: 2, rating: "4.9", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 4, title: "Flat in Sector 94", price: "₹5,280", nights: 2, rating: "4.97", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 5, title: "Flat in Sector 94", price: "₹5,998", nights: 2, rating: "5.0", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 6, title: "Flat in Noida", price: "₹10,225", nights: 2, rating: "4.92", image: "/melrose-by-the-lake-43vHzsfrmxk-unsplash.jpg", guestFavourite: true },
]);

export const GURGAON_LISTINGS = assignAmenities([
  { id: 11, title: "Home in Gurgaon", price: "₹14,500", nights: 2, rating: "4.95", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 12, title: "Flat in Cyber City", price: "₹12,200", nights: 2, rating: "4.88", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 13, title: "Villa in DLF Phase 1", price: "₹25,000", nights: 2, rating: "5.0", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 14, title: "Studio in Gurgaon", price: "₹6,500", nights: 2, rating: "4.82", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 15, title: "Luxury Penthouse", price: "₹35,000", nights: 2, rating: "4.98", image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 16, title: "Apartment in Golf Course Rd", price: "₹18,000", nights: 2, rating: "4.91", image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
]);

export const GOA_LISTINGS = assignAmenities([
  { id: 21, title: "Beachfront Villa", price: "₹45,000", nights: 2, rating: "4.99", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 22, title: "Resort Stay in Anjuna", price: "₹15,000", nights: 2, rating: "4.85", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 23, title: "Pool Villa in Vagator", price: "₹28,500", nights: 2, rating: "4.96", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 24, title: "Portuguese House", price: "₹12,000", nights: 2, rating: "4.92", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 25, title: "Sea View Apartment", price: "₹9,500", nights: 2, rating: "4.78", image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 26, title: "Luxury Stay in Morjim", price: "₹32,000", nights: 2, rating: "4.94", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
]);

export const DELHI_LISTINGS = assignAmenities([
  { id: 31, title: "Apartment in South Delhi", price: "₹10,500", nights: 2, rating: "4.87", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 32, title: "Flat in Vasant Kunj", price: "₹8,200", nights: 2, rating: "4.81", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 33, title: "Luxury Suite in Connaught Place", price: "₹22,000", nights: 2, rating: "4.98", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 34, title: "Modern Flat in Hauz Khas", price: "₹11,800", nights: 2, rating: "4.91", image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 35, title: "Penthouse in GK", price: "₹29,000", nights: 2, rating: "4.96", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 36, title: "Cozy Studio in Safdarjung", price: "₹5,500", nights: 2, rating: "4.79", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
]);

export const PERFECT_PLACE_LISTINGS = {
  beachfront: assignAmenities([
    { id: 101, title: "Villa in Varkala", price: "₹18,500", nights: 3, rating: "4.92", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 102, title: "Beach House in Goa", price: "₹24,000", nights: 3, rating: "4.88", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 103, title: "Cottage in Gokarna", price: "₹12,200", nights: 3, rating: "4.95", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 104, title: "Sea View in Pondicherry", price: "₹16,000", nights: 3, rating: "4.81", image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 105, title: "Villa in Marari Beach", price: "₹21,500", nights: 3, rating: "5.0", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 106, title: "Bungalow in Alibaug", price: "₹19,000", nights: 3, rating: "4.85", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 107, title: "Hut in Havelock", price: "₹14,500", nights: 3, rating: "4.78", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 108, title: "Estate in Kannur", price: "₹26,000", nights: 3, rating: "4.97", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 109, title: "Beachfront Villa in Kovalam", price: "₹18,000", nights: 3, rating: "4.91", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 110, title: "Ocean View Resort in Puri", price: "₹14,500", nights: 3, rating: "4.86", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  ]),
  pools: assignAmenities([
    { id: 201, title: "Resort in Lonavala", price: "₹32,000", nights: 3, rating: "4.96", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 202, title: "Villa in Udaipur", price: "₹45,000", nights: 3, rating: "5.0", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 203, title: "Farmhouse in Karjat", price: "₹18,500", nights: 3, rating: "4.82", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 204, title: "Estate in Coorg", price: "₹22,000", nights: 3, rating: "4.91", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 205, title: "Boutique in Jaipur", price: "₹28,000", nights: 3, rating: "4.88", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 206, title: "Villa in Wayanad", price: "₹16,500", nights: 3, rating: "4.94", image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 207, title: "Mansion in Ooty", price: "₹35,000", nights: 3, rating: "4.99", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 208, title: "Retreat in Mahabaleshwar", price: "₹21,000", nights: 3, rating: "4.75", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 209, title: "Luxury Pool Villa in Khandala", price: "₹38,000", nights: 3, rating: "4.98", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 210, title: "Riverside Resort in Dandeli", price: "₹19,000", nights: 3, rating: "4.89", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  ]),
  international: assignAmenities([
    { id: 301, title: "Villa in Bali", price: "₹55,000", nights: 3, rating: "4.98", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 302, title: "Penthouse in Dubai", price: "₹85,000", nights: 3, rating: "4.95", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 303, title: "Water Villa in Maldives", price: "₹120,000", nights: 3, rating: "5.0", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 304, title: "Chalet in Swiss Alps", price: "₹95,000", nights: 3, rating: "4.91", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 305, title: "Apartment in London", price: "₹65,000", nights: 3, rating: "4.85", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 306, title: "Condo in Singapore", price: "₹45,000", nights: 3, rating: "4.89", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 307, title: "Beach House in Phuket", price: "₹35,000", nights: 3, rating: "4.94", image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 308, title: "Villa in Tuscany", price: "₹75,000", nights: 3, rating: "4.97", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 309, title: "Apartment in Paris", price: "₹88,000", nights: 3, rating: "4.93", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 310, title: "Cabin in New Zealand", price: "₹62,000", nights: 3, rating: "4.99", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  ]),
  family: assignAmenities([
    { id: 401, title: "Cottage in Shimla", price: "₹15,000", nights: 3, rating: "4.90", image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 402, title: "Homestay in Manali", price: "₹12,500", nights: 3, rating: "4.85", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 403, title: "Estate in Munnar", price: "₹18,000", nights: 3, rating: "4.93", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 404, title: "Villa in Kodaikanal", price: "₹22,000", nights: 3, rating: "4.97", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 405, title: "Retreat in Darjeeling", price: "₹16,500", nights: 3, rating: "4.88", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 406, title: "Farmhouse in Panchgani", price: "₹14,000", nights: 3, rating: "4.82", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
    { id: 407, title: "Houseboat in Srinagar", price: "₹25,000", nights: 3, rating: "4.95", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 408, title: "Bungalow in Coonoor", price: "₹20,000", nights: 3, rating: "4.91", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 409, title: "Cottage in Nainital", price: "₹18,500", nights: 3, rating: "4.87", image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
    { id: 410, title: "Homestay in Spiti Valley", price: "₹11,000", nights: 3, rating: "4.94", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  ]),
};

export const DISCOUNTED_LISTINGS = assignAmenities([
  { id: 901, title: "Heritage Palace in Jaipur", price: "₹24,500", originalPrice: "₹35,000", discountText: "Save ₹10,500", nights: 2, rating: "4.98", image: "/rajasthan_palace.png", guestFavourite: true },
  { id: 902, title: "Pool Villa in Alibaug", price: "₹18,000", originalPrice: "₹22,000", discountText: "Save ₹4,000", nights: 2, rating: "4.85", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 903, title: "Tea Estate in Munnar", price: "₹12,200", originalPrice: "₹15,000", discountText: "Save ₹2,800", nights: 2, rating: "4.95", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 904, title: "Houseboat in Kerala", price: "₹16,000", originalPrice: "₹21,000", discountText: "Last minute ₹5,000 off", nights: 2, rating: "4.91", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 905, title: "Cottage in Manali", price: "₹8,500", originalPrice: "₹12,000", discountText: "Save ₹3,500", nights: 2, rating: "4.88", image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 906, title: "Forest Retreat in Coorg", price: "₹14,000", originalPrice: "₹18,500", discountText: "25% Off", nights: 2, rating: "4.94", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 907, title: "Boutique Villa in Lonavala", price: "₹22,000", originalPrice: "₹30,000", discountText: "Save ₹8,000", nights: 2, rating: "4.92", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 908, title: "Luxury Tent in Jaisalmer", price: "₹9,000", originalPrice: "₹14,000", discountText: "Save ₹5,000", nights: 2, rating: "4.79", image: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 909, title: "Farmhouse in Panchgani", price: "₹11,500", originalPrice: "₹16,000", discountText: "Save ₹4,500", nights: 2, rating: "4.86", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 910, title: "Beach Shack in Gokarna", price: "₹6,000", originalPrice: "₹9,500", discountText: "Last minute deal", nights: 2, rating: "4.75", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 911, title: "Mountain Cabin in Shimla", price: "₹13,500", originalPrice: "₹19,000", discountText: "Save ₹5,500", nights: 2, rating: "4.97", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 912, title: "Riverside Resort in Rishikesh", price: "₹15,000", originalPrice: "₹20,000", discountText: "Save ₹5,000", nights: 2, rating: "4.89", image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
  { id: 913, title: "Eco-Lodge in Wayanad", price: "₹10,500", originalPrice: "₹15,000", discountText: "Save ₹4,500", nights: 2, rating: "4.91", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1000", guestFavourite: false },
  { id: 914, title: "Colonial House in Pondicherry", price: "₹17,000", originalPrice: "₹24,000", discountText: "Special Offer", nights: 2, rating: "4.93", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000", guestFavourite: true },
]);

// Generate 18 distinct listings for the search results page
export const SEARCH_RESULTS_LISTINGS = [
  ...NOIDA_LISTINGS.map(l => ({ ...l, id: l.id + 500 })),
  ...NOIDA_LISTINGS.map(l => ({ ...l, id: l.id + 510 })),
  ...NOIDA_LISTINGS.map(l => ({ ...l, id: l.id + 520 })),
];

// Flat array of all listings for lookup
export const ALL_LISTINGS = [
  ...NOIDA_LISTINGS,
  ...GURGAON_LISTINGS,
  ...GOA_LISTINGS,
  ...DELHI_LISTINGS,
  ...PERFECT_PLACE_LISTINGS.beachfront,
  ...PERFECT_PLACE_LISTINGS.pools,
  ...PERFECT_PLACE_LISTINGS.international,
  ...PERFECT_PLACE_LISTINGS.family,
  ...SEARCH_RESULTS_LISTINGS,
  ...DISCOUNTED_LISTINGS,
];

// Lookup utility
export const getListingById = (id) => {
  const numericId = parseInt(id, 10);
  return ALL_LISTINGS.find(listing => listing.id === numericId) || null;
};
