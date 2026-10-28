'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FolderOpen,
  Check,
  Loader2,
  X,
  RefreshCw,
  Search,
  Link2,
} from 'lucide-react';
import { MediaAssetItem } from '@/types/admin';

interface ImageUploadPickerProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  category?: MediaAssetItem['category'];
  defaultTitle?: string;
  mediaLibrary?: MediaAssetItem[];
  onMediaUploaded?: (
    asset: MediaAssetItem,
    updatedMediaList: MediaAssetItem[]
  ) => void;
  previewHeightClass?: string;
  objectPositionClass?: string;
  helperText?: string;
}

export function ImageUploadPicker({
  label,
  value,
  onChange,
  category = 'Hero & Office',
  defaultTitle = '',
  mediaLibrary = [],
  onMediaUploaded,
  previewHeightClass = 'h-44',
  objectPositionClass = 'object-center',
  helperText,
}: ImageUploadPickerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [showLibraryPicker, setShowLibraryPicker] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadError('');
    setUploadStatus('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'title',
        defaultTitle || file.name.replace(/\.[^/.]+$/, '')
      );
      formData.append('category', category);
      formData.append(
        'altText',
        defaultTitle || file.name.replace(/\.[^/.]+$/, '')
      );

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data?.asset?.url) {
        setUploadError(data?.error || 'Failed to upload image.');
        setIsUploading(false);
        return;
      }

      onChange(data.asset.url);
      if (onMediaUploaded && Array.isArray(data.media)) {
        onMediaUploaded(data.asset, data.media);
      }
      setUploadStatus('Photo uploaded from computer');
      setTimeout(() => setUploadStatus(''), 3500);
    } catch {
      setUploadError('Network error while uploading image.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    } else if (file) {
      setUploadError('Please drop a valid image file (JPG, PNG, WEBP, SVG).');
    }
  };

  const filteredMedia = mediaLibrary.filter((item) => {
    if (item.category === 'Document' && !item.url.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)) {
      return false;
    }
    if (!librarySearch.trim()) return true;
    const q = librarySearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.fileName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#0B0E29] transition-colors"
          >
            <Link2 className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL' : 'Edit URL'}</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Preview + Drag & Drop Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative w-full ${previewHeightClass} rounded-2xl overflow-hidden border-2 transition-all ${
          isDragging
            ? 'border-[#F7941D] bg-amber-50/40'
            : 'border-slate-200 bg-slate-900'
        } group`}
      >
        {value ? (
          <>
            <img
              src={value}
              alt={defaultTitle || label}
              className={`w-full h-full object-cover ${objectPositionClass} transition-transform duration-300 group-hover:scale-[1.02]`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  '/images/hero/lijemrakel-about-final.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <ImageIcon className="w-9 h-9 mb-2 text-slate-500" />
            <p className="text-xs font-semibold text-slate-300">
              No image selected
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Upload a photo from your computer or choose from Media Library
            </p>
          </div>
        )}

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-[#0B0E29]/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20">
            <Loader2 className="w-7 h-7 text-[#F7941D] animate-spin" />
            <span className="text-xs font-bold text-white">
              Uploading photo from your computer...
            </span>
          </div>
        )}

        {/* Action Buttons Bar at Bottom of Image Preview */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F7941D] hover:bg-[#e58512] text-[#0B0E29] text-xs font-bold shadow-md transition-all"
            >
              {value ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace from Computer</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Computer</span>
                </>
              )}
            </button>

            {mediaLibrary.length > 0 && (
              <button
                type="button"
                onClick={() => setShowLibraryPicker((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/95 hover:bg-white text-[#0B0E29] text-xs font-bold shadow-md transition-all"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#F7941D]" />
                <span>
                  {showLibraryPicker ? 'Close Library' : 'Media Library'}
                </span>
              </button>
            )}
          </div>

          {value && (
            <span className="hidden sm:inline-block max-w-[180px] truncate px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-xs text-[10px] font-mono text-white/85">
              {value.startsWith('data:')
                ? 'Uploaded Image Data'
                : value.split('/').pop()}
            </span>
          )}
        </div>
      </div>

      {/* Helper Text & Status Feedback */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {helperText && (
          <p className="text-[11px] text-slate-500">{helperText}</p>
        )}
        {uploadStatus && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            {uploadStatus}
          </span>
        )}
        {uploadError && (
          <span className="text-xs font-bold text-red-600">{uploadError}</span>
        )}
      </div>

      {/* Optional Direct URL Input */}
      {showUrlInput && (
        <div className="pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/your-image.jpg or https://..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono text-[#0B0E29] focus:outline-none focus:border-[#0B0E29]"
          />
        </div>
      )}

      {/* Expandable Media Library Thumbnail Picker */}
      {showLibraryPicker && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search uploaded photos in Media Library..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-[#0B0E29] focus:outline-none focus:border-[#0B0E29]"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowLibraryPicker(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto pr-1">
            {filteredMedia.map((item) => {
              const isSelected = value === item.url;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.url);
                    setShowLibraryPicker(false);
                    setUploadStatus(`Selected "${item.title}"`);
                    setTimeout(() => setUploadStatus(''), 2500);
                  }}
                  className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all ${
                    isSelected
                      ? 'border-[#F7941D] ring-2 ring-[#F7941D]/30'
                      : 'border-white hover:border-slate-300'
                  }`}
                >
                  <div className="h-20 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-1.5 bg-white">
                    <p className="text-[10px] font-bold text-[#0B0E29] truncate">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">
                      {item.category}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#F7941D] text-[#0B0E29] flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

