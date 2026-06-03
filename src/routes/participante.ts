import { Router } from "express";
import * as participanteController from "../controllers/participante.js";
import { protectRoute } from "../middlewares/auth.js";
import multer from "multer";

const router = Router();

router.use(protectRoute);

const upload = multer({ dest: "uploads/" });

// router.patch("/participante/:id/estatus", participanteController.updateEstatus);
router.patch("/:id/estatus", participanteController.updateEstatus); //TODO: later change to updateEstatus route
router.post(
  "/upload-cv",
  upload.single("cv_file"),
  participanteController.uploadCV,
);

export default router;
