"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { 
  MapPin, Plus, Edit, Trash2, ExternalLink, Building2, Home, 
  Eye, CheckCircle2, AlertCircle, Clock, Phone, Mail, User, 
  ShieldCheck, X, RefreshCw, MessageSquare, Bed, Bath, Maximize,
  Tag, Calendar, IndianRupee, Layers
} from 'lucide-react';
import Link from 'next/link';
import { formatIndianPrice, calculatePricePerSqFt, formatArea } from '@/components/buy/formatters';
import { toast } from 'react-hot-toast';

function SaleStatusBadge({ status }) {
  switch (status) {
    case 'Published':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle2 size={11} /> Live
        </span>
      );
    case 'PendingReview':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          <Clock size={11} /> Under Review
        </span>
      );
    case 'ChangesRequested':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
          <AlertCircle size={11} /> Action Needed
        </span>
      );
    case 'Sold':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
          Sold
        </span>
      );
    case 'Withdrawn':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
          Withdrawn
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
          Draft
        </span>
      );
  }
}

// Sale Property Detail Modal
function SalePropertyDetailModal({ property, onClose, onRefresh }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  if (!property) return null;

  const images = property.images && property.images.length > 0 
    ? property.images.map(img => img.url)
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'];

  const handleApprove = async () => {
    if (!confirm(`Approve "${property.title}" and make it live on the marketplace?`)) return;
    setActionLoading(true);
    try {
      await adminApi.approveSaleListing(property.id, "Approved by admin");
      toast.success("Listing approved and live!");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    const feedback = prompt("Enter specific changes requested from the seller:", property.rejectionReason || "");
    if (!feedback) return;
    setActionLoading(true);
    try {
      await adminApi.requestChangesSaleListing(property.id, feedback);
      toast.success("Changes requested from seller");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to request changes");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;
    setActionLoading(true);
    try {
      await adminApi.rejectSaleListing(property.id, reason);
      toast.success("Listing rejected");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${property.title}"?`)) return;
    setActionLoading(true);
    try {
      await adminApi.deleteSaleListing(property.id);
      toast.success("Property deleted");
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
              <Building2 size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{property.title}</h3>
                <SaleStatusBadge status={property.status} />
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-gray-400" />
                {property.locality ? `${property.locality}, ` : ''}{property.city}, {property.state} {property.pincode ? `- ${property.pincode}` : ''}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Photos */}
          <div>
            <div className="h-64 sm:h-80 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative mb-3">
              <img 
                src={images[activeImageIndex]} 
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"; }}
              />
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-medium">
                Photo {activeImageIndex + 1} of {images.length}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-16 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                      activeImageIndex === idx ? 'border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Asking Price</span>
              <span className="text-lg font-bold text-gray-900 mt-0.5 block">{formatIndianPrice(property.price)}</span>
              {property.priceNegotiable && (
                <span className="text-[10px] text-emerald-600 font-medium">Negotiable</span>
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Carpet Area</span>
              <span className="text-lg font-bold text-gray-900 mt-0.5 block">
                {property.carpetArea ? formatArea(property.carpetArea) : 'N/A'}
              </span>
              {property.superBuiltUpArea && (
                <span className="text-[10px] text-gray-500">Super: {formatArea(property.superBuiltUpArea)}</span>
              )}
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Configuration</span>
              <span className="text-lg font-bold text-gray-900 mt-0.5 block">
                {property.bedrooms ? `${property.bedrooms} BHK` : property.propertyType}
              </span>
              <span className="text-[10px] text-gray-500">{property.bathrooms || 0} Baths • {property.balconies || 0} Balconies</span>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Buyer Leads</span>
              <span className="text-lg font-bold text-gray-900 mt-0.5 block">
                {property._count?.inquiries || 0} Inquiries
              </span>
              <span className="text-[10px] text-gray-500">{property._count?.savedBy || 0} Wishlisted</span>
            </div>
          </div>

          {/* Detailed Specs Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Property Specifications</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 text-xs bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div>
                <span className="text-gray-500 block">Category</span>
                <span className="font-semibold text-gray-900 capitalize">{property.category} • {property.propertyType}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Furnishing</span>
                <span className="font-semibold text-gray-900 capitalize">{property.furnishing || 'Unspecified'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Floor Position</span>
                <span className="font-semibold text-gray-900">
                  {property.floorNumber !== null && property.floorNumber !== undefined 
                    ? `Floor ${property.floorNumber} of ${property.totalFloors || 'N/A'}` 
                    : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Facing Direction</span>
                <span className="font-semibold text-gray-900">{property.facing || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Possession Status</span>
                <span className="font-semibold text-gray-900">{property.possessionStatus || 'Ready to Move'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Age of Property</span>
                <span className="font-semibold text-gray-900">{property.ageOfProperty ? `${property.ageOfProperty} Years` : 'New Construction'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Ownership Type</span>
                <span className="font-semibold text-gray-900">{property.ownershipType || 'Freehold'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">RERA Registration</span>
                <span className="font-semibold text-gray-900 font-mono text-[11px]">{property.reraId || 'Not registered / NA'}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Rate / Sq Ft</span>
                <span className="font-semibold text-gray-900">
                  {calculatePricePerSqFt(property.price, property.carpetArea) || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</h4>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                {property.description}
              </p>
            </div>
          )}

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Amenities & Highlights</h4>
              <div className="flex flex-wrap gap-1.5">
                {property.amenities.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Seller Information */}
          <div className="p-4 rounded-xl border border-gray-200 bg-white">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
              <User size={14} />
              Seller Contact Details
            </h4>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                  {property.seller?.name?.[0] || 'S'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                    {property.seller?.name || 'Unknown Seller'}
                    {property.seller?.isVerified && (
                      <span className="inline-flex items-center text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                        <ShieldCheck size={11} className="mr-0.5" /> Verified Seller
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Mail size={11} /> {property.seller?.email || 'No email'}
                    </span>
                    {property.seller?.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={11} /> {property.seller?.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <span>Seller ID: </span>
                <code className="text-gray-700 bg-gray-100 px-1 py-0.5 rounded text-[11px]">{property.sellerId}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/buy/${property.slug || property.id}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-white text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition"
            >
              <ExternalLink size={13} />
              <span>View Public Page</span>
            </Link>

            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-3 py-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {property.status === 'PendingReview' && (
              <>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                >
                  Reject
                </button>
                <button
                  onClick={handleRequestChanges}
                  disabled={actionLoading}
                  className="px-3.5 py-2 rounded-xl border border-orange-200 text-orange-700 hover:bg-orange-50 text-xs font-semibold transition"
                >
                  Request Changes
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 size={14} />
                  <span>Approve & Publish</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertiesPageContent({ defaultSection = 'rentals' }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active section: 'rentals' | 'sale'
  const paramType = searchParams.get('type');
  const initialType = paramType ? (paramType === 'sale' ? 'sale' : 'rentals') : defaultSection;
  const [activeSection, setActiveSection] = useState(initialType);

  // Sync state when query param changes
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'sale') setActiveSection('sale');
    else if (type === 'rentals') setActiveSection('rentals');
  }, [searchParams]);

  const switchSection = (section) => {
    setActiveSection(section);
    router.replace(`/admin/properties?type=${section}`, { scroll: false });
  };

  // ===============================
  // Rentals State & Handlers
  // ===============================
  const [rentalData, setRentalData] = useState([]);
  const [rentalLoading, setRentalLoading] = useState(true);
  const [rentalPagination, setRentalPagination] = useState({ currentPage: 1, limit: 10 });
  const [rentalSearchQuery, setRentalSearchQuery] = useState('');

  const fetchRentalProperties = async (page = 1, search = '') => {
    setRentalLoading(true);
    try {
      let query = `?page=${page}&limit=${rentalPagination.limit}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const res = await adminApi.getProperties(query);
      setRentalData(res.data || []);
      setRentalPagination(p => ({ ...p, currentPage: page, next: res.pagination?.next, prev: res.pagination?.prev }));
    } catch (err) {
      console.error(err);
    } finally {
      setRentalLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'rentals') {
      const timer = setTimeout(() => {
        fetchRentalProperties(1, rentalSearchQuery);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [rentalSearchQuery, activeSection]);

  // ===============================
  // Sale Properties State & Handlers
  // ===============================
  const [saleData, setSaleData] = useState([]);
  const [saleLoading, setSaleLoading] = useState(true);
  const [salePagination, setSalePagination] = useState({ currentPage: 1, limit: 10 });
  const [saleSearchQuery, setSaleSearchQuery] = useState('');
  const [saleStatusFilter, setSaleStatusFilter] = useState('all');
  const [selectedSaleProperty, setSelectedSaleProperty] = useState(null);

  const fetchSaleProperties = useCallback(async (page = 1, search = '', status = 'all') => {
    setSaleLoading(true);
    try {
      let query = `page=${page}&limit=${salePagination.limit}`;
      if (status && status !== 'all') query += `&status=${status}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;

      const res = await adminApi.getAdminSaleListings(query);
      if (res && res.success) {
        setSaleData(res.data || []);
        setSalePagination(p => ({ ...p, currentPage: page, total: res.total }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load sale properties');
    } finally {
      setSaleLoading(false);
    }
  }, [salePagination.limit]);

  useEffect(() => {
    if (activeSection === 'sale') {
      const timer = setTimeout(() => {
        fetchSaleProperties(1, saleSearchQuery, saleStatusFilter);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [saleSearchQuery, saleStatusFilter, activeSection, fetchSaleProperties]);

  // Rental Columns
  const rentalColumns = [
    {
      header: 'Property',
      accessor: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80'} 
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80"; e.currentTarget.onerror = null; }}
            alt="" 
            className="h-10 w-12 rounded object-cover" 
          />
          <div>
            <div className="font-medium text-gray-900 line-clamp-1">{row.title}</div>
            <div className="text-gray-500 text-xs flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {row.city}, {row.country}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Host',
      accessor: 'host',
      cell: (row) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">{row.host?.name || 'Unknown'}</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
    },
    {
      header: 'Price/Night',
      accessor: 'pricePerNight',
      cell: (row) => <span className="font-medium">₹{row.pricePerNight}</span>
    },
    {
      header: 'Approved',
      accessor: 'isApproved',
      cell: (row) => <StatusBadge status={row.isApproved} />
    },
    {
      header: 'Listed On',
      accessor: 'createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/property/${row.id}`} target="_blank" className="p-1 text-gray-500 hover:text-blue-500 transition-colors" title="View Public Page">
            <ExternalLink className="w-4 h-4" />
          </Link>
          <Link href={`/admin/properties/edit/${row.id}`} className="p-1 text-gray-500 hover:text-primary transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </Link>
          <button 
            onClick={async () => {
              if (confirm('Are you sure you want to delete this rental property?')) {
                await adminApi.deleteProperty(row.id);
                fetchRentalProperties(rentalPagination.currentPage, rentalSearchQuery);
              }
            }}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Sale Columns
  const saleColumns = [
    {
      header: 'Property',
      accessor: 'title',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80'} 
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80"; e.currentTarget.onerror = null; }}
            alt="" 
            className="h-11 w-14 rounded-lg object-cover border border-gray-100 flex-shrink-0" 
          />
          <div className="min-w-0">
            <button 
              onClick={() => setSelectedSaleProperty(row)}
              className="font-medium text-gray-900 hover:text-[var(--brand-primary)] text-left line-clamp-1 transition"
            >
              {row.title}
            </button>
            <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="truncate">{row.locality ? `${row.locality}, ` : ''}{row.city}, {row.state}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700 capitalize">
                {row.category} • {row.propertyType}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Seller',
      accessor: 'seller',
      cell: (row) => (
        <div className="text-xs">
          <div className="font-semibold text-gray-900 flex items-center gap-1">
            {row.seller?.name || 'Unknown'}
            {row.seller?.isVerified && <ShieldCheck size={12} className="text-blue-500" />}
          </div>
          <div className="text-gray-500 text-[11px] truncate max-w-[130px]">{row.seller?.email || '—'}</div>
          {row.seller?.phone && <div className="text-gray-400 text-[10px]">{row.seller.phone}</div>}
        </div>
      )
    },
    {
      header: 'Asking Price',
      accessor: 'price',
      cell: (row) => (
        <div>
          <div className="font-bold text-gray-900 text-sm">{formatIndianPrice(row.price)}</div>
          {row.carpetArea && (
            <div className="text-[10px] text-gray-500">
              {calculatePricePerSqFt(row.price, row.carpetArea)}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Specs',
      accessor: 'bedrooms',
      cell: (row) => (
        <div className="text-xs text-gray-600">
          <div className="font-medium text-gray-900">
            {row.bedrooms ? `${row.bedrooms} BHK` : row.propertyType}
          </div>
          <div className="text-[11px] text-gray-500">
            {row.carpetArea ? formatArea(row.carpetArea) : 'Area N/A'}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => <SaleStatusBadge status={row.status} />
    },
    {
      header: 'Leads',
      accessor: 'inquiries',
      cell: (row) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
          <MessageSquare size={11} /> {row._count?.inquiries || 0}
        </span>
      )
    },
    {
      header: 'Listed On',
      accessor: 'createdAt',
      cell: (row) => (
        <span className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleDateString()}</span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedSaleProperty(row)}
            className="p-1.5 text-gray-600 hover:text-[var(--brand-primary)] hover:bg-gray-100 rounded-lg transition"
            title="Inspect Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          <Link 
            href={`/buy/${row.slug || row.id}`} 
            target="_blank" 
            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" 
            title="View Live Page"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button 
            onClick={async () => {
              if (confirm(`Permanently delete "${row.title}"?`)) {
                try {
                  await adminApi.deleteSaleListing(row.id);
                  toast.success('Property deleted');
                  fetchSaleProperties(salePagination.currentPage, saleSearchQuery, saleStatusFilter);
                } catch (err) {
                  toast.error(err.message || 'Failed to delete');
                }
              }
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Top Header & Section Switcher */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
            <div className="inline-flex p-1 rounded-xl bg-gray-200/70 border border-gray-200">
              <button
                onClick={() => switchSection('rentals')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSection === 'rentals' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home size={13} />
                <span>Rentals / Stays</span>
              </button>
              <button
                onClick={() => switchSection('sale')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSection === 'sale' 
                    ? 'bg-white text-[var(--brand-primary)] shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 size={13} />
                <span>Properties For Sale</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {activeSection === 'rentals' 
              ? 'View and manage all holiday rental accommodations on Stayr.'
              : 'View, inspect and moderate all real estate properties listed for sale on Stayr.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSection === 'rentals' ? (
            <Link 
              href="/admin/properties/create" 
              className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-xl text-xs font-bold hover:bg-[var(--brand-primary)]/90 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Rental Property
            </Link>
          ) : (
            <>
              <Link 
                href="/admin/sale-approvals" 
                className="flex items-center gap-1.5 px-3.5 py-2 border border-amber-300 bg-amber-50 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition shadow-sm"
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Pending Approvals</span>
              </Link>
              <Link 
                href="/sell" 
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] text-white rounded-xl text-xs font-bold hover:bg-[var(--brand-primary)]/90 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                List Property For Sale
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        {activeSection === 'rentals' ? (
          <DataTable 
            columns={rentalColumns}
            data={rentalData}
            loading={rentalLoading}
            pagination={rentalPagination}
            onPageChange={(p) => fetchRentalProperties(p, rentalSearchQuery)}
            searchQuery={rentalSearchQuery}
            onSearch={setRentalSearchQuery}
            searchPlaceholder="Search rentals by title, city, or country..."
          />
        ) : (
          <DataTable 
            columns={saleColumns}
            data={saleData}
            loading={saleLoading}
            pagination={salePagination}
            onPageChange={(p) => fetchSaleProperties(p, saleSearchQuery, saleStatusFilter)}
            searchQuery={saleSearchQuery}
            onSearch={setSaleSearchQuery}
            searchPlaceholder="Search sale properties by title, city, state, or seller..."
            actions={
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['all', 'Published', 'PendingReview', 'ChangesRequested', 'Draft', 'Sold', 'Withdrawn'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSaleStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      saleStatusFilter === st
                        ? 'bg-[var(--brand-primary)] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st === 'all' ? 'All Status' : st === 'PendingReview' ? 'Under Review' : st === 'ChangesRequested' ? 'Action Needed' : st}
                  </button>
                ))}
              </div>
            }
          />
        )}
      </div>

      {/* Sale Property Details Modal */}
      {selectedSaleProperty && (
        <SalePropertyDetailModal
          property={selectedSaleProperty}
          onClose={() => setSelectedSaleProperty(null)}
          onRefresh={() => fetchSaleProperties(salePagination.currentPage, saleSearchQuery, saleStatusFilter)}
        />
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading Properties...</div>}>
      <PropertiesPageContent />
    </Suspense>
  );
}
