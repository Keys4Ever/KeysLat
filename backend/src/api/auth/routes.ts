import { Router } from "express";
import { AuthController } from "./controller";
import { loginValidator, registerValidator } from './validators';
import schemaValidator from "../../middleware/schemaValidators.middlewares";
import authenticate from "../../middleware/authenticate.middleware";

const router = Router();

router.post("/login", 
    schemaValidator(loginValidator, null),
    AuthController.login
);

router.post("/register", 
    schemaValidator(registerValidator, null),
    AuthController.register
);

router.get("/profile", 
    authenticate,
    AuthController.getProfile
);
export default router;
