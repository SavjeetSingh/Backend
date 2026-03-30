import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    sharedWith: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Calendar", calendarSchema);
