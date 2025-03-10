import admin from "firebase-admin";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";

config();

const serviceAccountPath = resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
