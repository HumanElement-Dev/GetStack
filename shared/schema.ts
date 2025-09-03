import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const detectionRequests = pgTable("detection_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domain: text("domain").notNull(),
  isWordPress: boolean("is_wordpress"),
  wordPressVersion: text("wordpress_version"),
  theme: text("theme"),
  pluginCount: text("plugin_count"),
  technologies: text("technologies").array(),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDetectionRequestSchema = createInsertSchema(detectionRequests).omit({
  id: true,
  createdAt: true,
});

export const detectionRequestSchema = z.object({
  domain: z.string().min(1, "Domain is required").refine(
    (domain) => {
      // Allow domains with or without protocol
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      return urlPattern.test(domain);
    },
    "Please enter a valid domain or URL"
  ),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDetectionRequest = z.infer<typeof insertDetectionRequestSchema>;
export type DetectionRequest = typeof detectionRequests.$inferSelect;
export type DetectionRequestInput = z.infer<typeof detectionRequestSchema>;
