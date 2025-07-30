import groupModel from "../../model/groupSchema.js";
import eventModel from "../../model/userActivitySchema.js";
import { verifyToken } from "../../token/jwtToken.js";

const createGroups = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    if (!token)
      return res.status(400).json({
        success: false,
        response: "Token not found",
      });
    const creatorDetails = {
      name: userDetails.user.name,
      email: userDetails.user.email,
      settlement: false,
    };

    const { groupName, members, groupType } = req.body;
    members.unshift(creatorDetails);

    const docs = groupModel({
      groupName: groupName,
      members: members,
      groupType: groupType,
      creatorId: userDetails.user._id,
      time: new Date(),
    });
    const events = eventModel({
      eventCreator: creatorDetails,
      eventMessage: `${creatorDetails.name} created the group "${groupName}"`,
      eventReceiver: members,
      groupType: groupType,
      time: new Date(),
    });
    const result = await docs.save();
    const event = await events.save();
    res.status(201).json({
      status: true,
      message: "Group Created successfully",
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
