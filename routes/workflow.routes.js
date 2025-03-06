import { Router } from "express";
const workflowRouter = Router();
import {sendReminders} from '../controllers/workflow.controller.js'

workflowRouter.post('/subscription/reminder', sendReminders);

export default workflowRouter;