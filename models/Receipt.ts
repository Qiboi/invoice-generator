import mongoose, { Schema, models, model } from "mongoose"

const ReceiptSchema = new Schema(
    {
        receipt_number: {
            type: String,
            required: true,
            unique: true,
        },

        receipt: {
            type: Schema.Types.Mixed,
            required: true,
        },

        companyInfo: {
            type: Schema.Types.Mixed,
            required: true,
        },

        computed: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
    { timestamps: true }
)

export default models.Receipt || model("Receipt", ReceiptSchema)