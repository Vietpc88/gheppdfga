import React from 'react';
import { FileUp } from 'lucide-react';

interface EmptyStateProps {
  onUploadClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onUploadClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
      <div className="bg-indigo-100 p-4 rounded-full mb-4">
        <FileUp className="w-10 h-10 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No files selected</h3>
      <p className="text-gray-500 max-w-sm mb-6">
        Upload multiple PDF files to arrange and merge them into a single document.
      </p>
      <button
        onClick={onUploadClick}
        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
      >
        Select PDF Files
      </button>
    </div>
  );
};