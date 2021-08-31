import jsPDF from "jspdf";
import "jspdf-autotable";
const generatePDF = (comlumn, row) => {
  const doc = new jsPDF();
  const tableColumn = comlumn;
  const tableRows = [];
  row.forEach((dataItem, index) => {
    const dataItemRow = [index, ...dataItem];
    tableRows.push(dataItemRow);
  });
  doc.text("Data Report", 14, 15);
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

  doc.save(`report_${dateStr}.pdf`);
};
export default generatePDF;
