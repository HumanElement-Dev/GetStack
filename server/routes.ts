import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { detectionRequestSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // WordPress detection endpoint
  app.post("/api/detect-wordpress", async (req, res) => {
    try {
      const validationResult = detectionRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error);
        return res.status(400).json({ 
          error: "Invalid input", 
          details: errorMessage.toString() 
        });
      }

      const { domain } = validationResult.data;
      
      // Normalize domain (remove protocol if present)
      const normalizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const urlToCheck = normalizedDomain.startsWith('http') ? normalizedDomain : `https://${normalizedDomain}`;

      try {
        // Perform WordPress detection
        const response = await fetch(urlToCheck, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'GetStack WordPress Detector/1.0',
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        let isWordPress = false;
        let wordPressVersion = null;
        let theme = null;
        let pluginCount = null;
        let technologies: string[] = [];

        // Check for WordPress indicators in headers
        const generator = response.headers.get('x-generator') || response.headers.get('generator');
        if (generator && generator.toLowerCase().includes('wordpress')) {
          isWordPress = true;
          const versionMatch = generator.match(/wordpress\s+([\d\.]+)/i);
          if (versionMatch) {
            wordPressVersion = versionMatch[1];
          }
        }

        // Check for common WordPress headers
        const poweredBy = response.headers.get('x-powered-by');
        if (poweredBy && poweredBy.toLowerCase().includes('wordpress')) {
          isWordPress = true;
        }

        // If HEAD request didn't give us enough info, try GET request for content analysis
        if (!isWordPress) {
          try {
            const fullResponse = await fetch(urlToCheck, {
              method: 'GET',
              headers: {
                'User-Agent': 'GetStack WordPress Detector/1.0',
              },
              signal: AbortSignal.timeout(15000),
            });

            const content = await fullResponse.text();
            
            // Check for WordPress indicators in HTML content
            const wpIndicators = [
              /wp-content/i,
              /wp-includes/i,
              /wp-json/i,
              /wordpress/i,
              /generator.*wordpress/i,
              /wp-embed/i,
            ];

            for (const indicator of wpIndicators) {
              if (indicator.test(content)) {
                isWordPress = true;
                break;
              }
            }

            // Extract WordPress version from generator meta tag
            const generatorMatch = content.match(/<meta[^>]*generator[^>]*content="WordPress\s+([\d\.]+)"[^>]*>/i);
            if (generatorMatch) {
              isWordPress = true;
              wordPressVersion = generatorMatch[1];
            }

            // Extract theme name
            const themeMatch = content.match(/wp-content\/themes\/([^\/\?"']+)/i);
            if (themeMatch) {
              theme = themeMatch[1];
            }

            // Count plugins (rough estimate)
            const pluginMatches = content.match(/wp-content\/plugins\/[^\/\?"']+/gi);
            if (pluginMatches) {
              const uniquePlugins = new Set(pluginMatches.map(match => 
                match.match(/wp-content\/plugins\/([^\/\?"']+)/i)?.[1]
              ).filter(Boolean));
              pluginCount = `${uniquePlugins.size} detected`;
            }

            // Detect other technologies
            if (content.includes('react')) technologies.push('React');
            if (content.includes('vue')) technologies.push('Vue.js');
            if (content.includes('angular')) technologies.push('Angular');
            if (content.includes('next.js') || content.includes('_next')) technologies.push('Next.js');
            if (content.includes('tailwind') || content.includes('tw-')) technologies.push('Tailwind CSS');
            if (content.includes('bootstrap')) technologies.push('Bootstrap');

          } catch (contentError) {
            console.error('Error fetching content:', contentError);
          }
        }

        // Store the detection result
        const detectionRequest = await storage.createDetectionRequest({
          domain: normalizedDomain,
          isWordPress,
          wordPressVersion,
          theme,
          pluginCount,
          technologies,
          error: null,
        });

        res.json({
          id: detectionRequest.id,
          domain: normalizedDomain,
          isWordPress,
          wordPressVersion,
          theme,
          pluginCount,
          technologies,
          createdAt: detectionRequest.createdAt,
        });

      } catch (fetchError) {
        console.error('WordPress detection error:', fetchError);
        
        // Store the error result
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
        const detectionRequest = await storage.createDetectionRequest({
          domain: normalizedDomain,
          isWordPress: null,
          wordPressVersion: null,
          theme: null,
          pluginCount: null,
          technologies: [],
          error: errorMessage,
        });

        res.status(500).json({
          id: detectionRequest.id,
          domain: normalizedDomain,
          error: 'Unable to analyze the website. Please check the URL and try again.',
          details: errorMessage,
        });
      }

    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Get detection history for a domain
  app.get("/api/detection-history/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const history = await storage.getDetectionRequestsByDomain(domain);
      res.json(history);
    } catch (error) {
      console.error('Error fetching detection history:', error);
      res.status(500).json({ 
        error: 'Failed to fetch detection history',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
