import groupModel from "../model/groupSchema.js";
import eventModel from "../model/userActivitySchema.js";
import expenseModel from "../model/expenseSchema.js";
import { verifyToken } from "../token/jwtToken.js";

class groupController {
  static createGroups = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    const createrDetails = {
      name: userDetais.user.name,
      email: userDetais.user.email,
      settlement: false,
    };
    try {
      const { groupName, member, groupType } = req.body;
      member.push(createrDetails);
      const docs = groupModel({
        groupName: groupName,
        member: member,
        groupType: groupType,
        createrId: userDetais.user.email,
        time: new Date(),
      });
      const events = eventModel({
        eventCreater: createrDetails,
        eventMessage: `created a group "${groupName}"`,
        eventReciver: member,
        groupType: groupType,
        time: new Date(),
      });
      const result = await docs.save();
      const event = await events.save();
      res.status(201).json({
        success: true,
        response: "Group Created Successfully",
      });
    } catch (err) {
      if (!token) {
        return res.status(400).json({
          success: false,
          response: "Token not found",
        });
      }
      res.status(400).json({
        success: false,
        response: "Somthing is worng",
      });
    }
  };
  static createExpense = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    try {
      const { expenseName, amount, upiId, participants, groupId } = req.body;
      const group = await groupModel.find({ _id: groupId });
      const creater = {
        name: userDetais.user.name,
        email: userDetais.user.email,
        settlement: false,
      };
      participants.push(creater);
      const docs = expenseModel({
        expenseName: expenseName,
        amount: amount,
        upiId: upiId,
        participants: participants,
        createrId: userDetais.user.email,
        groupId: groupId,
      });
      const events = eventModel({
        eventCreater: creater,
        eventMessage: `created an expense "${expenseName}" in the group "${group[0].groupName}"`,
        eventReciver: participants,
        groupType: "expense",
        time: new Date(),
      });
      const result = await docs.save();
      const event = await events.save();
      res.status(201).json({
        success: true,
        response: "Expense Created Successfully",
      });
    } catch {
      res.status(400).json({
        success: false,
        response: "somthing want worng",
      });
    }
  };
  static deleteGroup = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    const id = req.params.id;

    try {
      const group = await groupModel.find({ _id: id });
      const expenseName = await expenseModel.deleteMany({
        groupId: id,
      });
      const groupName = await groupModel.findByIdAndDelete(id);
      if (expenseName.deletedCount !== 0 && groupName) {
        const events = eventModel({
          eventCreater: [
            { name: userDetais.user.name, email: userDetais.user.email },
          ],
          eventMessage: `delete all expenses in the group "${group[0].groupName}"`,
          eventReciver: group[0].member,
          groupType: "expense",
          time: new Date(),
        });
        const Events = eventModel({
          eventCreater: [
            { name: userDetais.user.name, email: userDetais.user.email },
          ],
          eventMessage: `deleted a group "${group[0].groupName}"`,
          eventReciver: group[0].member,
          groupType: group[0].groupType,
          time: new Date(),
        });
        const event = await events.save();
        const Event = await Events.save();
        res.status(201).json({
          success: true,
          response: "Group & Expense deleted Successfully",
        });
      } else if (groupName) {
        const Events = eventModel({
          eventCreater: [
            { name: userDetais.user.name, email: userDetais.user.email },
          ],
          eventMessage: `deleted a group "${group[0].groupName}"`,
          eventReciver: group[0].member,
          groupType: group[0].groupType,
          time: new Date(),
        });
        const event = await Events.save();
        res.status(201).json({
          success: true,
          response: "Group deleted Successfully",
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        response: "somthing want worng",
      });
    }
  };
  static deleteExpense = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    const id = req.params.id;
    const groupId = req.body.groupId;
    try {
      const group = await groupModel.find({ _id: groupId });
      const expenseName = await expenseModel.findOneAndDelete({
        $or: [{ groupId: groupId }, { _id: id }],
      });
      const doc = eventModel({
        eventCreater: [
          { name: userDetais.user.name, email: userDetais.user.email },
        ],
        eventMessage: `delete an expense "${expenseName.expenseName}" in the group "${group[0].groupName}"`,
        eventReciver: group[0].member,
        groupType: "expense",
        time: new Date(),
      });
      const event = await doc.save();
      res.status(201).json({
        success: true,
        response: "Expense deleted Successfully",
      });
    } catch {
      res.status(400).json({
        success: false,
        response: "somthing want worng",
      });
    }
  };
  static settlement = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    const email = req.params.email;

    try {
      const settlementExpense = await expenseModel.findOneAndUpdate(
        {
          $and: [
            { _id: req.body.id },
            {
              "participants.email": email,
            },
          ],
        },
        { $set: { "participants.$.settlement": true } },
        { returnDocument: "after" }
      );
      const result = await settlementExpense.save();

      const creater = result.participants.find((participant) => {
        return participant.email === email;
      });
      const reciver = result.participants.find((participant) => {
        return participant.email === result.createrId;
      });
      const Events = eventModel({
        eventCreater: [{ name: creater.name, email: email }],
        eventMessage: ` paid "${Math.round(
          result.amount / result.participants.length
        )}" to ${
          creater.name === userDetais.user.name ? " You" : reciver.name
        } `,
        eventReciver: [
          creater,
          { name: userDetais.user.name, email: userDetais.user.email },
        ],
        groupType: "payment",
        time: new Date(),
      });
      const event = await Events.save();

      res.status(200).json({
        success: true,
        response: "Payment settled Successfully",
      });
    } catch {
      console.log("not delete");
      res.status(400).json({
        success: false,
        response: "somthing want worng",
      });
    }
  };
}

export default groupController;
