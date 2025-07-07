import groupModel from "../model/groupSchema.js";
import eventModel from "../model/userActivitySchema.js";
import expenseModel from "../model/expenseSchema.js";
import { verifyToken } from "../token/jwtToken.js";

class groupController {
  static createGroups = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    const creatorDetails = {
      name: userDetails.user.name,
      email: userDetails.user.email,
      settlement: false,
    };
    try {
      const { groupName, member, groupType } = req.body;
      member.push(creatorDetails);
      const docs = groupModel({
        groupName: groupName,
        member: member,
        groupType: groupType,
        creatorId: userDetails.user.email,
        time: new Date(),
      });
      const events = eventModel({
        eventCreator: creatorDetails,
        eventMessage: `created a group "${groupName}"`,
        eventReceiver: member,
        groupType: groupType,
        time: new Date(),
      });
      const result = await docs.save();
      const event = await events.save();
      res.status(201).json({
        success: true,
        response: "Group Created successfullyy",
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
        response: "Something is wrong",
      });
    }
  };
  static createExpense = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    try {
      const { expenseName, amount, upiId, participants, groupId } = req.body;
      const group = await groupModel.find({ _id: groupId });
      const creator = {
        name: userDetails.user.name,
        email: userDetails.user.email,
        settlement: false,
      };
      participants.push(creator);
      const docs = expenseModel({
        expenseName: expenseName,
        amount: amount,
        upiId: upiId,
        participants: participants,
        creatorId: userDetails.user.email,
        groupId: groupId,
      });
      const events = eventModel({
        eventCreator: creator,
        eventMessage: `created an expense "${expenseName}" in the group "${group[0].groupName}"`,
        eventReceiver: participants,
        groupType: "expense",
        time: new Date(),
      });
      const result = await docs.save();
      const event = await events.save();
      res.status(201).json({
        success: true,
        response: "Expense Created successfullyy",
      });
    } catch {
      res.status(400).json({
        success: false,
        response: "Something is wrong",
      });
    }
  };
  static deleteGroup = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    const id = req.params.id;

    try {
      const group = await groupModel.find({ _id: id });
      const expenseName = await expenseModel.deleteMany({
        groupId: id,
      });
      const groupName = await groupModel.findByIdAndDelete(id);
      if (expenseName.deletedCount !== 0 && groupName) {
        const events = eventModel({
          eventCreator: [
            { name: userDetails.user.name, email: userDetails.user.email },
          ],
          eventMessage: `delete all expenses in the group "${group[0].groupName}"`,
          eventReceiver: group[0].member,
          groupType: "expense",
          time: new Date(),
        });
        const Events = eventModel({
          eventCreator: [
            { name: userDetails.user.name, email: userDetails.user.email },
          ],
          eventMessage: `deleted a group "${group[0].groupName}"`,
          eventReceiver: group[0].member,
          groupType: group[0].groupType,
          time: new Date(),
        });
        const event = await events.save();
        const Event = await Events.save();
        res.status(201).json({
          success: true,
          response: "Group & Expense deleted successfullyy",
        });
      } else if (groupName) {
        const Events = eventModel({
          eventCreator: [
            { name: userDetails.user.name, email: userDetails.user.email },
          ],
          eventMessage: `deleted a group "${group[0].groupName}"`,
          eventReceiver: group[0].member,
          groupType: group[0].groupType,
          time: new Date(),
        });
        const event = await Events.save();
        res.status(201).json({
          success: true,
          response: "Group deleted successfullyy",
        });
      }
    } catch {
      res.status(400).json({
        success: false,
        response: "Something is wrong",
      });
    }
  };
  static deleteExpense = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    const id = req.params.id;
    const groupId = req.body.groupId;
    try {
      const group = await groupModel.find({ _id: groupId });
      const expenseName = await expenseModel.findOneAndDelete({
        $or: [{ groupId: groupId }, { _id: id }],
      });
      const doc = eventModel({
        eventCreator: [
          { name: userDetails.user.name, email: userDetails.user.email },
        ],
        eventMessage: `delete an expense "${expenseName.expenseName}" in the group "${group[0].groupName}"`,
        eventReceiver: group[0].member,
        groupType: "expense",
        time: new Date(),
      });
      const event = await doc.save();
      res.status(201).json({
        success: true,
        response: "Expense deleted successfullyy",
      });
    } catch {
      res.status(400).json({
        success: false,
        response: "Something is wrong",
      });
    }
  };
  static settlement = async (req, res) => {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
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

      const creator = result.participants.find((participant) => {
        return participant.email === email;
      });
      const receiver = result.participants.find((participant) => {
        return participant.email === result.creatorId;
      });
      const Events = eventModel({
        eventCreator: [{ name: creator.name, email: email }],
        eventMessage: ` paid "${Math.round(
          result.amount / result.participants.length
        )}" to ${
          creator.name === userDetails.user.name ? " You" : receiver.name
        } `,
        eventReceiver: [
          creator,
          { name: userDetails.user.name, email: userDetails.user.email },
        ],
        groupType: "payment",
        time: new Date(),
      });
      const event = await Events.save();

      res.status(200).json({
        success: true,
        response: "Payment settled successfullyy",
      });
    } catch {
      console.log("not delete");
      res.status(400).json({
        success: false,
        response: "Something is wrong",
      });
    }
  };
}

export default groupController;
