import mongoose from "mongoose";

const useractivitychema = mongoose.Schema({
  eventCreator: { type: Array, required: true, trim: true },
  eventMessage: { type: String, required: true, trim: true },
  eventReceiver: { type: Array, required: true, trim: true },
  groupType: { type: String, required: true },
  time: { type: String, required: true },
});

const eventModel = mongoose.model("event", useractivitychema);

export default eventModel;
