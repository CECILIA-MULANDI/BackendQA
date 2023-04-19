import express from "express";
const Router = express.Router();
import * as controllers from "../controllers/controller.js";
// questions routes
Router.route("/questions")
    .get(controllers.getQuestions)
    .post(controllers.postQuestions)
    .delete(controllers.deleteQuestions);
Router.route("/questions/:id")
    .get(controllers.getQuestion)
    .put(controllers.updateQuestion);
//  results
Router.route("/results")
    .get(controllers.getResult)
    .post(controllers.storeResult)
    .delete(controllers.deleteResult);
export default Router;