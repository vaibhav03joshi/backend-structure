import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const authController = new AuthController();

router.post("/login", authController.createUser);

router.post("/update-username", authMiddleware, authController.changeUsername);

export { router as authRoute };