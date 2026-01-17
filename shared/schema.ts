import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDetectionRequest = z.infer<typeof insertDetectionRequestSchema>;
export type DetectionRequest = typeof detectionRequests.$inferSelect;
export type DetectionRequestInput = z.infer<typeof detectionRequestSchema>;
