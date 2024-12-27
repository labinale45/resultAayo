import React from "react";
import { FaPrint } from "react-icons/fa";

const Print = ({ targetRef }) => {
  const handlePrint = () => {
    const printContent = targetRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    const styles = Array.from(document.styleSheets)
        .map(sheet => {
            try {
                return Array.from(sheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('\n');
            } catch (e) {
                return '';
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
              body { margin: 0; }
              body * { visibility: hidden; }
              #printSection, #printSection * { visibility: visible; }
              #printSection { position: relative; }
              
              /* Ensure each student fits on one page */
              .print\\:page-break-after-always {
                page-break-after: always;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
                height: 100vh;
                display: flex;
                flex-direction: column;
              }

              /* Table styles */
              table { 
                width: 100%; 
                border-collapse: collapse;
                font-size: 0.9em;
              }
              
              th, td { 
                padding: 4px;
                border: 1px solid black;
              }

              /* Adjust spacing */
              .mb-4 { margin-bottom: 0.5rem !important; }
              .mb-6 { margin-bottom: 1rem !important; }
              .mt-24 { margin-top: 2rem !important; }
              
              /* Scale content to fit */
              #printSection > div {
                transform-origin: top center;
                transform: scale(0.95);
              }

              @page {
                margin: 10mm;
                size: A4 portrait;
              }
            }
          </style>
        </head>
        <body>
          <div id="printSection">${printContent}</div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500); // Increased timeout for better loading
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

//for dynamic table
// import React from "react";
// import { FaPrint } from "react-icons/fa";

// const Print = ({ data, examType, year, className }) => {
//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank');
    
//     const printContent = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <title>Ledger Table</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               padding: 20px;
//               margin: 0;
//             }
//             .header {
//               text-align: center;
//               margin-bottom: 20px;
//             }
//             .class-info {
//               text-align: left;
//               font-size: 18px;
//               margin: 10px 0;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin-top: 15px;
//             }
//             th, td {
//               border: 1px solid black;
//               padding: 8px;
//               text-align: center;
//               font-size: 14px;
//             }
//             .subject-cell {
//               width: 200px;
//             }
//             .subject-header {
//               font-weight: bold;
//               border-bottom: 1px solid black;
//               padding-bottom: 5px;
//               margin-bottom: 5px;
//             }
//             .subject-details {
//               display: grid;
//               grid-template-columns: repeat(3, 1fr);
//               gap: 5px;
//               font-size: 12px;
//             }
//             @media print {
//               @page {
//                 size: landscape;
//                 margin: 10mm;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <p>Estd: ${data?.estdYear || ''}</p>
//             <h2>${examType}-${year}</h2>
//           </div>
//           <div class="class-info">
//             <p>Class: ${className}</p>
//           </div>
          
//           <table>
//             <thead>
//               <tr>
//                 <th rowspan="2">Roll No</th>
//                 <th rowspan="2">Name</th>
//                 ${data[0]?.subjects.split(', ').map(subject => `
//                   <th colspan="3" class="subject-cell">
//                     ${subject}
//                     <div class="subject-details">
//                       <div>Theory</div>
//                       <div>Practical</div>
//                       <div>Total</div>
//                     </div>
//                   </th>
//                 `).join('')}
//                 <th rowspan="2">Total<br/>Marks</th>
//                 <th rowspan="2">GPA</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${data.map(student => `
//                 <tr>
//                   <td>${student.rollNo}</td>
//                   <td>${student.students}</td>
//                   ${student.subjects.split(', ').map((_, index) => `
//                     <td>${student.TH[index] || ''}</td>
//                     <td>${student.PR[index] || ''}</td>
//                     <td>${student.totalScores?.[index] || ''}</td>
//                   `).join('')}
//                   <td>${student.total || ''}</td>
//                   <td>${student.gpa || ''}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(printContent);
//     printWindow.document.close();
//     printWindow.focus();

//     // Wait for content and styles to load before printing
//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 250);
//   };

//   return (
//     <button
//       onClick={handlePrint}
//       className="bg-[#8AA4D6] hover:bg-[#253553] hover:text-white dark:text-black dark:bg-white text-gray-700 py-2 px-2 rounded text-sm"
//     >
//       <FaPrint />
//     </button>
//   );
// };

// export default Print;