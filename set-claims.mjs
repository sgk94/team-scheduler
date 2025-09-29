import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "node:fs";

const sa = JSON.parse(fs.readFileSync("./secrets/serviceAccount.json", "utf8"));
initializeApp({ credential: cert(sa) });

async function setSchedulerByEmail(email, enable = true) {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  const current = user.customClaims || {};
  const next = { ...current };

  if (enable) next.scheduler = true;
  else delete next.scheduler; // remove the key without nuking others

  await auth.setCustomUserClaims(user.uid, next);
  console.log(
    `${enable ? "Set" : "Removed"} scheduler for ${email} (uid: ${user.uid})`
  );
}

const args = process.argv.slice(2);
if (!args.length) {
  console.log(
    "Usage: node set-claims.mjs user1@example.com [user2@...] [--unset]"
  );
  process.exit(1);
}
const unset = args.includes("--unset");
const emails = args.filter((a) => a !== "--unset");

for (const email of emails) {
  try {
    await setSchedulerByEmail(email, !unset);
  } catch (e) {
    console.error(`Failed for ${email}:`, e);
    process.exitCode = 1;
  }
}
