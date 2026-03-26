import { Router } from "express";
import * as teamController from "../controllers/team.js";
import { protectRoute } from "../middlewares/auth.js";

const router = Router();

router.get("/teams", teamController.listTeams);
router.post("/teams/create", protectRoute, teamController.createTeam);
router.post("/teams/join", protectRoute, teamController.joinTeam);
router.post("/teams/leave", protectRoute, teamController.leaveTeam);

export default router;
