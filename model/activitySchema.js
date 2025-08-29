import mongoose from "mongoose";

const activitySchema = mongoose.Schema({
  message: { type: String, required: true, trim: true },

  expenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "expense",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  splitBetween: {
    type: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        settlement: { type: Boolean, required: true },
        amount: { type: Number, required: true },
      },
    ],
  },
  activityType: { type: String, required: true, trim: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const activityModal = mongoose.model("activity", activitySchema);

export default activityModal;
