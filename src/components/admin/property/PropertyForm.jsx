"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/adminApi';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';


export default function PropertyForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('Basic');

  // We'll initialize state with existing data or defaults
  const [formData, setFormData] = useState(initialData || {
    title: '',
    propertyType: 'Entire property',
    category: 'Apartment',
    description: '',
    pricePerNight: 0,
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    city: '',
    state: '',
    country: '',
    address: '',
    amenities: [],
    images: [],
    roomsAndBeds: { bedrooms: [], bathrooms: [], spaces: [] },
    houseRules: [],
    cancellationPolicy: { type: 'flexible', description: '' },
    importantInformation: [],
    nearbyPlaces: [],
    bookingSettings: { minimumNights: 1, maximumNights: 30 },
    damagePolicy: {},
    aboutProperty: { title: '', description: '' }
  });

  const tabs = [
    'Basic', 'Location', 'Pricing', 'Capacity', 'Gallery', 
    'Amenities', 'Rooms', 'Policies', 'Explore'
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        await adminApi.updateProperty(initialData.id, formData);
        alert('Property updated successfully');
      } else {
        await adminApi.createProperty(formData);
        alert('Property created successfully');
        router.push('/admin/properties');
      }
    } catch (err) {
      alert(err.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayAdd = (field, newItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem]
    }));
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => {
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleImageUpload = async (e) => {
    if (!isEdit) {
      alert('Please save the property first before uploading images.');
      return;
    }
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      const res = await adminApi.uploadPropertyImages(initialData.id, files);
      setFormData(prev => ({ ...prev, images: res.data.images }));
      alert('Images uploaded successfully');
    } catch (err) {
      alert(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    setUploading(true);
    try {
      const res = await adminApi.deletePropertyImage(initialData.id, imageId);
      setFormData(prev => ({ ...prev, images: res.data.images }));
    } catch (err) {
      alert(err.message || 'Failed to delete image');
    } finally {
      setUploading(false);
    }
  };

  const handleSetFeaturedImage = async (imageId) => {
    setUploading(true);
    try {
      const res = await adminApi.setFeaturedImage(initialData.id, imageId);
      // The API might not return the fully populated images array or we just update the featuredImage URL
      // Actually, setFeaturedImage controller returns the full property. Let's update it.
      setFormData(prev => ({ ...prev, images: res.data.images, featuredImage: res.data.featuredImage }));
    } catch (err) {
      alert(err.message || 'Failed to set featured image');
    } finally {
      setUploading(false);
    }
  };

  const handleNestedArrayAdd = (parentField, nestedField, index, newItem) => {
    setFormData(prev => {
      const parent = { ...prev[parentField] };
      const arr = [...(parent[nestedField] || [])];
      arr[index] = { ...arr[index], [newItem.field]: [...(arr[index][newItem.field] || []), newItem.value] };
      parent[nestedField] = arr;
      return { ...prev, [parentField]: parent };
    });
  };

  const handleNestedArrayRemove = (parentField, nestedField, parentIndex, childField, childIndex) => {
    setFormData(prev => {
      const parent = { ...prev[parentField] };
      const arr = [...(parent[nestedField] || [])];
      const childArr = [...arr[parentIndex][childField]];
      childArr.splice(childIndex, 1);
      arr[parentIndex] = { ...arr[parentIndex], [childField]: childArr };
      parent[nestedField] = arr;
      return { ...prev, [parentField]: parent };
    });
  };

  const handleRoomsAndBedsAdd = (field, newItem) => {
    setFormData(prev => ({
      ...prev,
      roomsAndBeds: {
        ...prev.roomsAndBeds,
        [field]: [...(prev.roomsAndBeds?.[field] || []), newItem]
      }
    }));
  };

  const handleRoomsAndBedsRemove = (field, index) => {
    setFormData(prev => {
      const arr = [...(prev.roomsAndBeds?.[field] || [])];
      arr.splice(index, 1);
      return {
        ...prev,
        roomsAndBeds: {
          ...prev.roomsAndBeds,
          [field]: arr
        }
      };
    });
  };


  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Property' : 'Create Property'}
          </h2>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Property'}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
          <nav className="p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {activeTab === 'Basic' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Beautiful Apartment in Paris"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <input 
                      type="text" 
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="e.g. Entire property, Private room"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Cabin">Cabin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {activeTab === 'Pricing' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Pricing & Fees</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night (₹)</label>
                    <input 
                      type="number" 
                      value={formData.pricePerNight}
                      onChange={(e) => setFormData({...formData, pricePerNight: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional tabs will be built out to support dynamic fields */}
            {activeTab === 'Amenities' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
                  <button 
                    onClick={() => handleArrayAdd('amenities', { name: '', icon: 'check', available: true })}
                    className="text-primary text-sm font-medium flex items-center hover:underline"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Amenity
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.amenities.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => {
                          const newArr = [...formData.amenities];
                          newArr[i].name = e.target.value;
                          setFormData({...formData, amenities: newArr});
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                        placeholder="Amenity name (e.g. Wifi)"
                      />
                      <button onClick={() => handleArrayRemove('amenities', i)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.amenities.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No amenities added.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Location' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Capacity' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Capacity</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                    <input type="number" value={formData.maxGuests} onChange={(e) => setFormData({...formData, maxGuests: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                    <input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                    <input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Policies' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">House Rules</h3>
                    <button onClick={() => handleArrayAdd('houseRules', '')} className="text-primary text-sm font-medium flex items-center hover:underline"><Plus className="w-4 h-4 mr-1" /> Add Rule</button>
                  </div>
                  <div className="space-y-2">
                    {formData.houseRules.map((rule, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={rule} onChange={(e) => {
                          const newArr = [...formData.houseRules];
                          newArr[i] = e.target.value;
                          setFormData({...formData, houseRules: newArr});
                        }} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                        <button onClick={() => handleArrayRemove('houseRules', i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Important Information</h3>
                    <button onClick={() => handleArrayAdd('importantInformation', '')} className="text-primary text-sm font-medium flex items-center hover:underline"><Plus className="w-4 h-4 mr-1" /> Add Info</button>
                  </div>
                  <div className="space-y-2">
                    {formData.importantInformation.map((info, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={info} onChange={(e) => {
                          const newArr = [...formData.importantInformation];
                          newArr[i] = e.target.value;
                          setFormData({...formData, importantInformation: newArr});
                        }} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                        <button onClick={() => handleArrayRemove('importantInformation', i)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Explore' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Nearby Places</h3>
                  <button onClick={() => handleArrayAdd('nearbyPlaces', { name: '', distance: '' })} className="text-primary text-sm font-medium flex items-center hover:underline"><Plus className="w-4 h-4 mr-1" /> Add Place</button>
                </div>
                <div className="space-y-2">
                  {formData.nearbyPlaces?.map((place, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" placeholder="Place Name" value={place.name} onChange={(e) => {
                        const newArr = [...(formData.nearbyPlaces || [])];
                        newArr[i].name = e.target.value;
                        setFormData({...formData, nearbyPlaces: newArr});
                      }} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      <input type="text" placeholder="Distance (e.g. 5 min walk)" value={place.distance} onChange={(e) => {
                        const newArr = [...(formData.nearbyPlaces || [])];
                        newArr[i].distance = e.target.value;
                        setFormData({...formData, nearbyPlaces: newArr});
                      }} className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" />
                      <button onClick={() => handleArrayRemove('nearbyPlaces', i)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'Rooms' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-8">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Rooms & Beds</h3>
                </div>

                {/* Bedrooms */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">Bedrooms</h4>
                    <button 
                      onClick={() => handleRoomsAndBedsAdd('bedrooms', { name: `Bedroom ${(formData.roomsAndBeds?.bedrooms?.length || 0) + 1}`, beds: [] })}
                      className="text-primary text-sm font-medium flex items-center hover:underline"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Bedroom
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.roomsAndBeds?.bedrooms?.map((room, i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                        <div className="flex gap-3 items-center">
                          <input 
                            type="text" 
                            value={room.name}
                            onChange={(e) => {
                              const newArr = [...formData.roomsAndBeds.bedrooms];
                              newArr[i].name = e.target.value;
                              setFormData({...formData, roomsAndBeds: {...formData.roomsAndBeds, bedrooms: newArr}});
                            }}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none"
                            placeholder="Room name (e.g. Master Bedroom)"
                          />
                          <button onClick={() => handleRoomsAndBedsRemove('bedrooms', i)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Beds in this room</span>
                            <button 
                              onClick={() => {
                                const bedName = prompt('Enter bed type (e.g. 1 King bed, 2 Single beds):');
                                if (bedName) handleNestedArrayAdd('roomsAndBeds', 'bedrooms', i, { field: 'beds', value: bedName });
                              }}
                              className="text-primary text-xs hover:underline"
                            >
                              + Add Bed
                            </button>
                          </div>
                          {room.beds?.map((bed, bedIdx) => (
                            <div key={bedIdx} className="flex gap-2 items-center">
                              <span className="text-sm bg-white px-2 py-1 rounded border border-gray-200 flex-1">{bed}</span>
                              <button onClick={() => handleNestedArrayRemove('roomsAndBeds', 'bedrooms', i, 'beds', bedIdx)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {(!formData.roomsAndBeds?.bedrooms || formData.roomsAndBeds.bedrooms.length === 0) && (
                      <p className="text-sm text-gray-500 italic">No bedrooms added.</p>
                    )}
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">Bathrooms</h4>
                    <button 
                      onClick={() => handleRoomsAndBedsAdd('bathrooms', { name: `Bathroom ${(formData.roomsAndBeds?.bathrooms?.length || 0) + 1}`, amenities: [] })}
                      className="text-primary text-sm font-medium flex items-center hover:underline"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Bathroom
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.roomsAndBeds?.bathrooms?.map((bath, i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3">
                        <div className="flex gap-3 items-center">
                          <input 
                            type="text" 
                            value={bath.name}
                            onChange={(e) => {
                              const newArr = [...formData.roomsAndBeds.bathrooms];
                              newArr[i].name = e.target.value;
                              setFormData({...formData, roomsAndBeds: {...formData.roomsAndBeds, bathrooms: newArr}});
                            }}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none"
                            placeholder="Bathroom name (e.g. Master Bathroom)"
                          />
                          <button onClick={() => handleRoomsAndBedsRemove('bathrooms', i)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Amenities in this bathroom</span>
                            <button 
                              onClick={() => {
                                const amName = prompt('Enter amenity (e.g. Shower, Tub, Toilet):');
                                if (amName) handleNestedArrayAdd('roomsAndBeds', 'bathrooms', i, { field: 'amenities', value: amName });
                              }}
                              className="text-primary text-xs hover:underline"
                            >
                              + Add Amenity
                            </button>
                          </div>
                          {bath.amenities?.map((am, amIdx) => (
                            <div key={amIdx} className="flex gap-2 items-center">
                              <span className="text-sm bg-white px-2 py-1 rounded border border-gray-200 flex-1">{am}</span>
                              <button onClick={() => handleNestedArrayRemove('roomsAndBeds', 'bathrooms', i, 'amenities', amIdx)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {(!formData.roomsAndBeds?.bathrooms || formData.roomsAndBeds.bathrooms.length === 0) && (
                      <p className="text-sm text-gray-500 italic">No bathrooms added.</p>
                    )}
                  </div>
                </div>

                {/* Spaces */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-800">Spaces</h4>
                    <button 
                      onClick={() => {
                        const spaceName = prompt('Enter space name (e.g. Kitchen, Living Room):');
                        if (spaceName) handleRoomsAndBedsAdd('spaces', spaceName);
                      }}
                      className="text-primary text-sm font-medium flex items-center hover:underline"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Space
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.roomsAndBeds?.spaces?.map((space, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <input 
                          type="text" 
                          value={space}
                          onChange={(e) => {
                            const newArr = [...formData.roomsAndBeds.spaces];
                            newArr[i] = e.target.value;
                            setFormData({...formData, roomsAndBeds: {...formData.roomsAndBeds, spaces: newArr}});
                          }}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none"
                        />
                        <button onClick={() => handleRoomsAndBedsRemove('spaces', i)} className="text-red-500 hover:text-red-700 p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!formData.roomsAndBeds?.spaces || formData.roomsAndBeds.spaces.length === 0) && (
                      <p className="text-sm text-gray-500 italic">No spaces added.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'Gallery' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
                  {isEdit && (
                    <div className="relative overflow-hidden">
                      <button 
                        disabled={uploading}
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {uploading ? 'Uploading...' : 'Upload Images'}
                      </button>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {!isEdit ? (
                  <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md text-sm">
                    Please save the basic property details first to unlock the image gallery.
                  </div>
                ) : (
                  <div>
                    {(!formData.images || formData.images.length === 0) ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500 text-sm">No images uploaded yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.images.map((img) => (
                          <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                            <img src={img.url} alt="Property" className="w-full h-full object-cover" />
                            
                            {formData.featuredImage === img.url && (
                              <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                                FEATURED
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2">
                              {formData.featuredImage !== img.url && (
                                <button 
                                  onClick={() => handleSetFeaturedImage(img.id)}
                                  className="text-xs font-medium text-white bg-gray-800/80 px-3 py-1.5 rounded hover:bg-gray-700 transition-colors"
                                >
                                  Make Featured
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteImage(img.id)}
                                className="p-2 text-white bg-red-600/90 rounded-full hover:bg-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
