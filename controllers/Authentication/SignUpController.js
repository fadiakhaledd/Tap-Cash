import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();


const hashPassword = async function (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const jwtExpirySeconds = 1 * 24 * 60 * 60; //jwt expires after one day
const createJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, {
        expiresIn: jwtExpirySeconds,
    });
};

export const signUp = async (req, res, next) => {
    try {
        console.log(req.body)
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

            const user = await prisma.user.create({
                data: userData,
            });
            const token = createJWT(user.id);
            res.status(201).json({ user: user, token: token });
        } else {

            res.status(406).json({ message: "User already exists" });
        }

    } catch (error) {
        res.status(400).json(error.message);
        next(error);
    }
}

