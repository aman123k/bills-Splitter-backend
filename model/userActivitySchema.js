import mongoose from "mongoose";

const userActivitySchema = mongoose.Schema({
  eventCreater: { type: Array, required: true, trim: true },
  eventMessage: { type: String, required: true, trim: true },
  eventReciver: { type: Array, required: true, trim: true },
  groupType: { type: String, requied: true },
  time: { type: String, required: true },
});

const eventModel = mongoose.model("event", userActivitySchema);

export default eventModel;
