import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Star,
  Plus,
  Loader2,
  AlertCircle,
  ExternalLink,
  Check
} from 'lucide-react';
import { productService } from '../../../services/productService';

export const MediaGallerySection = ({
  images = [],
  onChangeImages,
  error
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [directUrl, setDirectUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setUploadError(`File ${file.name} is not a valid image.`);
        continue;
      }

      try {
        const uploadResult = await productService.uploadImage(file);
        if (uploadResult?.url) {
          const isFirstImage = newImages.length === 0;
          newImages.push({
            url: uploadResult.url,
            publicId: uploadResult.publicId || '',
            isPrimary: isFirstImage
          });
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        setUploadError(err.response?.data?.message || err.message || 'Image upload failed.');
      }
    }

    onChangeImages(newImages);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddDirectUrl = () => {
    const trimmed = directUrl.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
    } catch {
      setUploadError('Please enter a valid HTTP or HTTPS image URL.');
      return;
    }

    const isFirstImage = images.length === 0;
    const newImages = [
      ...images,
      {
        url: trimmed,
        publicId: `direct_url_${Date.now()}`,
        isPrimary: isFirstImage
      }
    ];

    onChangeImages(newImages);
    setDirectUrl('');
    setUploadError(null);
  };

  const handleSetPrimary = (index) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    onChangeImages(updated);
  };

  const handleRemoveImage = async (index) => {
    const target = images[index];
    const updated = images.filter((_, i) => i !== index);

    // If removed image was primary and others exist, make the first one primary
    if (target.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    onChangeImages(updated);

    // Clean up on backend if it had a cloudinary publicId
    if (target.publicId && !target.publicId.startsWith('direct_url_') && !target.publicId.startsWith('mock_')) {
      try {
        await productService.deleteImage(target.publicId);
      } catch (e) {
        console.warn('Backend image deletion failed:', e);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="bg-white border-2 border-[#171717] shadow-[3px_3px_0px_#171717] p-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-[#171717] pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#171717] text-white flex items-center justify-center font-mono font-bold text-xs">
            02
          </div>
          <h2 className="font-mono font-bold text-sm tracking-wider uppercase text-[#171717]">
            Media & Packaging Assets // Cloudinary CDN
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FAF8F5] border border-[#171717]">
          {images.length} {images.length === 1 ? 'ASSET LOADED' : 'ASSETS LOADED'}
        </span>
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border-2 border-[#FF5638] text-xs font-mono text-[#FF5638] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle size={14} /> {uploadError}
          </span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-xs font-bold hover:underline"
          >
            DISMISS
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-[#FF5638] text-xs font-mono text-[#FF5638] flex items-center gap-1.5">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {/* Upload Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed ${
          isDragOver
            ? 'border-[#315FE8] bg-[#DCE5FF]/30'
            : 'border-[#171717] bg-[#FAF8F5] hover:bg-white'
        } p-6 text-center transition-all cursor-pointer`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-[#315FE8]">
              <Loader2 size={32} className="animate-spin" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Uploading Asset to Cloudinary CDN...
              </span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-[#171717] text-white flex items-center justify-center border border-[#171717] shadow-[2px_2px_0px_#315FE8]">
                <UploadCloud size={24} />
              </div>
              <div>
                <p className="text-xs font-mono font-bold uppercase text-[#171717]">
                  Drag & Drop Product Images Here, or <span className="text-[#315FE8] underline">Browse Files</span>
                </p>
                <p className="text-[10px] font-mono text-gray-500 mt-1">
                  Supports JPG, PNG, WEBP • Max 10MB per file • Direct Cloudinary optimization
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Direct Image URL input */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <label className="block text-[10px] font-mono font-bold uppercase text-gray-600 mb-1">
          Or Attach Image via Direct Web URL (Unsplash, CDN or Supplier Asset)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDirectUrl())}
            placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
            className="flex-1 bg-[#FAF8F5] border-2 border-[#171717] px-3 py-1.5 text-xs font-mono text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#315FE8] focus:bg-white"
          />
          <button
            type="button"
            onClick={handleAddDirectUrl}
            className="px-3 py-1.5 bg-[#171717] hover:bg-[#315FE8] text-white text-xs font-mono font-bold uppercase flex items-center gap-1 border-2 border-[#171717] transition-colors"
          >
            <Plus size={12} /> Add URL
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase text-gray-600">
              Attached Product Gallery ({images.length} images)
            </span>
            <span className="text-[10px] font-mono text-gray-500">
              Click star to designate storefront primary hero image
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative group bg-[#FAF8F5] border-2 ${
                  img.isPrimary
                    ? 'border-[#315FE8] ring-2 ring-[#315FE8]/30 shadow-[2px_2px_0px_#315FE8]'
                    : 'border-[#171717]'
                } p-1.5 flex flex-col justify-between`}
              >
                {/* Image Container */}
                <div className="aspect-square w-full bg-white border border-gray-200 overflow-hidden relative flex items-center justify-center">
                  <img
                    src={img.url}
                    alt={`Product Asset ${idx + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  {/* Primary Badge */}
                  {img.isPrimary && (
                    <div className="absolute top-1 left-1 bg-[#315FE8] text-white text-[9px] font-mono font-bold px-1.5 py-0.5 border border-[#171717] flex items-center gap-1">
                      <Star size={9} fill="currentColor" /> HERO
                    </div>
                  )}

                  {/* Order Index */}
                  <div className="absolute bottom-1 right-1 bg-[#171717]/80 text-white text-[9px] font-mono px-1">
                    #{idx + 1}
                  </div>
                </div>

                {/* Card Controls */}
                <div className="mt-2 flex items-center justify-between gap-1 pt-1 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    disabled={img.isPrimary}
                    className={`flex-1 text-[10px] font-mono font-bold py-1 px-1 text-center uppercase border transition-colors ${
                      img.isPrimary
                        ? 'bg-[#DCE5FF] text-[#315FE8] border-[#315FE8]'
                        : 'bg-white hover:bg-gray-100 text-[#171717] border-gray-300'
                    }`}
                  >
                    {img.isPrimary ? 'PRIMARY' : 'SET HERO'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Delete Image"
                    className="p-1 text-gray-500 hover:text-[#FF5638] hover:bg-red-50 border border-gray-300 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-[#FAF8F5] border border-dashed border-gray-300 text-center">
          <ImageIcon className="mx-auto text-gray-400 mb-1" size={24} />
          <p className="text-xs font-mono text-gray-500 uppercase">
            No gallery images attached yet. Add at least one image for storefront display.
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaGallerySection;
