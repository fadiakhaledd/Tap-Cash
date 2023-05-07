import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRepository } from '../../Repositories/UserRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
export const login = async (req, res, next) => {
    try {

        const user = await userRepository.findUserByPhone(req.body.phone);

        if (user) {
            const auth = await bcrypt.compare(req.body.password, user.password);
            if (auth) {
                const token = createJWT(user.UID);
                return res.status(200).json({ userID: user.UID, token: token });
            } else {
                return res.status(401).json({ message: "Incorrect password" });
            }
        } else {
            return res.status(404).json({ message: "User does not exist" });
        }
    } catch (error) {
        res.status(401).json(error.message);
        next(error);
    }
};

const createJWT = (id) => {
    const jwtExpirySeconds = 20 * 60; //jwt expires after 20 minutes
    return jwt.sign({ id }, process.env.JWT_KEY, {
        expiresIn: jwtExpirySeconds,
    });
};
