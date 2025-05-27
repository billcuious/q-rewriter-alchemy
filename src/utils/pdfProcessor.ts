
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ExtractedQuestion {
  id: string;
  text: string;
  pageNumber: number;
  rawText: string;
}

export async function extractTextFromPDF(file: File): Promise<ExtractedQuestion[]> {
  console.log('Starting PDF text extraction...');
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const questions: ExtractedQuestion[] = [];
    
    console.log(`PDF has ${pdf.numPages} pages`);
    
    // Extract text from first 5 pages for demo
    const maxPages = Math.min(pdf.numPages, 5);
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      console.log(`Processing page ${pageNum}`);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .trim();
      
      // Simple heuristic to detect questions (look for question marks or numbered items)
      if (pageText.length > 50 && (pageText.includes('?') || /^\d+\./.test(pageText))) {
        questions.push({
          id: `Q${pageNum.toString().padStart(3, '0')}`,
          text: pageText.substring(0, 500) + (pageText.length > 500 ? '...' : ''),
          pageNumber: pageNum,
          rawText: pageText
        });
      }
    }
    
    console.log(`Extracted ${questions.length} potential questions`);
    return questions;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error}`);
  }
}
