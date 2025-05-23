import groupModel from "../../model/groupSchema.js";
import eventModel from "../../model/userActivitySchema.js";
import { verifyToken } from "../../token/jwtToken.js";

const createGroups = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetais = verifyToken(token);
    if (!token)
      return res.status(400).json({
        success: false,
        response: "Token not found",
      });
    const createrDetails = {
      name: userDetais.user.name,
      email: userDetais.user.email,
      settlement: false,
    };
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
      eventMessage: `${createrDetails.name} created the group "${groupName}"`,
      eventReciver: member,
      groupType: groupType,
      time: new Date(),
    });
    const result = await docs.save();
    const event = await events.save();
    res.status(201).json({
      status: true,
      message: "Group Created Successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "Server error",
    });
    console.log("error while creating a group", err);
  }
};

export default createGroups;
