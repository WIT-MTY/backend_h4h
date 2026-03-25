import { Router } from "express";
import * as teamController from "../controllers/team.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.get("/teams", teamController.listTeams);

export default router;
