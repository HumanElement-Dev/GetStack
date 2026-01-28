import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models (users and sessions tables)
export * from "./models/auth";

// User tiers for subscription management
export const userTiers = pgTable("user_tiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  tier: varchar("tier", { length: 20 }).notNull().default("free"), // 'free' | 'premium'
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active' | 'cancelled' | 'past_due'
  currentPeriodEnd: timestamp("current_period_end"),
  pinLimit: integer("pin_limit").default(3), // Free users get 3 pins
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pinned websites for dashboard users
export const pinnedSites = pgTable("pinned_sites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  domain: text("domain").notNull(),
  name: text("name"),
  cmsType: text("cms_type"),
  lastChecked: timestamp("last_checked"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pluginSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string(),
  color: z.string(),
  version: z.string().optional(),
  dependencies: z.array(z.string()),
  parent: z.string().nullable(),
  wpOrgUrl: z.string().optional(),
});

export type Plugin = z.infer<typeof pluginSchema>;

export const themeInfoSchema = z.object({
  name: z.string(),
  themeUri: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  authorUri: z.string().optional(),
  version: z.string().optional(),
  license: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isChildTheme: z.boolean().optional(),
  parentTheme: z.string().optional(),
  parentThemeInfo: z.object({
    name: z.string(),
    themeUri: z.string().optional(),
    author: z.string().optional(),
    authorUri: z.string().optional(),
    version: z.string().optional(),
  }).optional(),
  screenshot: z.string().optional(),
  wpOrgUrl: z.string().optional(),
});

export type ThemeInfo = z.infer<typeof themeInfoSchema>;

export const detectionRequests = pgTable("detection_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domain: text("domain").notNull(),
  cmsType: text("cms_type"), // 'wordpress', 'wix', or null
  isWordPress: boolean("is_wordpress"), // keeping for backward compatibility
  wordPressVersion: text("wordpress_version"),
  theme: text("theme"),
  themeInfo: jsonb("theme_info").$type<ThemeInfo>(),
  pluginCount: text("plugin_count"),
  plugins: jsonb("plugins").$type<Plugin[]>(),
  technologies: text("technologies").array(),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserTierSchema = createInsertSchema(userTiers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPinnedSiteSchema = createInsertSchema(pinnedSites).omit({
  id: true,
  createdAt: true,
});

export const insertDetectionRequestSchema = createInsertSchema(detectionRequests).omit({
  id: true,
  createdAt: true,
});

export const detectionRequestSchema = z.object({
  domain: z.string().min(1, "Domain is required").refine(
    (domain) => {
      // Clean up the input first
      const cleanDomain = domain.trim();
      
      // Allow a wide variety of URL formats:
      // - Plain domains: example.com, subdomain.example.com
      // - With www: www.example.com
      // - With protocol: http://example.com, https://example.com
      // - With paths: example.com/path, https://example.com/path
      const urlPattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.([a-zA-Z]{2,})([\/\w\.\-~:?#@!$&'()*+,;=]*)?$/i;
      
      return urlPattern.test(cleanDomain) && cleanDomain.includes('.');
    },
    "Please enter a valid domain or URL (e.g., example.com, www.example.com, https://example.com)"
  ),
});

export type InsertUserTier = z.infer<typeof insertUserTierSchema>;
export type UserTier = typeof userTiers.$inferSelect;
export type InsertPinnedSite = z.infer<typeof insertPinnedSiteSchema>;
export type PinnedSite = typeof pinnedSites.$inferSelect;
export type InsertDetectionRequest = z.infer<typeof insertDetectionRequestSchema>;
export type DetectionRequest = typeof detectionRequests.$inferSelect;
export type DetectionRequestInput = z.infer<typeof detectionRequestSchema>;
