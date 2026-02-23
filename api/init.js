import { db } from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { telegramId, username } = req.body;

  const userRef = db.collection("users").doc(telegramId);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      telegramId,
      username,
      balancePoints: 0,
      totalEarned: 0,
      createdAt: new Date()
    });
  }

  res.json({ success: true });
}
