import {authenticate,authorizeRoles} from "../middlewares/Auth.middleware.js";
import { Router } from "express";
const router = Router();
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/Book.controller.js";

// router.use(authenticate);
router.get("/",authenticate, getAllBooks);
router.get("/:id",authenticate, getBookById);
router.post("/",authenticate,authorizeRoles('Author'), createBook);
router.put("/:id",authenticate,authorizeRoles('Author'), updateBook);
router.delete("/:id",authenticate,authorizeRoles('Author'), deleteBook);

export default router;
