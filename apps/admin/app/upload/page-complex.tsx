'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@neet/ui/button';
import { validateFiles, validateFileHeader, getSecurityConfig, type FileValidationResult } from '../../lib/utils/file-validation';

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: {
    questionsFound: number;
    processingTime: number;
    confidence: number;
  };
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = async (newFiles: File[]) => {
    // Clear previous validation messages
    setValidationErrors([]);
    setValidationWarnings([]);

    // Get security configuration
    const securityConfig = getSecurityConfig();

    // Validate files
    const validation = validateFiles(newFiles, securityConfig);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    if (validation.warnings.length > 0) {
      setValidationWarnings(validation.warnings);
    }

    // Additional header validation for PDF files
    const validFiles: File[] = [];
    for (const file of newFiles) {
      if (file.type === 'application/pdf') {
        const isValidHeader = await validateFileHeader(file);
        if (!isValidHeader) {
          setValidationErrors(prev => [...prev, `File "${file.name}" appears to be corrupted or is not a valid PDF`]);
          continue;
        }
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    const uploadFiles: UploadFile[] = validFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...uploadFiles]);

    // Clear validation messages after successful upload
    if (validFiles.length === newFiles.length) {
      setValidationErrors([]);
      setValidationWarnings([]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const processFile = async (fileId: string) => {
    setFiles(prev => prev.map(f =>
      f.id === fileId ? { ...f, status: 'uploading' as const, progress: 10 } : f
    ));

    // Simulate upload progress
    for (let progress = 10; progress <= 50; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, progress } : f
      ));
    }

    // Switch to processing
    setFiles(prev => prev.map(f =>
      f.id === fileId ? { ...f, status: 'processing' as const, progress: 60 } : f
    ));

    // Simulate OCR processing
    for (let progress = 60; progress <= 90; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setFiles(prev => prev.map(f =>
        f.id === fileId ? { ...f, progress } : f
      ));
    }

    // Complete processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFiles(prev => prev.map(f =>
      f.id === fileId ? {
        ...f,
        status: 'completed' as const,
        progress: 100,
        result: {
          questionsFound: Math.floor(Math.random() * 150) + 50,
          processingTime: Math.floor(Math.random() * 30) + 10,
          confidence: Math.floor(Math.random() * 30) + 70,
        }
      } : f
    ));
  };

  const processAllFiles = () => {
    files
      .filter(f => f.status === 'pending')
      .forEach(f => processFile(f.id));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearAll = () => {
    setFiles([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  ← Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Upload NEET PDFs
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {files.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                  >
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={processAllFiles}
                    disabled={!files.some(f => f.status === 'pending')}
                  >
                    Process All
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Validation Messages */}
        {(validationErrors.length > 0 || validationWarnings.length > 0) && (
          <div className="mb-6 space-y-4">
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">File Validation Errors</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc list-inside space-y-1">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {validationWarnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">File Validation Warnings</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        {validationWarnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  Drop NEET PDF files here
                </p>
                <p className="text-gray-600 mb-4">
                  or click to browse your computer
                </p>
                <p className="text-sm text-gray-500">
                  Supports multiple PDF files up to 50MB each
                </p>
              </div>

              <Button variant="outline">
                Browse Files
              </Button>
            </div>
          </div>
        </div>

        {/* Processing Options */}
        {files.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useOCR"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="useOCR" className="ml-2 text-sm text-gray-700">
                  Enable OCR fallback
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="skipInstructions"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="skipInstructions" className="ml-2 text-sm text-gray-700">
                  Skip instruction pages
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="strictNEET"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="strictNEET" className="ml-2 text-sm text-gray-700">
                  Strict NEET format validation
                </label>
              </div>
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Files ({files.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {files.map((file) => (
                <div key={file.id} className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {file.file.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {file.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => processFile(file.id)}
                        >
                          Process
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>
                          {file.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                        </span>
                        <span>{file.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center">
                    {file.status === 'pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Pending
                      </span>
                    )}

                    {file.status === 'completed' && file.result && (
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                        <span className="text-sm text-gray-600">
                          {file.result.questionsFound} questions found
                        </span>
                        <span className="text-sm text-gray-600">
                          {file.result.confidence}% confidence
                        </span>
                        <span className="text-sm text-gray-600">
                          {file.result.processingTime}s
                        </span>
                      </div>
                    )}

                    {file.status === 'error' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Error: {file.error}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {files.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No files uploaded yet</p>
            <p className="text-sm text-gray-400">
              Upload NEET PDF files to extract questions using our advanced OCR system
            </p>
          </div>
        )}
      </div>
    </div>
  );
}