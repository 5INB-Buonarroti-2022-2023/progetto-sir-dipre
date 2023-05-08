import cors from "cors";
import Express from "express";
import fileUpload from "express-fileupload";
import path from "path";

const pathToImages = path.resolve(path.join(__dirname, '../images/'));
export const notFoundImage = path.resolve(path.join(pathToImages, '/misc/notFound.png'));

export const app = Express();
app.use(cors());
app.use(Express.json());
app.use(Express.static(pathToImages));
app.use(fileUpload({
    createParentPath: true
}));

app.get("", (req, res) => {
    
});