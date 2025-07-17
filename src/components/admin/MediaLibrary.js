import React, { useState, useEffect } from 'react';
import { getUploadedFiles, deleteUploadedFile, formatFileSize, getFileIcon } from '../../utils/fileUpload';
import FileUpload from './FileUpload';

const MediaLibrary = ({ onSelectFile, selectedFile = null, showUpload = true }) => {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'name', 'size'
  const [filterType, setFilterType] = useState('all'); // 'all', 'images', 'documents'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    const uploadedFiles = getUploadedFiles();
    setFiles(uploadedFiles);
  };

  const handleUploadComplete = (uploadedFile) => {
    setFiles(prev => [uploadedFile, ...prev]);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    // You could show a toast notification here
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteUploadedFile(fileId);
      setFiles(prev => prev.filter(file => file.id !== fileId));
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleSelectFile = (file) => {
    if (onSelectFile) {
      onSelectFile(file);
    }
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const handleBulkDelete = () => {
    if (selectedFiles.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)) {
      selectedFiles.forEach(fileId => {
        deleteUploadedFile(fileId);
      });
      setFiles(prev => prev.filter(file => !selectedFiles.has(file.id)));
      setSelectedFiles(new Set());
    }
  };

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter(file => {
      // Filter by type
      if (filterType === 'images' && !file.type.startsWith('image/')) return false;
      if (filterType === 'documents' && file.type.startsWith('image/')) return false;
      
      // Filter by search term
      if (searchTerm && !file.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        case 'oldest':
          return new Date(a.uploadedAt) - new Date(b.uploadedAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });

  const FileGridItem = ({ file }) => (
    <div 
      className={`
        relative group bg-gray-800 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer
        ${selectedFile?.id === file.id ? 'border-green-400' : 'border-gray-700 hover:border-gray-600'}
      `}
      onClick={() => handleSelectFile(file)}
    >
      {/* Selection checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={selectedFiles.has(file.id)}
          onChange={(e) => {
            e.stopPropagation();
            toggleFileSelection(file.id);
          }}
          className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400"
        />
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteFile(file.id);
        }}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* File preview */}
      <div className="aspect-square">
        {file.type.startsWith('image/') ? (
          <img 
            src={file.dataUrl} 
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <span className="text-4xl">{getFileIcon(file.type)}</span>
          </div>
        )}
      </div>

      {/* File info */}
      <div className="p-3">
        <div className="text-white text-sm font-medium truncate" title={file.name}>
          {file.name}
        </div>
        <div className="text-gray-400 text-xs mt-1">
          {formatFileSize(file.size)}
        </div>
      </div>
    </div>
  );

  const FileListItem = ({ file }) => (
    <div 
      className={`
        flex items-center p-3 bg-gray-800 rounded-lg border transition-all duration-200 cursor-pointer
        ${selectedFile?.id === file.id ? 'border-green-400' : 'border-gray-700 hover:border-gray-600'}
      `}
      onClick={() => handleSelectFile(file)}
    >
      <input
        type="checkbox"
        checked={selectedFiles.has(file.id)}
        onChange={(e) => {
          e.stopPropagation();
          toggleFileSelection(file.id);
        }}
        className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400 mr-3"
      />

      {/* File preview */}
      <div className="w-12 h-12 mr-3 flex-shrink-0">
        {file.type.startsWith('image/') ? (
          <img 
            src={file.dataUrl} 
            alt={file.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded">
            <span className="text-xl">{getFileIcon(file.type)}</span>
          </div>
        )}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium truncate">{file.name}</div>
        <div className="text-gray-400 text-sm">
          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteFile(file.id);
        }}
        className="ml-3 text-gray-400 hover:text-red-400 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Upload section */}
      {showUpload && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Upload New Files</h3>
          <FileUpload 
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            accept="image/*"
          />
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">Media Library</h3>
          {selectedFiles.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              Delete Selected ({selectedFiles.size})
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-400"
          />

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-400"
          >
            <option value="all">All Files</option>
            <option value="images">Images</option>
            <option value="documents">Documents</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-green-400"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="size">Size (Large to Small)</option>
          </select>

          {/* View mode toggle */}
          <div className="flex border border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-green-400 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'} transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-green-400 text-black' : 'bg-gray-800 text-gray-400 hover:text-white'} transition-colors`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Files display */}
      {filteredAndSortedFiles.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div className="text-gray-400 text-lg">No files found</div>
          <div className="text-gray-500 text-sm mt-1">
            {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
          </div>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
            : 'space-y-2'
        }>
          {filteredAndSortedFiles.map(file => (
            viewMode === 'grid' 
              ? <FileGridItem key={file.id} file={file} />
              : <FileListItem key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
