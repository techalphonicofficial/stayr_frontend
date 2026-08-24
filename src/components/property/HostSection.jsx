import Image from "next/image";

export default function HostSection({ host }) {
  if (!host) return null;

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-[22px] font-bold text-foreground mb-6">About the host</h2>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
          <Image 
            src={host.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"} 
            alt={host.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-foreground text-[17px]">{host.name}</h3>
          <span className="text-muted text-[15px]">{host.role || "Host"}</span>
        </div>
      </div>

      <button className="border border-foreground text-[#0050FF] font-semibold py-2 px-6 rounded-full hover:bg-blue-50 transition border-[#0050FF]">
        Contact host
      </button>
    </div>
  );
}
