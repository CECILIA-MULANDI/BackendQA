import Questions from "../models/questionSchema.js";
import Results from "../models/resultSchema.js";
// get all questions

export async function getQuestions(req, res) {
  try {
    const questions = await Questions.find();
    res.json({ questions });
  } catch (error) {
    res.json({ msg: error });
  }
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
      req.params.id,
      {
        questions: questions,
      },
      { new: true }
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
      console.log(question.type);
      if (question.type === "yesno") {
        if (result.answer === "yes") {
          result.points = 2;
        } else if (result.answer === "no") {
          result.points = 1;
        }
      } else if (question.type === "choice") {
        console.log(question.choices);
        const choiceIndex = question.choices.indexOf(result.answer);

        console.log(`Answer: ${result.answer}, Choices: ${question.choices}`);

        console.log("Choice index:", choiceIndex);
        const selectedChoice = question.choices[choiceIndex];

        if (selectedChoice === "A") {
          result.points = 3;
        } else if (selectedChoice === "B") {
          result.points = 2;
        } else if (selectedChoice === "C") {
          result.points = 1;
        } else if (selectedChoice === "D") {
          result.points = 0;
        } else {
          result.points = 1;
        }
      }
    });
    // console.log(newResult);

    newResult.points = newResult.result.reduce((total, result) => {
      return total + result.points;
    }, 0);
    // console.log(newResult);
    if (isNaN(newResult.points)) {
      newResult.points = 0;
    } else if (newResult.points === 0) {
      newResult.points = 1;
    }
    // End of pre-save middleware function

    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
    // Calculate average points
    const numQuestions = newResult.result.length;
    const averagePoints = newResult.points / numQuestions;
    // res.status(201).json({ averagePoints });
    //   display in form of json

    console.log("the average points are", averagePoints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }

  // Add average points to the response
  //   savedResult.averagePoints = averagePoints;
}

// delete results
export async function deleteResult(req, res) {
  res.json("delete some results");
}
