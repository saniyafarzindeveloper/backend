import dayjs from "dayjs";
// import { serve } from "@upstash/workflow/express";
import Subscription from "../models/subscription.model.js";

const REMINDERS = [7, 5, 2, 1];

import {createRequire} from 'module';
const require = createRequire(import.meta.url)
const {serve} = require('@upstash/workflow/express');

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload; //when workflow will be triggered subscriptionId will be passed
  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  //expired subscription
  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for ${subscriptionId}. Stopping workflow!`
    );
    return;
  }
  //when the subscription is about to expire
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");
    console.log(`Checking reminder for ${daysBefore} days before:`, reminderDate.format());
  
    if (reminderDate.isAfter(dayjs())) {
      await sleepUntillReminder(
        context,
        `Reminder - ${daysBefore} days left before subscription ends`,
        reminderDate
      );
    }
  
    // Correct function argument order
    await triggerReminder(`Reminder - ${daysBefore} days left!`, context);
  }
  
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email"); //populate name & email of the user
  });
};

//sleeping function wont be triggered until reminder date is close
const sleepUntillReminder = async (context, label, date) => {
  console.log(`Sleeping untill ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (label, context) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder`);
    //send SMS, EMAIL , PUSH NOTIFICATION
  });
};
