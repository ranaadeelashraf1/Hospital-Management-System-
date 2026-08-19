import "dotenv/config";
import app from "./src/app.js";
import { prisma } from "./src/config/db.js";
import { connectMongo } from "./src/config/mongo.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected.");

    await connectMongo();

    app.listen(PORT, () => {
      console.log(`MediCare API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
