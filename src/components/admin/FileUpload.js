import React, { useState, useRef, useCallback } from 'react';
import { uploadFile, validateFile, createImagePreview, formatFileSize, optimizeImageForWeb } from '../../utils/fileUpload';

const FileUpload = ({ onUploadComplete, onUploadError, accept = "image/*", multiple = false, className = "" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFiles(files);
    }
  }, []);

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await handleFiles(files);
    }
  }, []);

  const handleFiles = async (files) => {
    const file = files[0]; // Handle single file for now
    
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const previewUrl = await createImagePreview(file);
        setPreview({
          url: previewUrl,
          name: file.name,
          size: file.size,
          type: file.type
        });
      }

      // Optimize image if needed
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        const optimized = await optimizeImageForWeb(file);
        fileToUpload = optimized.optimized;
        
        if (optimized.compressionRatio > 1.2) {
          console.log(`Image compressed by ${(optimized.compressionRatio * 100).toFixed(1)}%`);
        }
      }

      // Upload file
      const uploadedFile = await uploadFile(fileToUpload, (progress) => {
        setUploadProgress(progress);
      });

      // Success callback
      if (onUploadComplete) {
        onUploadComplete(uploadedFile);
      }

      // Reset state
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
      setPreview(null);
      
      if (onUploadError) {
        onUploadError(error.message);
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragOver 
            ? 'border-green-400 bg-green-400/10' 
            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
      >
        {isUploading ? (
          <div className="space-y-4">
            {preview && (
              <div className="flex justify-center">
                <img 
                  src={preview.url} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="space-y-2">
              <div className="text-white font-medium">Uploading...</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-400">{Math.round(uploadProgress)}%</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="space-y-2">
              <div className="text-white font-medium">
                Drop files here or click to browse
              </div>
              <div className="text-sm text-gray-400">
                Supports JPEG, PNG, WebP, GIF up to 5MB
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && !isUploading && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-4">
            <img 
              src={preview.url} 
              alt="Preview" 
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="text-white font-medium truncate">{preview.name}</div>
              <div className="text-sm text-gray-400">
                {formatFileSize(preview.size)} • {preview.type}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
