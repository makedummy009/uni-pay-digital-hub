
import jsPDF from 'jspdf';
import { Transaction } from '@/types/transaction';

export const generateTransactionPDF = (transaction: Transaction) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(139, 92, 246); // Purple color
  doc.text('UNIPAY', 20, 30);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Transaction Receipt', 20, 40);
  
  // Transaction Details
  doc.setFontSize(10);
  doc.text('Receipt Generated On: ' + new Date().toLocaleString(), 20, 55);
  
  // Add a line
  doc.line(20, 65, 190, 65);
  
  // Transaction Information
  doc.setFontSize(12);
  doc.text('TRANSACTION DETAILS', 20, 80);
  
  doc.setFontSize(10);
  const details = [
    ['Transaction ID:', transaction.reference],
    ['Date & Time:', `${new Date(transaction.date).toLocaleDateString()} ${transaction.time}`],
    ['Description:', transaction.description],
    ['Merchant:', transaction.merchant],
    ['Amount:', `₹${Math.abs(transaction.amount).toLocaleString()}`],
    ['Type:', transaction.type],
    ['Category:', transaction.category],
    ['Status:', transaction.status],
    ['Location:', transaction.location || 'N/A']
  ];
  
  let yPosition = 95;
  details.forEach(([label, value]) => {
    doc.text(label, 20, yPosition);
    doc.text(value, 70, yPosition);
    yPosition += 10;
  });
  
  // Amount highlight
  doc.setFontSize(14);
  // Fix the ternary operator syntax - set color based on transaction type
  if (transaction.amount >= 0) {
    doc.setTextColor(34, 197, 94); // Green for credit
  } else {
    doc.setTextColor(239, 68, 68); // Red for debit
  }
  doc.text(
    `${transaction.amount >= 0 ? 'CREDITED' : 'DEBITED'}: ₹${Math.abs(transaction.amount).toLocaleString()}`,
    20,
    yPosition + 20
  );
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This is a system-generated receipt. No signature required.', 20, 250);
  doc.text('For queries, contact: support@unipay.com | 1800-123-4567', 20, 260);
  doc.text('UniPay Financial Services Pvt. Ltd. | CIN: U74999DL2023PTC123456', 20, 270);
  
  // Download
  doc.save(`UniPay-Receipt-${transaction.reference}.pdf`);
};
