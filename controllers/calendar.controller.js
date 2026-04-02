import Calendar from "../models/calendar.model.js";

// calendar CRUD
export const createCalendar = async (req, res) => {
  const { name, color, isDefault } = req.body;
  const calendar = await Calendar.create({
    name,
    color,
    isDefault,
    ownerId: req.user.id,
  });

  res.success(calendar, 201);
};

export const getMyCalendars = async (req, res) => {
  const calendars = await Calendar.find({ ownerId: req.user.id });
  res.success(calendars);
};

export const getCalendar = async (req, res) => {
  const calendar = await Calendar.findById(req.params.id);
  if (!calendar) return res.error("calendar not found", 404);
  res.success(calendar);
};

export const updateCalendar = async (req, res) => {
  const calendar = await Calendar.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.id },
    req.body,
    { new: true },
  );
  if (!calendar) return res.error("calendar not found", 404);
  res.success(calendar);
};

export const deleteCalendar = async (req, res) => {
  const calendar = await Calendar.findOneAndDelete({
    _id: req.params.id,
    ownerId: req.user.id,
  });
  if (!calendar) return res.error("calendar not found", 404);
  res.success({ message: "Calendar Deleted" });
};

// calendar sharing

export const shareCalendar = async (req, res) => {
  const { userId, permission } = req.body;
  const calendar = await Calendar.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.id },
    { $push: { sharedWith: { userId, permission } } },
    { new: true },
  );
  if (!calendar) return res.error("calendar not found", 404);
  res.success(calendar);
};

export const updateSharePermission = async (req, res) => {
  const calendar = await Calendar.findOneAndUpdate(
    {
      _id: req.params.id,
      ownerId: req.user.id,
      "sharedWith.userId": req.params.userId,
    },
    { $set: { "sharedWith.$.permission": req.body.permission } },
    { new: true },
  );
  if (!calendar) return res.error("calendar not found", 404);
  res.success(calendar);
};

export const removeShare = async (req, res) => {
  const calendar = await Calendar.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.id },
    { $pull: { sharedWith: { userId: req.params.userId } } },
    { new: true },
  );
  if (!calendar) return res.error("calendar not found", 404);
  res.success(calendar);
};

export const getSharedWithMe = async (req, res) => {
  const calendars = await Calendar.find({ "sharedWith.userId": req.user.id });
  res.success(calendars);
};
