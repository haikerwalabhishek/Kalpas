import {authenticate} from "../middlewares/Auth.middleware.js";
import { Router } from "express";
const router = Router();
import { borrowBook, returnBook } from "../controllers/Borrow.controller.js";

// router.use(authenticate);
router.post("/borrow/:id",authenticate, borrowBook);
router.put("/return/:id",authenticate, returnBook);

export default router;
