import { db } from "../lib/firebaseAdmin.js";
import admin from "firebase-admin";

export default async function handler(req, res) {
  const { telegramId, code } = req.body;

  const taskSnap = await db.collection("tasks")
    .where("verifyCode", "==", code)
    .where("active", "==", true)
    .get();

  if (taskSnap.empty) {
    return res.json({ error: "Invalid Code" });
  }

  const taskDoc = taskSnap.docs[0];
  const task = taskDoc.data();

  const completeRef = db.collection("completedTasks")
    .doc(telegramId + "_" + code);

  const already = await completeRef.get();
  if (already.exists) {
    return res.json({ error: "Already Used" });
  }

  await db.collection("users").doc(telegramId).update({
    balancePoints: admin.firestore.FieldValue.increment(task.rewardPoints)
  });

  await completeRef.set({
    telegramId,
    code,
    createdAt: new Date()
  });

  res.json({ success: true });
}
