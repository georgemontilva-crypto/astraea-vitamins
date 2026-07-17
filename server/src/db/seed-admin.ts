// Run with: ADMIN_EMAIL=you@astraea.com ADMIN_PASSWORD=... tsx server/src/db/seed-admin.ts
// or:       tsx server/src/db/seed-admin.ts you@astraea.com yourPassword123
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client.js";
import { users } from "./schema.js";
import { hashPassword } from "../lib/auth.js";

async function main() {
  const email = process.env.ADMIN_EMAIL ?? process.argv[2];
  const password = process.env.ADMIN_PASSWORD ?? process.argv[3];

  if (!email || !password) {
    console.error("Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... tsx server/src/db/seed-admin.ts");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });

  if (existing) {
    await db.update(users).set({ role: "admin", passwordHash }).where(eq(users.id, existing.id));
    console.log(`Promoted existing user ${email} to admin.`);
  } else {
    await db.insert(users).values({ email, passwordHash, role: "admin" });
    console.log(`Created admin user ${email}.`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
