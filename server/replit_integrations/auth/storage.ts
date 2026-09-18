import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../../db";
import { eq } from "drizzle-orm";

const SUPER_ADMIN_EMAILS = new Set([
  "richard@humanelement.agency",
]);

// Interface for auth storage operations
// (IMPORTANT) These user operations are mandatory for Replit Auth.
export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const { role, ...updateData } = userData;
    const shouldPromote =
      typeof userData.email === "string" &&
      SUPER_ADMIN_EMAILS.has(userData.email.toLowerCase());
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        ...(shouldPromote ? { role: "super_admin" } : {}),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...updateData,
          ...(shouldPromote ? { role: "super_admin" } : {}),
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
}

export const authStorage = new AuthStorage();
