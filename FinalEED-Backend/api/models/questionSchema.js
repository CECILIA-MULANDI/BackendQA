import mongoose from "mongoose";
import { Schema } from "mongoose";

const QuestionSchema = new Schema({
    text: {
        type: String,
        required: "enter a question",
    },
    type: {
        type: String,
        enum: ["yesno", "choice"],
        required: "enter a type",
    },
    choices: [{
        type: String,
        enum: ["A", "B", "C", "D"],
        required: function() {
            return this.type === "choice";
        },
    }, ],
    answer: {
        type: String,
        required: function() {
            return this.type === "yesno";
        },
        enum: ["yes", "no"],
    },
});

export default mongoose.model("Questions", QuestionSchema);