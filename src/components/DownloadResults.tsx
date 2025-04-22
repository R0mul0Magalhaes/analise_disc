import React from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ProfileResult } from '../types';
import { DISC_DESCRIPTIONS } from '../utils/discAnalyzer';

interface DownloadResultsProps {
  results: ProfileResult[];
}

export const DownloadResults: React.FC<DownloadResultsProps> = ({ results }) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(20);
    doc.text('Resultados da Análise DISC', 20, yPos);
    yPos += 20;

    results.forEach((result) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      const description = DISC_DESCRIPTIONS[result.dominantType];

      doc.setFontSize(16);
      doc.text(result.name, 20, yPos);
      yPos += 10;

      doc.setFontSize(14);
      doc.text(`Perfil ${description.title}`, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text(`D: ${result.profile.D}  I: ${result.profile.I}  S: ${result.profile.S}  C: ${result.profile.C}`, 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      description.characteristics.forEach(char => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`• ${char}`, 25, yPos);
        yPos += 6;
      });

      yPos += 10;
    });

    doc.save('analise-disc.pdf');
  };

  return (
    <button
      onClick={handleDownload}
      className="w-[600px] flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md"
    >
      <Download className="w-5 h-5" />
      Baixar Resultados (PDF)
    </button>
  );
};