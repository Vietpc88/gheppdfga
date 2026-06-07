import { PDFDocument } from 'pdf-lib';
import { PdfFile } from '../types';

export const mergePdfs = async (files: PdfFile[]): Promise<Uint8Array> => {
  if (files.length === 0) {
    throw new Error("No files to merge");
  }

  // Create a new PDF document
  const mergedPdf = await PDFDocument.create();

  for (const pdfFile of files) {
    try {
      // Read the file as an ArrayBuffer
      const fileBuffer = await pdfFile.file.arrayBuffer();
      
      // Load the source PDF
      const srcPdf = await PDFDocument.load(fileBuffer);
      
      // Copy all pages from the source PDF
      const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
      
      // Add copied pages to the merged PDF
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (error) {
      console.error(`Error processing file ${pdfFile.name}:`, error);
      throw new Error(`Failed to process ${pdfFile.name}. It might be encrypted or corrupted.`);
    }
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes;
};

export const downloadPdf = (data: Uint8Array, filename: string = 'merged-document.pdf') => {
  const blob = new Blob([data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};