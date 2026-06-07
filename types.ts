export interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export interface DragItem {
  index: number;
  id: string;
  type: string;
}