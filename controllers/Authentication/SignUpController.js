import { PrismaClient } from "@prisma/client";
import { get_info, validateNID } from "./NIDValidation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from 'fs';

const prisma = new PrismaClient();


const hashPassword = async function (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};


const createJWT = (id) => {
    const jwtExpirySeconds = 20 * 60; //jwt expires after 20 minutes
    return jwt.sign({ id }, process.env.JWT_KEY, {
        expiresIn: jwtExpirySeconds,
    });
};

export async function signUp(req, res, next) {

    let path;

    try {

        // checking if the request contains files and images
        if (!req.files || !req.files.image || req.fileError) {
            return res.status(400).json({ message: "Invalid file upload" });
        }

        // the path to the last saved image
        path = `uploads/NationalIDs/${req.files.image[0].filename}`;

        // check if the national ID is registered before
        const existingNationalID = await prisma.user.findUnique({
            where: { nationalID: req.body.nationalID },
        });

        if (existingNationalID) {
            fs.unlinkSync(path);
            return res.status(406).json({ message: "National ID already registered" })
        }

        // check if the phone number is registered before
        const existingPhone = await prisma.user.findUnique({
            where: { phone: req.body.phone },
        });

        if (existingPhone) {
            fs.unlinkSync(path);
            return res.status(406).json({ message: "Phone number already registered" })
        }


        // check if the username is registered before
        const existingUsername = await prisma.user.findUnique({
            where: { username: req.body.username },
        });
        if (existingUsername) {
            fs.unlinkSync(path);
            return res.status(406).json({ message: "Username already registered" })
        }

        // validate the entered national id if all the previous checks passed 
        if (validateNID(req.body.nationalID)) {

            let userData = req.body;

            // hashing the password 
            const hashedPassword = await hashPassword(userData.password);
            userData.password = hashedPassword;

            // setting values to fields 
            userData.balance = 0;
            userData.nationalIdFileName = path // path to the photo on server

            const dateObject = new Date(req.body.birthdate);
            dateObject.setHours(0, 0, 0, 0); // set time component to midnight
            userData.birthdate = dateObject;


            const user = await prisma.user.create({
                data: userData,
            });

            const token = createJWT(user.id);

            return res.status(201).json({ user: user, token: token });
        } else {
            fs.unlinkSync(path);
            return res.status(400).json({ message: "National ID is not valid" });
        }

    } catch (error) {
        fs.unlinkSync(path);
        res.status(400).json(error.message);
        next(error);
    }
}