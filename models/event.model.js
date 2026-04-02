import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    calendarId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Calendar",
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isAllDay: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["confirmed", "tentative", "cancelled"],
      default: "confirmed",
    },
    recurrence: {
      rule: String,
      endDate: Date,
    },
    parentEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    attendees: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        email: String,
        responseStatus: {
          type: String,
          enum: ["pending", "accepted", "declined", "tentative"],
          default: "pending",
        },
      },
    ],
    reminders: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        minutesBefore: Number,
        method: { type: String, enum: ["email", "push"] },
      },
    ],
  },
  { timestamps: true },
);

eventSchema.index({ calendarId: 1 });
eventSchema.index({ creatorId: 1 });
eventSchema.index({ startTime: 1, endTime: 1 });
eventSchema.index({ "attendees.userId": 1 });

export default mongoose.model("Event", eventSchema);
