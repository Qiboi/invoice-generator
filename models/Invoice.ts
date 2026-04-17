import mongoose, { Schema, models, model } from "mongoose"

const InvoiceSchema = new Schema(
    {
        invoice_number: {
            type: String,
            required: true,
            unique: true,
        },

        status: {
            type: String,
            enum: ["draft", "issued", "paid", "overdue"],
            default: "draft",
        },

        invoice: {
            type: Object,
            required: true,
        },

        companyInfo: {
            type: Object,
            required: true,
        },

        computed: {
            type: Object,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default models.Invoice || model("Invoice", InvoiceSchema)