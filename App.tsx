import React, { useState, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Plus, Download, Loader2, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { PdfFile } from './types';
import { mergePdfs, downloadPdf } from './services/pdfService';
import { EmptyState } from './components/EmptyState';
import { SortableItem } from './components/SortableItem';

const App: React.FC = () => {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles: PdfFile[] = Array.from(event.target.files).map((file: File) => ({
        id: uuidv4(),
        file,
        name: file.name,
        size: file.size,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      
      // Reset input so the same file can be selected again if needed
      event.target.value = '';
      setError(null);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFiles(items);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to remove all files?')) {
      setFiles([]);
      setError(null);
    }
  };

  const handleMerge = async () => {
    if (files.length === 0) return;

    setIsMerging(true);
    setError(null);

    try {
      // Small delay to allow UI to update to loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const mergedPdfBytes = await mergePdfs(files);
      downloadPdf(mergedPdfBytes, `merged_document_${new Date().getTime()}.pdf`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while merging.');
    } finally {
      setIsMerging(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PDF Merger</h1>
          <p className="text-gray-600">Rearrange and merge your PDF files instantly in the browser.</p>
        </div>

        {/* Hidden Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="application/pdf"
          multiple
          className="hidden"
        />

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center flex-wrap gap-2 sticky top-0 z-10">
            <h2 className="font-semibold text-lg text-gray-800 px-2">
              Files ({files.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={triggerFileInput}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
              >
                <Plus size={18} />
                Add Files
              </button>
              {files.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                >
                  <RefreshCw size={18} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* File List Area */}
          <div className="p-6 bg-gray-50/50 min-h-[300px] max-h-[600px] overflow-y-auto custom-scrollbar">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center">
                <span className="font-semibold mr-1">Error:</span> {error}
              </div>
            )}

            {files.length === 0 ? (
              <EmptyState onUploadClick={triggerFileInput} />
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="pdf-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {files.map((file, index) => (
                        <SortableItem
                          key={file.id}
                          index={index}
                          file={file}
                          onRemove={removeFile}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Footer / Actions */}
          <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
             <button
                onClick={handleMerge}
                disabled={files.length === 0 || isMerging}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  files.length === 0 || isMerging
                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 active:transform active:scale-95'
                }`}
              >
                {isMerging ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Merging...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Merge PDF
                  </>
                )}
              </button>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Files are processed locally in your browser. No data is uploaded to any server.</p>
        </div>
      </div>
    </div>
  );
};

export default App;