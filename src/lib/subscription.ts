import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { userSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";


const DAY_IN_MS = 1000 * 60 * 60 * 24
export const checkSubscription = async () => {
  const { userId } = await auth();
  if (!userId) {
    return false
  }

  const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId))

  if(!_userSubscriptions[0]) {
    return false
  }

  const userSubscription = _userSubscriptions[0]
  // TODO: 判断是否过期
  const isValid = userSubscriptions.stripePriceId && userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

  if(isValid) {
    console.log("This account is Vlid");
  }
  
  return !!isValid;
}