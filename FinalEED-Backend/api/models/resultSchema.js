import mongoose from "mongoose";
import { Schema } from "mongoose";

const ResultSchema = new Schema({
    username: { type: String },
    result: [{
        question: { type: Schema.Types.ObjectId, ref: "Question" },
        answer: {
            type: String,
        },
        points: { type: Number },
    }, ],

    points: { type: Number, default: 0 },
});

export default mongoose.model("Results", ResultSchema);

// resultSchema.pre("save", async function() {
//     const questionIds = this.result.map((result) => result.question);
//     const questions = await Question.find({ _id: { $in: questionIds } }).lean();
//     const questionMap = {};

//     questions.forEach((question) => {
//         questionMap[question._id] = question;
//     });

//     this.result.forEach((result) => {
//         const question = questionMap[result.question];
//         if (question.type === "yesno") {
//             if (result.answer === "yes") {
//                 result.points = 2;
//             } else if (result.answer === "no") {
//                 result.points = 1;
//             }
//         } else if (question.type === "choice") {
//             const choiceIndex = question.choices.indexOf(result.answer);
//             if (choiceIndex === 0) {
//                 result.points = 3;
//             } else if (choiceIndex === 1) {
//                 result.points = 2;
//             } else if (choiceIndex === 2) {
//                 result.points = 1;
//             } else if (choiceIndex === 3) {
//                 result.points = 0;
//             }
//         }
//     });

//     this.points = this.result.reduce((total, result) => {
//         return total + result.points;
//     }, 0);

//     if (this.points === 0) {
//         this.points = 1;
//     }
// });