import groupModel from "../../model/groupSchema.js";
import eventModel from "../../model/activitySchema.js";
import { verifyToken } from "../../token/jwtToken.js";
import MESSAGES from "../../variable/variable.js";

const createGroups = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const userDetails = verifyToken(token);
    if (!token)
      return res.status(400).json({
        success: false,
        response: MESSAGES.TOKEN_NOT_FOUND,
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

    const result = await docs.save();

    res.status(201).json({
      status: true,
      message: MESSAGES.GROUP_CREATED,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: MESSAGES.SERVER_ERROR,
    });
    console.log("error while creating a group", err);
  }
};

export default createGroups;
