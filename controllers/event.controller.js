import Event from "../models/event.model.js";
import Calendar from "../models/calendar.model.js";

// Check if user has access to calendar (owner or shared write)
const hasCalendarAccess = async (calendarId, userId, requireWrite = false) => {
  const calendar = await Calendar.findById(calendarId);
  if (!calendar) return null;

  if (calendar.ownerId.toString() === userId.toString()) return calendar;

  const share = calendar.sharedWith.find(
    (s) => s.userId.toString() === userId.toString(),
  );
  if (!share) return null;
  if (requireWrite && share.permission !== "write") return null;

  return calendar;
};

export const createEvent = async (req, res) => {
  const { calendarId, title, description, location, startTime, endTime, isAllDay, status } = req.body;

  const calendar = await hasCalendarAccess(calendarId, req.user.id, true);
  if (!calendar) return res.error("Calendar not found or no write access", 403);

  const event = await Event.create({
    calendarId,
    creatorId: req.user.id,
    title,
    description,
    location,
    startTime,
    endTime,
    isAllDay,
    status,
  });

  res.success(event, 201);
};

export const getEvents = async (req, res) => {
  const { calendarId, start, end } = req.query;

  const filter = {};

  if (calendarId) {
    const calendar = await hasCalendarAccess(calendarId, req.user.id);
    if (!calendar) return res.error("Calendar not found or no access", 403);
    filter.calendarId = calendarId;
  } else {
    // Get all calendars user owns or has access to
    const ownedCalendars = await Calendar.find({ ownerId: req.user.id }).select("_id");
    const sharedCalendars = await Calendar.find({ "sharedWith.userId": req.user.id }).select("_id");
    const calendarIds = [
      ...ownedCalendars.map((c) => c._id),
      ...sharedCalendars.map((c) => c._id),
    ];
    filter.calendarId = { $in: calendarIds };
  }

  if (start || end) {
    filter.startTime = {};
    if (start) filter.startTime.$gte = new Date(start);
    if (end) filter.startTime.$lte = new Date(end);
  }

  const events = await Event.find(filter).sort({ startTime: 1 });
  res.success(events);
};

export const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.error("Event not found", 404);

  const calendar = await hasCalendarAccess(event.calendarId, req.user.id);
  if (!calendar) return res.error("No access to this event", 403);

  res.success(event);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.error("Event not found", 404);

  const calendar = await hasCalendarAccess(event.calendarId, req.user.id, true);
  if (!calendar) return res.error("No write access to this event", 403);

  const allowed = ["title", "description", "location", "startTime", "endTime", "isAllDay", "status", "recurrence"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const updated = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.success(updated);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.error("Event not found", 404);

  const calendar = await hasCalendarAccess(event.calendarId, req.user.id, true);
  if (!calendar) return res.error("No write access to this event", 403);

  await Event.findByIdAndDelete(req.params.id);
  res.success({ message: "Event deleted" });
};
