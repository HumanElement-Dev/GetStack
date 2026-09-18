import { type DetectionRequest, type InsertDetectionRequest, detectionRequests } from "@shared/schema";
import { type User, type UpsertUser as InsertUser } from "@shared/models/auth";
import { randomUUID } from "crypto";
import { desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "./db";

export interface PublicStatsItem {
  name: string;
  category: string;
  sites: number;
  share: number;
}

export interface PublicStats {
  totalScans: number;
  uniqueDomains: number;
  cmsPlatformsDetected: number;
  technologiesIdentified: number;
  updatedAt: string | null;
  cmsShare: PublicStatsItem[];
  topTechnologies: PublicStatsItem[];
  wordpressThemes: PublicStatsItem[];
  wordpressPlugins: PublicStatsItem[];
  wordpressPageBuilders: PublicStatsItem[];
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createDetectionRequest(request: InsertDetectionRequest): Promise<DetectionRequest>;
  getDetectionRequest(id: string): Promise<DetectionRequest | undefined>;
  getDetectionRequestsByDomain(domain: string): Promise<DetectionRequest[]>;
  getPublicStats(): Promise<PublicStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Current auth identities are email/provider based and no longer have usernames.
    void username;
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      id,
      email: insertUser.email ?? null,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      profileImageUrl: insertUser.profileImageUrl ?? null,
      role: insertUser.role ?? "user",
      stripeCustomerId: insertUser.stripeCustomerId ?? null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId ?? null,
      createdAt: insertUser.createdAt ?? now,
      updatedAt: insertUser.updatedAt ?? now,
    };
    this.users.set(id, user);
    return user;
  }

  async createDetectionRequest(insertRequest: InsertDetectionRequest): Promise<DetectionRequest> {
    const [request] = await db
      .insert(detectionRequests)
      .values(insertRequest as typeof detectionRequests.$inferInsert)
      .returning();
    return request;
  }

  async getDetectionRequest(id: string): Promise<DetectionRequest | undefined> {
    const [request] = await db
      .select()
      .from(detectionRequests)
      .where(eq(detectionRequests.id, id))
      .limit(1);
    return request;
  }

  async getDetectionRequestsByDomain(domain: string): Promise<DetectionRequest[]> {
    const normalizedDomain = domain.toLowerCase().trim().replace(/^www[.]/, "").replace(/[.]$/, "");
    return db
      .select()
      .from(detectionRequests)
      .where(sql`
        regexp_replace(
          regexp_replace(lower(trim(${detectionRequests.domain})), '^www[.]', ''),
          '[.]$',
          ''
        ) = ${normalizedDomain}
      `)
      .orderBy(desc(detectionRequests.createdAt));
  }

  async getPublicStats(): Promise<PublicStats> {
    const result = await db.execute(sql`
      WITH successful AS (
        SELECT
          *,
          regexp_replace(
            regexp_replace(
              split_part(
                split_part(
                  split_part(
                    regexp_replace(lower(trim(domain)), '^https?://', '', 'i'),
                    '/',
                    1
                  ),
                  '?',
                  1
                ),
                '#',
                1
              ),
              ':[0-9]+$',
              ''
            ),
            '(^www[.])|([.]$)',
            '',
            'g'
          ) AS canonical_domain
        FROM detection_requests
        WHERE error IS NULL
      ),
      latest AS (
        SELECT DISTINCT ON (canonical_domain) *
        FROM successful
        WHERE canonical_domain <> ''
        ORDER BY canonical_domain, created_at DESC NULLS LAST, id DESC
      ),
      cms_data AS (
        SELECT
          canonical_domain,
          CASE
            WHEN nullif(trim(cms_type), '') IS NOT NULL THEN lower(trim(cms_type))
            WHEN is_wordpress IS TRUE THEN 'wordpress'
            ELSE 'unknown'
          END AS cms
        FROM latest
      ),
      technology_rows AS (
        SELECT
          canonical_domain,
          CASE cms
            WHEN 'wordpress' THEN 'WordPress'
            WHEN 'shopify' THEN 'Shopify'
            WHEN 'wix' THEN 'Wix'
            WHEN 'squarespace' THEN 'Squarespace'
            WHEN 'webflow' THEN 'Webflow'
            WHEN 'joomla' THEN 'Joomla'
            WHEN 'drupal' THEN 'Drupal'
            ELSE initcap(cms)
          END AS name,
          'CMS Platform' AS category
        FROM cms_data
        WHERE cms <> 'unknown'

        UNION ALL

        SELECT
          latest.canonical_domain,
          trim(technology) AS name,
          'Web Technology' AS category
        FROM latest
        CROSS JOIN LATERAL unnest(COALESCE(latest.technologies, ARRAY[]::text[])) AS technology
        WHERE trim(technology) <> ''

        UNION ALL

        SELECT
          latest.canonical_domain,
          COALESCE(NULLIF(plugin->>'name', ''), plugin->>'slug') AS name,
          COALESCE(NULLIF(plugin->>'category', ''), 'WordPress Plugin') AS category
        FROM latest
        CROSS JOIN LATERAL jsonb_array_elements(COALESCE(latest.plugins, '[]'::jsonb)) AS plugin
        WHERE COALESCE(NULLIF(plugin->>'name', ''), plugin->>'slug') IS NOT NULL
      ),
      distinct_technology_rows AS (
        SELECT DISTINCT canonical_domain, name, category
        FROM technology_rows
      ),
      totals AS (
        SELECT
          (SELECT count(*) FROM successful) AS total_scans,
          (SELECT count(*) FROM latest) AS unique_domains,
          (SELECT count(DISTINCT cms) FROM cms_data WHERE cms <> 'unknown') AS cms_platforms,
          (SELECT count(DISTINCT lower(name)) FROM distinct_technology_rows) AS technologies,
          (SELECT max(created_at) FROM successful) AS updated_at
      ),
      cms_share AS (
        SELECT
          CASE cms
            WHEN 'wordpress' THEN 'WordPress'
            WHEN 'shopify' THEN 'Shopify'
            WHEN 'wix' THEN 'Wix'
            WHEN 'squarespace' THEN 'Squarespace'
            WHEN 'webflow' THEN 'Webflow'
            WHEN 'joomla' THEN 'Joomla'
            WHEN 'drupal' THEN 'Drupal'
            WHEN 'unknown' THEN 'Other / Unknown'
            ELSE initcap(cms)
          END AS name,
          count(*) AS sites,
          round((count(*) * 100.0 / NULLIF((SELECT unique_domains FROM totals), 0))::numeric, 1) AS share
        FROM cms_data
        GROUP BY cms
        ORDER BY sites DESC, cms
      ),
      top_technologies AS (
        SELECT
          min(name) AS name,
          min(category) AS category,
          count(DISTINCT canonical_domain) AS sites,
          round((count(DISTINCT canonical_domain) * 100.0 / NULLIF((SELECT unique_domains FROM totals), 0))::numeric, 1) AS share
        FROM distinct_technology_rows
        GROUP BY lower(name)
        ORDER BY sites DESC, name
        LIMIT 15
      ),
      wordpress_themes AS (
        SELECT
          min(COALESCE(NULLIF(theme_info->>'name', ''), theme)) AS name,
          count(*) AS sites
        FROM latest
        WHERE
          (lower(cms_type) = 'wordpress' OR is_wordpress IS TRUE)
          AND COALESCE(NULLIF(theme_info->>'name', ''), theme) IS NOT NULL
        GROUP BY lower(COALESCE(NULLIF(theme_info->>'name', ''), theme))
        ORDER BY sites DESC, name
        LIMIT 5
      ),
      wordpress_plugins AS (
        SELECT
          min(COALESCE(NULLIF(plugin->>'name', ''), plugin->>'slug')) AS name,
          min(COALESCE(NULLIF(plugin->>'category', ''), 'WordPress Plugin')) AS category,
          count(DISTINCT latest.canonical_domain) AS sites
        FROM latest
        CROSS JOIN LATERAL jsonb_array_elements(COALESCE(latest.plugins, '[]'::jsonb)) AS plugin
        WHERE
          (lower(latest.cms_type) = 'wordpress' OR latest.is_wordpress IS TRUE)
          AND COALESCE(NULLIF(plugin->>'name', ''), plugin->>'slug') IS NOT NULL
        GROUP BY lower(COALESCE(NULLIF(plugin->>'name', ''), plugin->>'slug'))
        ORDER BY sites DESC, name
        LIMIT 5
      ),
      wordpress_page_builders AS (
        SELECT
          min(COALESCE(NULLIF(plugin->>'name', ''), plugin->>'slug')) AS name,
          count(DISTINCT latest.canonical_domain) AS sites
        FROM latest
        CROSS JOIN LATERAL jsonb_array_elements(COALESCE(latest.plugins, '[]'::jsonb)) AS plugin
        WHERE
          (lower(latest.cms_type) = 'wordpress' OR latest.is_wordpress IS TRUE)
          AND (
            lower(COALESCE(plugin->>'slug', '')) SIMILAR TO '%(elementor|divi|bricks|beaver-builder|brizy|oxygen|visual-composer|wpbakery|gutenberg|siteorigin|breakdance)%'
            OR lower(COALESCE(plugin->>'name', '')) SIMILAR TO '%(elementor|divi|bricks|beaver builder|brizy|oxygen|visual composer|wpbakery|gutenberg|siteorigin|breakdance)%'
          )
        GROUP BY lower(COALESCE(NULLIF(plugin->>'name', ''), plugin->>'slug'))
        ORDER BY sites DESC, name
        LIMIT 5
      )
      SELECT json_build_object(
        'totalScans', (SELECT total_scans FROM totals),
        'uniqueDomains', (SELECT unique_domains FROM totals),
        'cmsPlatformsDetected', (SELECT cms_platforms FROM totals),
        'technologiesIdentified', (SELECT technologies FROM totals),
        'updatedAt', (SELECT updated_at FROM totals),
        'cmsShare', COALESCE((
          SELECT json_agg(json_build_object(
            'name', name,
            'category', 'CMS Platform',
            'sites', sites,
            'share', share
          ) ORDER BY sites DESC, name)
          FROM cms_share
        ), '[]'::json),
        'topTechnologies', COALESCE((
          SELECT json_agg(json_build_object(
            'name', name,
            'category', category,
            'sites', sites,
            'share', share
          ) ORDER BY sites DESC, name)
          FROM top_technologies
        ), '[]'::json),
        'wordpressThemes', COALESCE((
          SELECT json_agg(json_build_object(
            'name', name,
            'category', 'WordPress Theme',
            'sites', sites,
            'share', round((sites * 100.0 / NULLIF((SELECT count(*) FROM latest WHERE lower(cms_type) = 'wordpress' OR is_wordpress IS TRUE), 0))::numeric, 1)
          ) ORDER BY sites DESC, name)
          FROM wordpress_themes
        ), '[]'::json),
        'wordpressPlugins', COALESCE((
          SELECT json_agg(json_build_object(
            'name', name,
            'category', category,
            'sites', sites,
            'share', round((sites * 100.0 / NULLIF((SELECT count(*) FROM latest WHERE lower(cms_type) = 'wordpress' OR is_wordpress IS TRUE), 0))::numeric, 1)
          ) ORDER BY sites DESC, name)
          FROM wordpress_plugins
        ), '[]'::json),
        'wordpressPageBuilders', COALESCE((
          SELECT json_agg(json_build_object(
            'name', name,
            'category', 'Page Builder',
            'sites', sites,
            'share', round((sites * 100.0 / NULLIF((SELECT count(*) FROM latest WHERE lower(cms_type) = 'wordpress' OR is_wordpress IS TRUE), 0))::numeric, 1)
          ) ORDER BY sites DESC, name)
          FROM wordpress_page_builders
        ), '[]'::json)
      ) AS stats
    `);

    const row = result.rows[0] as { stats?: PublicStats } | undefined;
    return row?.stats ?? {
      totalScans: 0,
      uniqueDomains: 0,
      cmsPlatformsDetected: 0,
      technologiesIdentified: 0,
      updatedAt: null,
      cmsShare: [],
      topTechnologies: [],
      wordpressThemes: [],
      wordpressPlugins: [],
      wordpressPageBuilders: [],
    };
  }
}

export const storage = new MemStorage();
