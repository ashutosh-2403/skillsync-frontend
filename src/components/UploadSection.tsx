// src/components/UploadSection.tsx
import React, { useState, useCallback } from 'react';
import { Upload, Link, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import axios from '../utils/axios'; // Use your configured axios instance

interface UploadSectionProps {
  onUploadSuccess: (profile: any) => void; // ✅ Accept profile parameter
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState<'resume' | 'linkedin'>('resume');
  const [isProcessing, setIsProcessing] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (
      !file.type.includes('pdf') &&
      !file.type.includes('msword') &&
      !file.type.includes('wordprocessingml')
    ) {
      setUploadStatus('error');
      console.error('❌ Unsupported file type');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('processing');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post('/analysis/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('success');
      // ✅ Pass the profile data from response
      setTimeout(() => onUploadSuccess(response.data.profile), 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLinkedInAnalysis = async () => {
    if (!linkedinUrl.includes('linkedin.com')) {
      setUploadStatus('error');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('processing');

    try {
      const response = await axios.post('/analysis/linkedin', { url: linkedinUrl });
      setUploadStatus('success');
      // ✅ Pass the profile data from response
      setTimeout(() => onUploadSuccess(response.data.profile), 1000);
    } catch (error) {
      console.error('LinkedIn upload failed:', error);
      setUploadStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-16 p-6 border border-dashed border-neutral-300 rounded-lg bg-white text-center shadow-md">
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-lg ${uploadType === 'resume' ? 'bg-primary-600 text-white' : 'bg-neutral-100'}`}
          onClick={() => setUploadType('resume')}
        >
          Resume
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${uploadType === 'linkedin' ? 'bg-primary-600 text-white' : 'bg-neutral-100'}`}
          onClick={() => setUploadType('linkedin')}
        >
          LinkedIn URL
        </button>
      </div>

      {uploadType === 'resume' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`p-8 border-2 border-dashed rounded-lg transition-colors ${
            dragActive ? 'border-primary-600 bg-primary-50' : 'border-neutral-300'
          }`}
        >
          <Upload className="mx-auto mb-4 w-10 h-10 text-primary-600" />
          <p className="text-sm text-neutral-600 mb-2">Drag and drop your resume PDF or DOC here</p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            id="fileUpload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <label htmlFor="fileUpload" className="cursor-pointer text-primary-600 hover:underline">
            Or click to browse
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <div className="px-3 bg-primary-100 text-primary-600">
              <Link className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="flex-1 px-4 py-2 outline-none"
              placeholder="Enter LinkedIn Profile URL"
            />
          </div>
          <button
            onClick={handleLinkedInAnalysis}
            disabled={isProcessing}
            className="w-full py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? 'Analyzing...' : 'Analyze Profile'}
          </button>
        </div>
      )}

      {uploadStatus === 'processing' && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Loader className="animate-spin text-primary-500" />
          <span className="text-sm text-gray-600">Processing your {uploadType}...</span>
        </div>
      )}
      {uploadStatus === 'success' && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <CheckCircle className="text-green-500" />
          <span className="text-sm text-green-600">Analysis complete!</span>
        </div>
      )}
      {uploadStatus === 'error' && (
        <div className="mt-4 flex items-center justify-center space-x-2">
          <AlertCircle className="text-red-500" />
          <span className="text-sm text-red-600">Upload failed. Please try again.</span>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
