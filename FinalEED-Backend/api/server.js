import express from "express";
//create an instance of express
const app = express();
//import database connection
import connect from "./database/connection.js";
//dotenv
import { config } from "dotenv";
//connect to database then to server
//import body-parser
import bodyParser from "body-parser";
//import the emitter
import EventEmitter from "events";
const emitter = new EventEmitter();
emitter.setMaxListeners(100);
// import router
import Routers from "./routers/routers.js";
//app middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
config();
//routes
app.use("/api/", Routers);
connect()
    .then(() => {
        try {
            // listen to a port
            app.listen(5000, () => console.log("listening at port 5000"));
        } catch (error) {
            console.log(error);
        }
    })
    .catch((error) => {
        console.log(error);
    });