import mongoose, { Schema } from "mongoose";

const historySchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    testType: {
        type: String, 
        required: true,
        enum: ["Lung Cancer", "Breast Cancer", "Heart Disease", "Diabetes"]
    },
    result: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const History = mongoose.model("History", historySchema);