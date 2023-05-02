// generating a jwt key 
import { randomBytes } from 'crypto';

const jwtKey = randomBytes(64).toString('hex');

console.log(`Your JWT key is: ${jwtKey}`);