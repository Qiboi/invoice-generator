import Counter from "@/models/Counter"

export async function getNextInvoiceNumber() {
    const counter = await Counter.findByIdAndUpdate(
        { _id: "invoice" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )

    const seq = counter.seq.toString().padStart(4, "0")

    const now = new Date()
    const month = now.toLocaleString("id-ID", { month: "short" }).toUpperCase()
    const year = now.getFullYear()

    return `${seq}/INV/${month}/${year}`
}