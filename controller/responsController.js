import expenseModel from "../model/expenseSchema.js";
import groupModel from "../model/groupSchema.js";
import eventModel from "../model/userActivitySchema.js";
import { verifyToken } from "../token/jwtToken.js";
class responseController {
  static allGroups = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);

    try {
      const user = {
        name: userDetais.user.name,
        email: userDetais.user.email,
        settlement: false,
      };
      const groups = await groupModel.find({
        $or: [
          { createrId: userDetais.user.email },
          { "member.email": userDetais.user.email },
        ],
      });
      res.status(200).json({
        success: true,
        response: groups,
        data: user,
      });
    } catch (err) {
      if (!token) {
        return res.status(400).json({
          success: false,
          response: "Please logIn",
          navigator: "/login",
        });
      }
      res.status(400).json({
        success: false,
        response: "Somthing is worng",
      });
    }
  };

  static getGroupMembers = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    try {
      const groups = await groupModel.find({
        _id: req.body.id,
      });
      if (groups.length === 0) {
        res.status(400).json({
          success: false,
          response: "Group does't exit",
        });
      } else {
        res.status(200).json({
          success: true,
          response: groups,
          data: [{ name: userDetais.user.name, email: userDetais.user.email }],
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        response: "Group does't exit",
      });
    }
  };

  static getExpense = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    try {
      const expenses = await expenseModel.find({
        $and: [
          { groupId: req.body.id },
          { "participants.email": userDetais.user.email },
        ],
      });
      res.status(200).json({
        success: true,
        response: expenses,
      });
    } catch {
      res.status(400).json({
        success: false,
        response: "Expense does't exit",
      });
    }
  };
  static getAllBills = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    try {
      const expenses = await expenseModel.find({
        "participants.email": userDetais.user.email,
      });
      res.status(200).json({
        success: true,
        response: expenses,
        data: [{ name: userDetais.user.name, email: userDetais.user.email }],
      });
    } catch {
      res.status(400).json({
        success: false,
        response: "Group does't exit",
      });
    }
  };

  static getactivitys = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    try {
      const groups = await eventModel.find({
        $or: [
          { eventCreater: userDetais.user.email },
          { "eventReciver.email": userDetais.user.email },
        ],
      });
      res.status(200).json({
        success: true,
        response: groups,
        data: { name: userDetais.user.name, email: userDetais.user.email },
      });
    } catch (err) {
      if (!token) {
        return res.status(400).json({
          success: false,
          response: "Please logIn",
          navigator: "/login",
        });
      }
      res.status(400).json({
        success: false,
        response: "Somthing is worng",
      });
    }
  };
}

export default responseController;
