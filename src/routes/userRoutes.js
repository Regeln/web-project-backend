import express from "express";
import userController from "../controllers/userController.js"; 
import { verifyJWT } from "../verifyJWT.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/")
    .get(userController.getAllUsers)
    .post(userController.createNewUser)
    .delete(userController.deleteUser);

export default router;