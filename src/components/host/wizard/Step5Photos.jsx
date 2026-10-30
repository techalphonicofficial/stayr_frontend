"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { propertyApi } from "@/lib/api";

export default function Step5Photos({
  draftId,
  images = [],
  featuredImage,
  onImagesChange,
  onFeaturedChange,
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError("");

    const filesArray = Array.from(fileList);

    // Validate limit
    if (images.length + filesArray.length > 15) {
      setUploadError(`Maximum 15 photos allowed. You currently have ${images.length}.`);
      return;
    }

    // Validate types
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const invalidFiles = filesArray.filter((f) => !validTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      setUploadError("Please upload standard image files (JPG, PNG, WebP).");
      return;
    }

    // Validate size (max 8MB per image)
    const oversized = filesArray.filter((f) => f.size > 8 * 1024 * 1024);
    if (oversized.length > 0) {
      setUploadError("Each photo must be smaller than 8MB.");
      return;
    }

    if (!draftId) {
      setUploadError("Please save initial draft before uploading photos.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      filesArray.forEach((file) => {
        formData.append("images", file);
      });

      const res = await propertyApi.uploadPropertyImages(draftId, formData);
      if (res && res.data) {
        const newImages = res.data.images || [];
        onImagesChange(newImages);
        if (res.data.featuredImage) {
          onFeaturedChange(res.data.featuredImage);
        } else if (newImages.length > 0 && !featuredImage) {
          onFeaturedChange(newImages[0].url);
        }
      }
    } catch (err) {
      setUploadError(err.message || "Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!draftId) return;
    try {
      const res = await propertyApi.deletePropertyImage(draftId, imageId);
      if (res && res.data) {
        onImagesChange(res.data.images || []);
        onFeaturedChange(res.data.featuredImage || null);
      }
    } catch (err) {
      setUploadError(err.message || "Failed to delete image.");
    }
  };

  const handleSetFeatured = async (image) => {
    if (!draftId) return;
    try {
      const res = await propertyApi.setFeaturedImage(draftId, image.id);
      if (res && res.data) {
        onFeaturedChange(res.data.featuredImage || image.url);
      }
    } catch (err) {
      setUploadError(err.message || "Failed to set cover photo.");
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const reordered = [...images];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    onImagesChange(reordered);

    // Persist reorder to backend
    if (draftId) {
      try {
        const imageIds = reordered.map((img) => img.id);
        await propertyApi.reorderPropertyImages(draftId, imageIds);
      } catch (err) {
        console.error("Failed to persist image order", err);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Heading */}
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#FF385C] mb-3">
          <Camera className="w-3.5 h-3.5" />
          Step 5: Property Photos
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Add photos of your place
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Upload at least 1 photo to get started. Great photos of bedrooms, living spaces, and exterior views dramatically increase bookings.
        </p>
      </div>

      {uploadError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
          <div className="flex-1">{uploadError}</div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
          isDragging
            ? "border-[#FF385C] bg-red-50/40"
            : "border-gray-300 hover:border-[#FF385C] bg-white hover:bg-gray-50/50"
        } ${isUploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-full bg-red-50 text-[#FF385C] flex items-center justify-center mb-4 shadow-sm">
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {isUploading ? "Uploading photos to Cloudinary..." : "Drag your photos here"}
        </h3>
        <p className="text-sm text-gray-500 mb-4 max-w-sm">
          Choose at least 1 photo of your property. Supported formats: JPG, PNG, WebP (up to 8MB each).
        </p>

        <button
          type="button"
          disabled={isUploading}
          className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-bold shadow transition cursor-pointer"
        >
          Browse Files
        </button>
      </div>

      {/* Uploaded Photos Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#FF385C]" />
              Uploaded Photos ({images.length})
            </h3>
            <span className="text-xs text-gray-500">
              Drag or use arrows to reorder • Star to set cover photo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => {
              const isCover =
                featuredImage === img.url || (!featuredImage && idx === 0);

              return (
                <div
                  key={img.id || img.url}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 bg-gray-100 group shadow-sm transition ${
                    isCover ? "border-[#FF385C] ring-2 ring-[#FF385C]/20" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Property photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* Cover Badge */}
                  {isCover && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FF385C] text-white text-xs font-bold shadow-md flex items-center gap-1 z-10">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Cover Photo</span>
                    </div>
                  )}

                  {/* Photo Actions Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 z-20">
                    <div className="flex justify-end gap-1.5">
                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(img.id);
                        }}
                        className="p-2 rounded-full bg-white/90 hover:bg-red-500 text-gray-700 hover:text-white transition shadow cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Set as Cover */}
                      {!isCover ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetFeatured(img);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-900 text-xs font-bold shadow transition flex items-center gap-1 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Make Cover</span>
                        </button>
                      ) : (
                        <span className="text-white text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          Featured
                        </span>
                      )}

                      {/* Reorder Arrows */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(idx, -1);
                          }}
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed shadow cursor-pointer"
                          title="Move left"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(idx, 1);
                          }}
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed shadow cursor-pointer"
                          title="Move right"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Photo Tips Card */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-sm text-gray-600 space-y-2">
        <h4 className="font-bold text-gray-900">Photography Tips for Higher Bookings:</h4>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>Take photos during daytime in natural daylight.</li>
          <li>Capture clean, clutter-free spaces from wide angles.</li>
          <li>Include at least 1 exterior photo and photos of every bedroom & bathroom.</li>
          <li>Set your best photo showing your main living area or views as the cover.</li>
        </ul>
      </div>
    </div>
  );
}
