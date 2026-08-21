import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import {
  wordpressDetectorFaqSchema,
  wordpressDetectorSeo,
} from "@shared/wordpress-detector-seo";

const viteLogger = createLogger();

function renderWordPressDetectorHead(template: string, requestUrl: string) {
  const pathname = new URL(requestUrl, "http://localhost").pathname;
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (normalizedPath !== wordpressDetectorSeo.path) {
    return template;
  }

  const faqSchema = JSON.stringify(wordpressDetectorFaqSchema).replace(/</g, "\\u003c");
  const seoHead = `
    <link data-rh="true" rel="canonical" href="${wordpressDetectorSeo.canonicalUrl}" />
    <script data-rh="true" type="application/ld+json">${faqSchema}</script>`;

  return template
    .replace(
      "<title>GetStack - Detect Any Website's CMS Instantly</title>",
      `<title data-rh="true">${wordpressDetectorSeo.title}</title>`,
    )
    .replace(
      'content="See the full tech stack behind any website. Detect CMS, themes, plugins, JS frameworks, hosting, and more in seconds — free, no account required."',
      `content="${wordpressDetectorSeo.description}"`,
    )
    .replace('name="description"', 'data-rh="true" name="description"')
    .replace(
      '<meta property="og:title" content="GetStack - Detect Any Website\'s CMS Instantly" />',
      `<meta data-rh="true" property="og:title" content="${wordpressDetectorSeo.title}" />`,
    )
    .replace(
      '<meta property="og:description" content="See the full tech stack behind any website. Detect CMS, themes, plugins, JS frameworks, hosting, and more in seconds — free, no account required." />',
      `<meta data-rh="true" property="og:description" content="${wordpressDetectorSeo.ogDescription}" />`,
    )
    .replace(
      '<meta property="og:type" content="website" />',
      '<meta data-rh="true" property="og:type" content="website" />',
    )
    .replace(
      '<meta property="og:url" content="https://gtstk.dev" />',
      `<meta data-rh="true" property="og:url" content="${wordpressDetectorSeo.canonicalUrl}" />`,
    )
    .replace(
      '<meta name="twitter:card" content="summary" />',
      '<meta data-rh="true" name="twitter:card" content="summary" />',
    )
    .replace(
      '<meta name="twitter:title" content="GetStack - Detect Any Website\'s CMS Instantly" />',
      `<meta data-rh="true" name="twitter:title" content="${wordpressDetectorSeo.title}" />`,
    )
    .replace(
      '<meta name="twitter:description" content="See the full tech stack behind any website. Detect CMS, themes, plugins, JS frameworks, hosting, and more in seconds — free, no account required." />',
      `<meta data-rh="true" name="twitter:description" content="${wordpressDetectorSeo.ogDescription}" />`,
    )
    .replace("</head>", `${seoHead}\n  </head>`);
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(
        renderWordPressDetectorHead(page, url),
      );
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res, next) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      const template = await fs.promises.readFile(indexPath, "utf-8");
      res.status(200).type("html").send(
        renderWordPressDetectorHead(template, req.originalUrl),
      );
    } catch (error) {
      next(error);
    }
  });
}
