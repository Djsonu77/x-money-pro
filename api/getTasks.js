import { db } from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  const snapshot = await db.collection("tasks")
    .where("active", "==", true)
    .get();

  let tasks = [];
  snapshot.forEach(doc => {
    tasks.push(doc.data());
  });

  res.json(tasks);
}
