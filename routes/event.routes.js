import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createEvent).get(getEvents);
router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);

export default router;
