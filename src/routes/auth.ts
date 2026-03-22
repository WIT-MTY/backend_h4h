import { Router } from "express";
import * as AuthController from "@/controllers/auth";

const router = Router();

router.post("/auth/signup", AuthController.signUp);
router.post("/auth/login", AuthController.logIn);

export default router;
