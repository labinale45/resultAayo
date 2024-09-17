import React from "react";
import { FaPrint } from "react-icons/fa";

const Print = ({ targetRef }) => {
  const handlePrint = () => {
    const printContent = targetRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    const printStyles = `
      <style>
        @media print {
          body * { visibility: hidden; }
          #printSection, #printSection * { visibility: visible; }
          #printSection { position: absolute; left: 0; top: 0; }
        }
      </style>
    `;
    document.body.innerHTML =
      printStyles + `<div id="printSection">${printContent}</div>`;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <button
      onClick={handlePrint}
      className="bg-[#8AA4D6] hover:bg-[#253553] hover:text-white dark:text-black dark:bg-white text-gray-700 py-2 px-2 rounded text-sm"
    >
      <FaPrint />
    </button>
  );
};

export default Print;
