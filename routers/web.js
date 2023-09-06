import express from "express";
import userController from "../controller/userController.js";
import groupController from "../controller/groupController.js";
import responseController from "../controller/responsController.js";

const router = express.Router();

router.post("/registration", userController.userRegister);
router.post("/login", userController.userLogIn);
router.post("/group", groupController.createGroups);
router.post("/createExpense", groupController.createExpense);
router.get("/groups", responseController.allGroups);
router.post("/getGroupMembers", responseController.getGroupMembers);
router.post("/getExpense", responseController.getExpense);
router.get("/getAllBills", responseController.getAllBills);
router.get("/activitys", responseController.getactivitys);
router.post("/deleteGroup/:id", groupController.deleteGroup);
router.post("/deleteExpense/:id", groupController.deleteExpense);
router.post("/settlement/:email", groupController.settlement);
router.get("/getUserInfo", userController.getUserInfo);
router.post("/userLogout", userController.userLogOut);

export default router;
