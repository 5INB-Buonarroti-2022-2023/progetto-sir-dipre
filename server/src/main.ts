import Express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { app } from "./server";


//db connection to app db
/*  Usate questa sezione se volete usare un db mongodb

const database = "test"
const uri = ``;
mongoose.set('strictQuery', false);
mongoose.connect(uri, async () => {

});
*/

app.listen(3000, () => {
    console.log("server started");
});