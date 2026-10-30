// Shared constants + sanitisation for real-estate sale listings.
// Keeps sale business rules separate from rental (Property) rules.

export const SALE_PROPERTY_TYPES = {
  Residential: ['Apartment', 'Independent House', 'Villa', 'Independent Villa', 'Penthouse', 'Builder Floor', 'Plot', 'Residential Plot', 'Studio Apartment', 'Farmhouse'],
  Commercial: ['Office Space', 'Shop', 'Shop / Showroom', 'Commercial Building', 'Commercial Land', 'Warehouse', 'Co-working Space', 'Other Commercial'],
};

// Types for which bedrooms / bathrooms / BHK do not apply
export const LAND_TYPES = ['Plot', 'Residential Plot', 'Commercial Land'];
export const NON_RESIDENTIAL_LAYOUT_TYPES = [
  'Plot', 'Residential Plot', 'Commercial Land', 'Office Space', 'Shop', 'Shop / Showroom', 
  'Commercial Building', 'Warehouse', 'Co-working Space', 'Other Commercial'
];

export const AREA_UNITS = ['sq ft', 'sq m', 'sq yd', 'acre'];
export const FURNISHING = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
export const POSSESSION = ['Ready to Move', 'Under Construction'];
export const PROPERTY_AGE = ['New Construction', '0-1 years', '1-5 years', '5-10 years', '10+ years', '0-1 Year (New)', '1-3 Years', '3-5 Years'];
export const OWNERSHIP_TYPES = ['Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney'];
export const SELLER_TYPES = ['Owner', 'Authorized Representative', 'Agent', 'Builder'];
export const MAX_PRICE = 1e11; // ₹10,000 crore sanity cap

const STRING_FIELDS = [
  'title', 'description', 'propertyType', 'additionalCharges', 'possessionStatus', 'areaUnit',
  'bhk', 'furnishingStatus', 'propertyAge', 'parking', 'facingDirection',
  'address', 'locality', 'city', 'state', 'country', 'postalCode',
  'ownershipType', 'sellerType', 'reraNumber',
];
const FLOAT_FIELDS = ['price', 'area', 'carpetArea', 'builtUpArea', 'superBuiltUpArea', 'plotArea', 'latitude', 'longitude'];
const INT_FIELDS = ['bedrooms', 'bathrooms', 'balconies', 'floor', 'totalFloors'];

const toFloat = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
};
const toInt = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

/**
 * Builds a Prisma data object from an untrusted request body using an allowlist.
 * Moderation / ownership fields (status, isApproved, isVerified, sellerId, slug,
 * rejectionReason, counters) can never be set through this function.
 */
export const pickSaleFields = (body = {}) => {
  const data = {};
  for (const f of STRING_FIELDS) {
    if (body[f] !== undefined) data[f] = body[f] === null ? null : String(body[f]).trim().slice(0, f === 'description' ? 10000 : 255);
  }
  for (const f of FLOAT_FIELDS) {
    if (body[f] !== undefined) data[f] = toFloat(body[f]);
  }
  for (const f of INT_FIELDS) {
    if (body[f] !== undefined) data[f] = toInt(body[f]);
  }
  if (body.category !== undefined && ['Residential', 'Commercial'].includes(body.category)) {
    data.category = body.category;
  }
  if (body.priceNegotiable !== undefined) data.priceNegotiable = !!body.priceNegotiable;
  if (body.availableFrom !== undefined) {
    const d = body.availableFrom ? new Date(body.availableFrom) : null;
    data.availableFrom = d && !isNaN(d.getTime()) ? d : null;
  }
  if (body.amenities !== undefined) {
    data.amenities = Array.isArray(body.amenities)
      ? body.amenities.filter((a) => typeof a === 'string').map((a) => a.trim().slice(0, 80)).slice(0, 60)
      : [];
  }

  // Required non-null columns: never write null into them on drafts
  if (data.price === null) data.price = 0;
  if (data.area === null) data.area = 0;
  for (const req of ['title', 'description', 'propertyType', 'address', 'city', 'state']) {
    if (data[req] === null) data[req] = '';
  }
  return data;
};

/** Field-level validation used when a seller submits a listing for review. */
export const validateForSubmission = (l) => {
  const errors = [];
  const types = SALE_PROPERTY_TYPES[l.category] || [];
  if (!types.includes(l.propertyType)) errors.push('Select a valid property type for the chosen category');
  if (!l.title || l.title.trim().length < 5) errors.push('Title must be at least 5 characters');
  if (!l.description || l.description.trim().length < 10) errors.push('Description must be at least 10 characters');
  if (!l.price || l.price <= 0 || l.price > MAX_PRICE) errors.push('Enter a valid asking price in INR');
  if (!l.area || l.area <= 0) errors.push('Enter the property area');
  if (!l.address?.trim()) errors.push('Address is required');
  if (!l.city?.trim()) errors.push('City is required');
  if (!l.state?.trim()) errors.push('State is required');
  if (!NON_RESIDENTIAL_LAYOUT_TYPES.includes(l.propertyType)) {
    if (l.bedrooms === null || l.bedrooms === undefined || l.bedrooms < 0) errors.push('Number of bedrooms is required');
  }
  if (l.floor !== null && l.totalFloors !== null && l.floor !== undefined && l.totalFloors !== undefined && l.floor > l.totalFloors) {
    errors.push('Floor number cannot exceed total floors');
  }
  if (!l.images || l.images.length < 1) errors.push('Upload at least one photo');
  return errors;
};

/** Removes moderation-only fields before returning a listing to non-owners. */
export const toPublicListing = (listing) => {
  if (!listing) return listing;
  const { rejectionReason, reraNumber, ...rest } = listing;
  // RERA numbers are public registrations in India, but are only shown once an admin verified the listing.
  return { ...rest, reraNumber: listing.isVerified ? reraNumber : null };
};

/** Price per sq ft only when the stored unit really is sq ft. */
export const pricePerSqFt = (l) => (l.area > 0 && l.areaUnit === 'sq ft' ? Math.round(l.price / l.area) : null);

