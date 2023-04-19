import Questions from "../models/questionSchema.js";
import Results from "../models/resultSchema.js";
// get all questions

export async function getQuestions(req, res) {
    try {
        const questions = await Questions.find();
        res.json({ questions });
    } catch (error) {}
}
// get one questions
export async function getQuestion(req, res) {
    try {
        const question = await Questions.findById(req.params.id);
        res.json({ question });
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// post questions
export async function postQuestions(req, res) {
    const questions = {
        text: req.body.text,
        type: req.body.type,
        choices: req.body.choices,
        answer: req.body.answer,
    };
    console.log("req.body:", req.body);
    try {
        const newQ = await Questions.insertMany(questions);
        res.json({ newQ });
    } catch (err) {
        console.error(err);
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// delete questions
export async function deleteQuestions(req, res) {
    try {
        const count = await Questions.countDocuments();
        await Questions.deleteMany();
        res.json({ count });
        console.log(`Deleted ${count} questions`);
    } catch (error) {
        res.status(500).json({ msg: "Internal error" });
    }
}
//UPDATE
export async function updateQuestion(req, res) {
    const questions = {
        text: req.body.text,
        type: req.body.type,
        choices: req.body.choices,
        answer: req.body.answer,
    };
    try {
        let updatedQuestion = await Questions.findByIdAndUpdate(
            req.params.id, {
                questions: questions,
            }, { new: true }
        );
        res.json({ updatedQuestion });
    } catch (error) {
        console.error(`Error updating question: ${error}`);
        res.status(500).json({ msg: "Internal error" });
    }
}

//get results
export async function getResult(req, res) {
    res.json("get some results");
}
// post results
export async function storeResult(req, res) {
    try {
        const { username, result } = req.body;
        const newResult = new Results({ username, result });

        // Pre-save middleware function
        const questionIds = newResult.result.map((result) => result.question);
        const questions = await Questions.find({
            _id: { $in: questionIds },
        }).lean();
        const questionMap = {};

        questions.forEach((question) => {
            questionMap[question._id] = question;
        });

        newResult.result.forEach((result) => {
            const question = questionMap[result.question];
            if (question.type === "yesno") {
                if (result.answer === "yes") {
                    result.points = 2;
                } else if (result.answer === "no") {
                    result.points = 1;
                }
            } else if (question.type === "choice") {
                const choiceIndex = question.choices.indexOf(result.answer);
                if (choiceIndex === -1) {
                    // Invalid choice, set points to 0
                    result.points = 0;
                } else {
                    if (question.choices[choiceIndex] === "A") {
                        result.points = 3;
                    }
                    if (question.choices[choiceIndex] === "B") {
                        result.points = 2;
                    }
                    if (question.choices[choiceIndex] === "C") {
                        result.points = 1;
                    }
                    if (question.choices[choiceIndex] === "D") {
                        result.points = 0;
                    } else {
                        result.points = 1;
                    }
                }
            }
        });

        newResult.points = newResult.result.reduce((total, result) => {
            return total + result.points;
        }, 0);

        if (isNaN(newResult.points)) {
            newResult.points = 0;
        } else if (newResult.points === 0) {
            newResult.points = 1;
        }
        // End of pre-save middleware function

        const savedResult = await newResult.save();
        res.status(201).json(savedResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

// delete results
export async function deleteResult(req, res) {
    res.json("delete some results");
}