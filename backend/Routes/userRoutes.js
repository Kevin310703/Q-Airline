import express from "express";
import { getUsers, 
    getUserById, 
    updateUser, 
    updatePassword,
    deleteUser
 } from "../controller/userController.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.put("/users/:id/changed-password", updatePassword);
router.delete("/users/:id", deleteUser);

export default router;
