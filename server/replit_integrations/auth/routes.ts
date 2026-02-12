import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { db } from "../../db";
import { userTiers, users } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export function registerAuthRoutes(app: Express): void {
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const [tier] = await db.select().from(userTiers).where(eq(userTiers.userId, userId));
      
      res.json({
        ...user,
        tier: tier?.tier || "free",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = req.user.claims.sub;
      const currentUser = await authStorage.getUser(currentUserId);

      if (!currentUser || currentUser.role !== "super_admin") {
        return res.status(404).json({ message: "Not found" });
      }

      const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
      const allTiers = await db.select().from(userTiers);
      const tierMap = new Map(allTiers.map(t => [t.userId, t]));

      const usersWithTiers = allUsers.map(user => ({
        ...user,
        tier: tierMap.get(user.id)?.tier || "free",
        pinLimit: tierMap.get(user.id)?.pinLimit || 3,
      }));

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentSignups = allUsers.filter(u => u.createdAt && new Date(u.createdAt) >= sevenDaysAgo).length;

      const stats = {
        totalUsers: allUsers.length,
        freeUsers: usersWithTiers.filter(u => u.tier === "free").length,
        premiumUsers: usersWithTiers.filter(u => u.tier === "premium").length,
        recentSignups,
      };

      res.json({ users: usersWithTiers, stats });
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
}
