export default function PropertyHeader({ property }) {
  if (!property) return null;

  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 pb-6 mb-8 mt-6">
      <h1 className="text-[26px] md:text-[32px] font-bold text-[#2B2B2B] leading-tight">
        {property.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm md:text-[15px] text-[#2B2B2B]">
        <div className="flex items-center gap-1 font-semibold">
          <span className="text-[#0050FF]">★</span> {property.rating} 
        </div>
        <span>·</span>
        <span className="font-semibold underline cursor-pointer">{property.reviewCount} reviews</span>
        <span>·</span>
        <span className="text-[#7B7468]">{property.location || "Varanasi, Uttar Pradesh, India"}</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm md:text-[15px] text-[#2B2B2B] mt-1">
        <span className="font-semibold">{property.propertyType || "Entire property"}</span>
        <span>·</span>
        <span>{property.guests} guests</span>
        <span>·</span>
        <span>{property.bedrooms} bedrooms</span>
        <span>·</span>
        <span>{property.bathrooms} bathrooms</span>
      </div>
    </div>
  );
}
