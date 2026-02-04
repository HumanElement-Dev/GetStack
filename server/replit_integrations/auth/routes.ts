import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { db } from "../../db";
import { userTiers, users } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user with tier info
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await authStorage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user's tier
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

  // Admin endpoint to get all users (protected by admin check)
  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      const adminUserId = process.env.ADMIN_USER_ID;
      const currentUserId = req.user.claims.sub;

      // Check if user is admin
      if (!adminUserId || currentUserId !== adminUserId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get all users with their tier info
      const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
      const allTiers = await db.select().from(userTiers);

      // Create a map of userId to tier
      const tierMap = new Map(allTiers.map(t => [t.userId, t]));

      // Combine user data with tier info
      const usersWithTiers = allUsers.map(user => ({
        ...user,
        tier: tierMap.get(user.id)?.tier || "free",
        pinLimit: tierMap.get(user.id)?.pinLimit || 3,
      }));

      // Calculate stats
      const stats = {
        totalUsers: allUsers.length,
        freeUsers: usersWithTiers.filter(u => u.tier === "free").length,
        premiumUsers: usersWithTiers.filter(u => u.tier === "premium").length,
      };

      res.json({ users: usersWithTiers, stats });
    } catch (error) {
      console.error("Error fetching admin users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
}
