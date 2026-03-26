import { Router } from "express";
import multer from "multer";
import * as AuthController from "../controllers/auth.js";
import { protectRoute, canDeleteUser } from "../middlewares/auth.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });
const uploadFields = upload.fields([
  { name: "cv_file", maxCount: 1 },
  { name: "permiso_file", maxCount: 1 },
]);

router.post("/auth/signup", uploadFields, AuthController.signUp);
router.post("/auth/login", AuthController.logIn);
router.post("/auth/logout", AuthController.logOut);
router.delete(
  "/auth/delete",
  protectRoute,
  canDeleteUser,
  AuthController.deleteUser,
);

export default router;
