'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@neet/ui/button';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);

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
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              multiple
              accept=".pdf"
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

        {/* Empty State */}
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No files uploaded yet</p>
          <p className="text-sm text-gray-400">
            Upload NEET PDF files to extract questions using our advanced OCR system
          </p>
        </div>
      </div>
    </div>
  );
}