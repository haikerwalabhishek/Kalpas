import { Router } from "express";
const router = Router();
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/User.controller.js";

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);

export default router;
