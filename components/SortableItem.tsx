import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { FileText, GripVertical, Trash2 } from 'lucide-react';
import { PdfFile } from '../types';

interface SortableItemProps {
  file: PdfFile;
  index: number;
  onRemove: (id: string) => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({ file, index, onRemove }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Draggable draggableId={file.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group flex items-center p-3 mb-3 bg-white border rounded-lg shadow-sm transition-all ${
            snapshot.isDragging ? 'border-indigo-500 shadow-lg scale-[1.02] z-50' : 'border-gray-200 hover:border-indigo-300'
          }`}
        >
          {/* Drag Handle */}
          <div
            {...provided.dragHandleProps}
            className="p-2 mr-2 text-gray-400 cursor-grab active:cursor-grabbing hover:text-indigo-600"
          >
            <GripVertical size={20} />
          </div>

          {/* Icon */}
          <div className="p-2 bg-red-50 rounded-lg mr-4">
            <FileText className="w-6 h-6 text-red-500" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate" title={file.name}>
              {file.name}
            </h4>
            <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
          </div>

          {/* Actions */}
          <button
            onClick={() => onRemove(file.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
            title="Remove file"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </Draggable>
  );
};