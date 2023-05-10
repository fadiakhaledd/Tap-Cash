// generating a jwt key 
import { randomBytes } from 'crypto';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const jwtKey = randomBytes(64).toString('hex');

// console.log(`Your JWT key is: ${jwtKey}`);


export const hashPassword = async function (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};


export const createJWT = (id) => {
    const jwtExpirySeconds = 20 * 60; //jwt expires after 20 minutes
    return jwt.sign({ id }, process.env.JWT_KEY, {
        expiresIn: jwtExpirySeconds,
    });
};