import PDFDocument from "pdfkit";

export const generateReportPDF = (data: any) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    doc.fontSize(18).text("Invoice Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`Total Invoices: ${data.totalInvoices}`);
    doc.text(`Total Amount: ₹${data.totalAmount}`);
    doc.moveDown();

    /* ===== TABLE HEADER ===== */
    doc.font("Helvetica-Bold");
    doc.text("Invoice No", 40);
    doc.text("Date", 120);
    doc.text("Billed To", 200);
    doc.text("Status", 350);
    doc.text("Amount", 430);
    doc.moveDown(0.5);

    doc.font("Helvetica");

    data.invoices.forEach((inv: any) => {
        doc.text(inv.invoiceNumber, 40);
        doc.text(
            new Date(inv.issueDate).toLocaleDateString(),
            120
        );
        doc.text(inv.billedTo, 200, undefined, { width: 130 });
        doc.text(inv.status, 350);
        doc.text(`₹${inv.grandTotal}`, 430);
        doc.moveDown();
    });

    doc.end();
    return doc;
};
