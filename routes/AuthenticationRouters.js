import { Router } from "express";
import * as AuthenticationService from "../controllers/Authentication/exports.js"

import { join } from "path";

const AuthRouter = Router();

AuthRouter.post('/register', AuthenticationService.signUp);
AuthRouter.post('/login', AuthenticationService.login);

export default AuthRouter; 