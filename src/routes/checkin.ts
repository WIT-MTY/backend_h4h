import { Router } from "express";
import * as checkinController from "../controllers/checkin.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.use(protectRoute);

router.get("/participantes", checkinController.getParticipantesCheckIns);
router.get("/equipos", checkinController.getEquiposCheckIn);
router.post("/:userId", checkinController.createCheckIn);
router.get("/codigo", checkinController.getCheckInCode);

export default router;
