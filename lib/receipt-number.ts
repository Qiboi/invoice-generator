import Counter from "@/models/Counter"

export async function getNextReceiptNumber() {
    const counter = await Counter.findByIdAndUpdate(
        { _id: "receipt" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    )

    const seq = String(counter.seq).padStart(4, "0")
    const now = new Date()
    const month = now
        .toLocaleString("id-ID", { month: "short" })
        .toUpperCase()
    const year = now.getFullYear()

    return `${seq}/KW/${month}/${year}`
}