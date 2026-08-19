import { Router } from "express";
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", getAllDepartments);
router.post("/", authorize("ADMIN"), createDepartment);
router.put("/:id", authorize("ADMIN"), updateDepartment);
router.delete("/:id", authorize("ADMIN"), deleteDepartment);

export default router;
