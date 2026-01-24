import Counter from "../models/Counter.model";

export const generateInvoiceNumber = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const fyStart = now.getMonth() >= 3 ? year : year - 1;
    const fyEnd = fyStart + 1;

    const financialYear = `${fyStart
        .toString()
        .slice(-2)}/${fyEnd.toString().slice(-2)}`;

    const counterKey = `INVOICE_${financialYear}`;

    const counter = await Counter.findOneAndUpdate(
        { key: counterKey },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    const sequence = counter.seq.toString().padStart(3, "0");

    return `${financialYear}-A${sequence}`;
};
