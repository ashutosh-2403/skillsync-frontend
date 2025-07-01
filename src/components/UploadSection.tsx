import React, { useState, useCallback } from 'react';
import { Upload, Link, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface UploadSectionProps {
  onUploadSuccess: () => void;
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

      const response = await axios.post('/analysis/upload-resume', formData); // ✅ No token here; handled by interceptor

      setUploadStatus('success');
      setTimeout(() => onUploadSuccess(), 1000);
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
      const response = await axios.post('/analysis/linkedin', { url: linkedinUrl }); // ✅ Interceptor adds token
      setUploadStatus('success');
      setTimeout(() => onUploadSuccess(), 1000);
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
          className={`p-8 border-2 border-dashed rounded-lg ${dragActive ? 'border-primary-600 bg-primary-50' : 'border-neutral-300'}`}
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
          <label htmlFor="fileUpload" className="cursor-pointer text-primary-600 hover:underline">Or click to browse</label>
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
            className="w-full py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700"
          >
            Analyze Profile
          </button>
        </div>
      )}

      {uploadStatus === 'processing' && <Loader className="mx-auto mt-4 animate-spin text-primary-500" />}
      {uploadStatus === 'success' && <CheckCircle className="mx-auto mt-4 text-green-500" />}
      {uploadStatus === 'error' && <AlertCircle className="mx-auto mt-4 text-red-500" />}
    </div>
  );
};

export default UploadSection;
