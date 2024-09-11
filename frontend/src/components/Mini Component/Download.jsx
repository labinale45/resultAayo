import React from "react";
import { IoMdCloudDownload } from "react-icons/io";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Download({ targetRef }) {
  const downloadPDF = () => {
    const input = targetRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 5;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("gradesheet.pdf");
    });
  };

  return (
    <div>
      <button
        onClick={downloadPDF}
        className="bg-[#8AA4D6] hover:bg-[#253553] hover:text-white dark:text-black dark:bg-white text-gray-700 py-2 px-2 rounded text-sm"
      >
        <IoMdCloudDownload />
      </button>
    </div>
  );
}

export default Download;
