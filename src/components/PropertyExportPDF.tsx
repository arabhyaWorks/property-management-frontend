import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import generatePDFContent from '../utils/pdfContentGenerator';

const PropertyExportPDF = ({ propertyData, propertyId }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      
      // Create document reference
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Create a temporary div to hold our printable content
      const printElement = document.createElement('div');
      printElement.className = 'pdf-export-container';
      printElement.style.width = '750px';
      printElement.style.padding = '20px';
      printElement.style.fontFamily = 'Arial, sans-serif';
      printElement.style.position = 'absolute';
      printElement.style.left = '-9999px';
      document.body.appendChild(printElement);
      
      // Populate with styled HTML content
      printElement.innerHTML = generatePDFContent(propertyData, propertyId);
      
      // Convert the element to canvas
      const canvas = await html2canvas(printElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Get image data and add to PDF
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate the number of pages needed
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add subsequent pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`property-${propertyId}.pdf`);
      
      // Clean up
      document.body.removeChild(printElement);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF generation failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className={`flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-full p-2 ml-2 focus:outline-none focus:ring-2 focus:ring-white transition-colors ${
        isExporting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label="Export property data"
      title="Export to PDF"
    >
      <FileDown size={20} className={isExporting ? 'animate-pulse' : ''} />
    </button>
  );
};

export default PropertyExportPDF;