import { jsPDF } from "jspdf";

export function downloadPdf(filename: string, text: string) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 54;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight() - margin;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, maxWidth);
  let y = margin;
  for (const line of lines) {
    if (y > pageHeight) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 15;
  }
  doc.save(filename);
}

export function downloadMarkdown(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
