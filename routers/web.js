import express from "express";
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
import deleteExpense from "../controller/expense/deleteExpense.js";
import getBalance from "../controller/expense/getBalance.js";
import settlementExpense from "../controller/expense/settlementExpense.js";

const router = express.Router();

router.get("/getAllBills", responseController.getAllBills);
router.get("/activity", responseController.getActivity);

// POST ROUTS
router.post("/google", GoogleAuth);
router.post("/login", loginUser);
router.post("/registration", registerUser);
router.post("/createGroup", createGroups);
router.post("/createExpense", createExpense);
router.post("/logOut", logOutUser);
router.post("/settleExpense", settlementExpense);

// GET ROUTS
router.get("/getGroup", getGroups);
router.get("/getUserInformation", getUserInfo);
router.get(`/getExpenses`, getExpenses);
router.get(`/getBalance`, getBalance);

// DELETE ROUTS
router.delete("/deleteGroup", deleteGroup);
router.delete("/deleteExpense", deleteExpense);

export default router;
