import React from "react";
import { FaPrint } from "react-icons/fa";

const Print = ({ targetRef }) => {
  const handlePrint = () => {
    const printContent = targetRef.current.innerHTML;
    const printWindow = window.open('', '_blank'); // Open a new window
    const styles = Array.from(document.styleSheets)
        .map(sheet => {
            try {
                return Array.from(sheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('\n');
            } catch (e) {
                return ''; // Ignore stylesheets that can't be accessed
            }
        })
        .join('\n');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            ${styles}
            @media print {
              body * { visibility: hidden; }
              #printSection, #printSection * { visibility: visible; }
              #printSection { position: absolute; left: 0; top: 0; }
              table { width: 100%; border-collapse: collapse; } /* Ensure tables are full width */
              th, td { border: 1px solid black; padding: 8px; text-align: left; } /* Add borders and padding */
            }
          </style>
        </head>
        <body>
          <div id="printSection">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close(); // Close the document to render it
    printWindow.print(); // Trigger the print dialog
    printWindow.close(); // Close the print window after printing
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
