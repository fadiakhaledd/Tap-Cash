import { Router } from "express";
import multer from 'multer';
import path from 'path'
import * as AuthenticationService from "../controllers/ParentControllers/Authentication/exports.js"


const AuthRouter = Router();

const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "image") {
            cb(null, './uploads/NationalIDs');
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storageEngine,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/png"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            req.fileError = "Only .jpeg, .jpg, .png format allowed!";
        }
    },
});

AuthRouter.post("/register", upload.fields([{ name: "image" }]), AuthenticationService.signUp);

AuthRouter.post('/login', AuthenticationService.login);

export default AuthRouter; 