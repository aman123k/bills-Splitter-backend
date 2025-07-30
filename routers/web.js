import express from "express";
import groupController from "../controller/groupController.js";
import responseController from "../controller/responseController.js";

// auths file
import GoogleAuth from "../controller/auths/googleAuth.js";

// user controller
import registerUser from "../controller/user/registerUser.js";
import loginUser from "../controller/user/loginUser.js";
import createGroups from "../controller/groups/createGroup.js";
import getGroups from "../controller/groups/getGroups.js";
import getUserInfo from "../controller/user/getUserDetails.js";
import logOutUser from "../controller/user/logoutUser.js";
import createExpense from "../controller/expense/createExpense.js";
import getExpenses from "../controller/expense/getExpense.js";
import deleteGroup from "../controller/groups/deleteGroup.js";

const router = express.Router();

// router.post("/createExpense", groupController.createExpense);
router.get("/groups", responseController.allGroups);
router.post("/getGroupMembers", responseController.getGroupMembers);
router.post("/getExpense", responseController.getExpense);
router.get("/getAllBills", responseController.getAllBills);
router.get("/activity", responseController.getActivity);
router.post("/deleteGroup/:id", groupController.deleteGroup);
router.post("/deleteExpense/:id", groupController.deleteExpense);
router.post("/settlement/:email", groupController.settlement);

// auths file
router.post("/google", GoogleAuth);

// user controller
router.post("/registration", registerUser);
router.post("/login", loginUser);
router.post("/createGroup", createGroups);
router.post("/createExpense", createExpense);
router.get("/getGroup", getGroups);
router.get("/getUserInformation", getUserInfo);
router.get(`/getExpenses`, getExpenses);
router.post("/logOut", logOutUser);
router.delete("/deleteGroup", deleteGroup);

export default router;
