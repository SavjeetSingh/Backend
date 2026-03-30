import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createCalendar,
  getMyCalendars,
  getCalendar,
  updateCalendar,
  deleteCalendar,
  shareCalendar,
  updateSharePermission,
  removeShare,
  getSharedWithMe,
} from "../controllers/calendar.controller.js";

const router = express.Router();

router.use(protect);

router.get("/shared", getSharedWithMe);
router.route("/").post(createCalendar).get(getMyCalendars);
router
  .route("/:id")
  .get(getCalendar)
  .patch(updateCalendar)
  .delete(deleteCalendar);
router.route("/:id/share").post(shareCalendar);
router
  .route("/:id/share/:userId")
  .patch(updateSharePermission)
  .delete(removeShare);

export default router;
