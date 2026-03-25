import React, { useState, useRef } from 'react';
import { Upload, File, X, Check } from 'lucide-react';
import Button from './Button';

const FileUpload = ({
                        onUpload,
                        accept = "*/*",
                        maxSize = 10 * 1024 * 1024, // 10MB
                        multiple = false,
                        className = ''
                    }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const validateFile = (file) => {
        if (file.size > maxSize) {
            return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`;
        }
        return null;
    };

    const handleFiles = (files) => {
        const newFiles = Array.from(files).map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            error: validateFile(file),
            status: 'pending'
        }));

        if (multiple) {
            setSelectedFiles(prev => [...prev, ...newFiles]);
        } else {
            setSelectedFiles(newFiles.slice(0, 1));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (id) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== id));
    };

    const handleUpload = async () => {
        const validFiles = selectedFiles.filter(f => !f.error && f.status === 'pending');
        if (validFiles.length === 0) return;

        setUploading(true);

        try {
            for (const fileObj of validFiles) {
                await onUpload(fileObj.file);
                setSelectedFiles(prev =>
                    prev.map(f => f.id === fileObj.id ? { ...f, status: 'completed' } : f)
                );
            }
            setTimeout(() => setSelectedFiles([]), 2000);
        } catch (error) {
            setSelectedFiles(prev =>
                prev.map(f => ({ ...f, status: 'error', error: error.message }))
            );
        } finally {
            setUploading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div
                className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }
        `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept={accept}
                    multiple={multiple}
                />
                <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {accept === '*/*' ? 'Any file type' : accept.split(',').join(', ')} up to {(maxSize / 1024 / 1024).toFixed(0)}MB
                </p>
            </div>

            {selectedFiles.length > 0 && (
                <div className="space-y-2">
                    {selectedFiles.map((fileObj) => (
                        <div
                            key={fileObj.id}
                            className={`
                flex items-center justify-between p-3 rounded-lg border
                ${fileObj.error ? 'bg-red-50 border-red-200' :
                                fileObj.status === 'completed' ? 'bg-green-50 border-green-200' :
                                    'bg-gray-50 border-gray-200'}
              `}
                        >
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <File className={`w-5 h-5 flex-shrink-0 ${
                                    fileObj.error ? 'text-red-500' :
                                        fileObj.status === 'completed' ? 'text-green-500' :
                                            'text-blue-500'
                                }`} />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{fileObj.file.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(fileObj.file.size)}
                                        {fileObj.error && <span className="text-red-600 ml-2">{fileObj.error}</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                {fileObj.status === 'completed' ? (
                                    <Check className="w-5 h-5 text-green-500" />
                                ) : (
                                    <button
                                        onClick={() => removeFile(fileObj.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        disabled={uploading}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <Button
                        onClick={handleUpload}
                        isLoading={uploading}
                        disabled={!selectedFiles.some(f => !f.error && f.status === 'pending')}
                        className="w-full"
                    >
                        Upload {selectedFiles.filter(f => !f.error && f.status === 'pending').length} file(s)
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FileUpload;