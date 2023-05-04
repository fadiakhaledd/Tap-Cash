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
    let path = `uploads/NationalIDs/${req.files.image[0].filename}`;

    try {
        if (req.fileError) {
            return res.status(400).json({ message: req.fileError });
        }

        console.log(path)

        //console.log(req.body)
        if (validateNID(req.body.nationalID)) {
            const existingPhone = await prisma.user.findUnique({
                where: { phone: req.body.phone },
            });

            const existingUsername = await prisma.user.findUnique({
                where: { username: req.body.username },
            });

            if (!existingPhone && !existingUsername) {
                let userData = req.body;
                const hashedPassword = await hashPassword(userData.password);
                userData.password = hashedPassword;
                userData.balance = 0;
                userData.nationalIdFileName = req.files.image[0].filename


                const user = await prisma.user.create({
                    data: userData,
                });
                const token = createJWT(user.id);
                return res.status(201).json({ user: user, token: token });
            } else {
                fs.unlinkSync(path);
                if (existingPhone) return res.status(406).json({ message: "phone number already exists" })
                if (existingUsername) return res.status(406).json({ message: "usrname already exists" })
            }
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
