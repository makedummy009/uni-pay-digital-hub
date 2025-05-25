
import jsPDF from 'jspdf';
import { Transaction } from '@/components/dashboard/TransactionHistory';

export const generateTransactionHistoryPDF = (transactions: Transaction[]) => {
  const doc = new jsPDF();
  
  // Header with UNI Pay logo
  doc.setFontSize(24);
  doc.setTextColor(139, 92, 246); // Purple color matching the theme
  doc.text('UNIPAY', 20, 30);
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Transaction History Report', 20, 45);
  
  // Report details
  doc.setFontSize(10);
  doc.text('Generated on: ' + new Date().toLocaleString(), 20, 55);
  doc.text(`Total Transactions: ${transactions.length}`, 20, 62);
  
  // Add a line separator
  doc.line(20, 70, 190, 70);
  
  // Table headers
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  
  const headers = ['Date', 'Description', 'Merchant', 'Category', 'Type', 'Amount', 'Status'];
  const headerPositions = [20, 40, 75, 110, 135, 155, 175];
  
  let yPosition = 80;
  
  // Draw headers
  headers.forEach((header, index) => {
    doc.text(header, headerPositions[index], yPosition);
  });
  
  // Draw header underline
  doc.line(20, yPosition + 2, 190, yPosition + 2);
  
  // Table content
  doc.setFont(undefined, 'normal');
  yPosition += 8;
  
  transactions.forEach((transaction, index) => {
    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
      
      // Redraw headers on new page
      doc.setFont(undefined, 'bold');
      headers.forEach((header, headerIndex) => {
        doc.text(header, headerPositions[headerIndex], yPosition);
      });
      doc.line(20, yPosition + 2, 190, yPosition + 2);
      doc.setFont(undefined, 'normal');
      yPosition += 8;
    }
    
    // Format date
    const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
    
    // Truncate long text to fit columns
    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    
    // Row data
    const rowData = [
      formattedDate,
      truncateText(transaction.description, 15),
      truncateText(transaction.merchant, 12),
      truncateText(transaction.category, 10),
      truncateText(transaction.type, 8),
      `$${Math.abs(transaction.amount).toFixed(2)}`,
      transaction.status
    ];
    
    // Draw row data
    rowData.forEach((data, dataIndex) => {
      // Set color for amount based on transaction type
      if (dataIndex === 5) { // Amount column
        doc.setTextColor(transaction.amount >= 0 ? 34 : 239, transaction.amount >= 0 ? 197 : 68, transaction.amount >= 0 ? 94 : 68);
      } else {
        doc.setTextColor(0, 0, 0);
      }
      
      doc.text(data, headerPositions[dataIndex], yPosition);
    });
    
    yPosition += 6;
    
    // Add subtle row separator every 5 rows
    if ((index + 1) % 5 === 0) {
      doc.setDrawColor(230, 230, 230);
      doc.line(20, yPosition - 1, 190, yPosition - 1);
      doc.setDrawColor(0, 0, 0);
    }
  });
  
  // Summary section
  const totalCredit = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebit = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const netAmount = totalCredit - totalDebit;
  
  // Add summary box
  yPosition += 10;
  doc.setDrawColor(139, 92, 246);
  doc.setLineWidth(0.5);
  doc.rect(20, yPosition, 170, 25);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text('TRANSACTION SUMMARY', 25, yPosition + 8);
  
  doc.setFont(undefined, 'normal');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  
  doc.text(`Total Credits: $${totalCredit.toFixed(2)}`, 25, yPosition + 15);
  doc.text(`Total Debits: $${totalDebit.toFixed(2)}`, 80, yPosition + 15);
  doc.text(`Net Amount: $${netAmount.toFixed(2)}`, 135, yPosition + 15);
  
  doc.setTextColor(netAmount >= 0 ? 34 : 239, netAmount >= 0 ? 197 : 68, netAmount >= 0 ? 94 : 68);
  doc.text(`Status: ${netAmount >= 0 ? 'Positive' : 'Negative'}`, 25, yPosition + 20);
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('UniPay Financial Services Pvt. Ltd. | support@unipay.com | 1800-123-4567', 20, 285);
    doc.text(`Page ${i} of ${pageCount}`, 170, 285);
  }
  
  // Download the PDF
  const fileName = `UniPay-Transaction-History-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
