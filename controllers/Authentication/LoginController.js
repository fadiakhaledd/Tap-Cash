import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export const login = async (req, res, next) => {
    try {
        const user = await checkUser(req.body.phone, req.body.password);
        const token = createJWT(user.id);
        res.status(200).json({ token });
    } catch (error) {
        //const errors = handleErrors(error);
        res.status(401).json(error.message);
        next(error);
    }
};


const checkUser = async function (phone, password) {
    const user = await prisma.user.findUnique({
        where: { phone: phone },
    });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        console.log(password, user.password)
        if (auth) {
            return user;
        } else {
            throw Error("Incorrect password");
        }
    } else throw Error("user does not exist");
};

const createJWT = (id) => {
    const jwtExpirySeconds = 20 * 60; //jwt expires after 20 minutes
    return jwt.sign({ id }, process.env.JWT_KEY, {
        expiresIn: jwtExpirySeconds,
    });
};
