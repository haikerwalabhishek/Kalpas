import {authenticate, authorizeRoles} from "../middlewares/Auth.middleware.js";
import { Router } from "express";
const router = Router();
import {
    getAllLibraries,
    getLibraryById,
    createLibrary,
    updateLibrary,
    deleteLibrary,
    getInventory,
    addToInventory,
    removeFromInventory,
} from "../controllers/Library.controller.js";


// router.use(authenticate);
router.get('/',authenticate, getAllLibraries);
router.get('/:id',authenticate, getLibraryById);
router.post('/',authenticate, authorizeRoles('Admin', 'LibraryManager'), createLibrary);
router.put('/:id',authenticate, authorizeRoles('Admin', 'LibraryManager'), updateLibrary);
router.delete('/:id',authenticate, authorizeRoles('Admin', 'LibraryManager'), deleteLibrary);

router.get('/:id/inventory',authenticate, getInventory);
router.post('/:id/inventory/:bookId',authenticate, authorizeRoles('Admin', 'LibraryManager'), addToInventory);
router.delete('/:id/inventory/:bookId',authenticate, authorizeRoles('Admin', 'LibraryManager'), removeFromInventory);
export default router;
