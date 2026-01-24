import PDFDocument from "pdfkit";

export const generateInvoicePDF = (invoice: any) => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  doc.fontSize(18).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(10);
  doc.text(`Invoice No: ${invoice.invoiceNumber}`);
  doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
  doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);
  doc.moveDown();

  doc.text("Billed By:");
  doc.text(invoice.billedBy.name);
  doc.text(invoice.billedBy.address);
  doc.moveDown();

  doc.text("Billed To:");
  doc.text(invoice.billedTo.name);
  doc.text(invoice.billedTo.address);
  doc.moveDown();

  doc.text("Items:");
  doc.moveDown(0.5);

  invoice.items.forEach((item: any, index: number) => {
    doc.text(
      `${index + 1}. ${item.description} | Qty: ${item.quantity} | Rate: ₹${
        item.rate
      } | Total: ₹${item.total}`
    );
  });

  doc.moveDown();
  doc.text(`Subtotal: ₹${invoice.subTotal}`);
  doc.text(`GST: ₹${invoice.gstTotal}`);
  doc.fontSize(12).text(`Amount Due: ₹${invoice.grandTotal}`, {
    underline: true,
  });

  doc.end();
  return doc;
};
