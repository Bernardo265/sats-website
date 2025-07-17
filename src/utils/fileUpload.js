// File Upload Utilities for SafeSats CMS
export const ALLOWED_FILE_TYPES = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_DIMENSION = 2048; // Max width/height in pixels

export const validateFile = (file) => {
  const errors = [];

  // Check file type
  if (!ALLOWED_FILE_TYPES[file.type]) {
    errors.push(`File type ${file.type} is not allowed. Please use JPEG, PNG, WebP, or GIF.`);
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds the maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.substring(originalName.lastIndexOf('.'));
  return `${timestamp}_${randomString}${extension}`;
};

export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxWidth) {
        width = (width * maxWidth) / height;
        height = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

export const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.src = URL.createObjectURL(file);
  });
};

export const createImagePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

// Simulate file upload to server (in a real app, this would be an API call)
export const uploadFile = async (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        reject(new Error(validation.errors.join(', ')));
        return;
      }

      // Generate unique filename
      const fileName = generateUniqueFileName(file.name);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        
        if (onProgress) onProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Store file in localStorage for demo purposes
          // In a real app, this would upload to a server/cloud storage
          const reader = new FileReader();
          reader.onload = () => {
            const fileData = {
              id: fileName,
              name: file.name,
              originalName: file.name,
              fileName: fileName,
              size: file.size,
              type: file.type,
              url: `/uploads/${fileName}`,
              dataUrl: reader.result,
              uploadedAt: new Date().toISOString(),
              dimensions: null
            };

            // Get existing uploads
            const existingUploads = JSON.parse(localStorage.getItem('safesats_uploads') || '[]');
            existingUploads.push(fileData);
            localStorage.setItem('safesats_uploads', JSON.stringify(existingUploads));

            resolve(fileData);
          };
          reader.readAsDataURL(file);
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
};

export const getUploadedFiles = () => {
  return JSON.parse(localStorage.getItem('safesats_uploads') || '[]');
};

export const deleteUploadedFile = (fileId) => {
  const uploads = getUploadedFiles();
  const filteredUploads = uploads.filter(file => file.id !== fileId);
  localStorage.setItem('safesats_uploads', JSON.stringify(filteredUploads));
  return true;
};

export const getFileUrl = (fileName) => {
  const uploads = getUploadedFiles();
  const file = uploads.find(f => f.fileName === fileName || f.id === fileName);
  return file ? file.dataUrl : null;
};

// File type detection utilities
export const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return '🖼️';
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('video')) return '🎥';
  if (fileType.includes('audio')) return '🎵';
  return '📁';
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Image optimization utilities
export const optimizeImageForWeb = async (file) => {
  try {
    // Get original dimensions
    const dimensions = await getImageDimensions(file);
    
    // Compress if needed
    let optimizedFile = file;
    if (file.size > 1024 * 1024 || dimensions.width > 1200 || dimensions.height > 1200) {
      optimizedFile = await compressImage(file, 1200, 0.85);
    }

    return {
      original: file,
      optimized: optimizedFile,
      dimensions,
      compressionRatio: file.size / optimizedFile.size
    };
  } catch (error) {
    console.error('Error optimizing image:', error);
    return {
      original: file,
      optimized: file,
      dimensions: { width: 0, height: 0 },
      compressionRatio: 1
    };
  }
};
