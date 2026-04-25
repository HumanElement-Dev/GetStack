import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { registerStripeRoutes } from "./stripeRoutes";
import { WebhookHandlers } from "./webhookHandlers";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Register Stripe webhook route BEFORE express.json() — it needs raw Buffer
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }
    const sig = Array.isArray(signature) ? signature[0] : signature;
    try {
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error.message);
      res.status(400).json({ error: "Webhook processing error" });
    }
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sitemap
app.get("/sitemap.xml", (_req, res) => {
  const base = "https://getstack.app";
  const pages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/detect", priority: "0.9", changefreq: "weekly" },
    { url: "/pricing", priority: "0.7", changefreq: "monthly" },
  ];
  const urls = pages.map(({ url, priority, changefreq }) => `
  <url>
    <loc>${base}${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("");
  res.header("Content-Type", "application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`);
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Initialize Stripe schema on startup (non-blocking — server starts even if Stripe isn't configured)
async function initStripe() {
  try {
    const { runMigrations } = await import("stripe-replit-sync");
    const { getStripeSync } = await import("./stripeClient");
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) return;

    await runMigrations({ databaseUrl });
    log("Stripe schema ready");

    const stripeSync = await getStripeSync();
    const domains = process.env.REPLIT_DOMAINS?.split(",");
    if (domains?.[0]) {
      const webhookBaseUrl = `https://${domains[0]}`;
      await stripeSync.findOrCreateManagedWebhook(`${webhookBaseUrl}/api/stripe/webhook`);
      log("Stripe webhook configured");
    }

    stripeSync.syncBackfill().then(() => {
      log("Stripe data synced");
    }).catch((err: any) => {
      console.error("Stripe sync error:", err.message);
    });
  } catch (err: any) {
    // Stripe not configured yet — server continues without it
    if (!err.message?.includes("not configured")) {
      console.warn("Stripe init skipped:", err.message);
    }
  }
}

(async () => {
  // Register application routes (auth, detection, pinned sites, etc.)
  const server = await registerRoutes(app);

  // Register Stripe routes
  registerStripeRoutes(app);

  // Initialize Stripe in background (non-blocking)
  initStripe();

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
