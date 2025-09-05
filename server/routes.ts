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

        // Check for WordPress indicators in headers (very specific)
        const generator = response.headers.get('x-generator') || response.headers.get('generator');
        if (generator && /^WordPress\s+[\d\.]+/i.test(generator)) {
          isWordPress = true;
          const versionMatch = generator.match(/WordPress\s+([\d\.]+)/i);
          if (versionMatch) {
            wordPressVersion = versionMatch[1];
          }
          console.log(`WordPress detected via header: ${generator}`);
        }

        // Check for WordPress in X-Powered-By header (must be exact)
        const poweredBy = response.headers.get('x-powered-by');
        if (poweredBy && /^WordPress/i.test(poweredBy)) {
          isWordPress = true;
          console.log(`WordPress detected via X-Powered-By: ${poweredBy}`);
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
            
            // Very strict WordPress detection - require concrete evidence
            let wpScore = 0;
            const detectedIndicators = [];
            
            // Only the most reliable WordPress indicators
            
            // WordPress generator meta tag (strongest indicator) - must be exactly a generator tag
            const generatorMetaMatch = content.match(/<meta[^>]*name=["']generator["'][^>]*content=["']([^"']*WordPress[^"']*)["']/i);
            if (generatorMetaMatch && /^WordPress\s+[\d\.]+/i.test(generatorMetaMatch[1].trim())) {
              wpScore += 4;
              detectedIndicators.push(`WordPress generator meta tag: ${generatorMetaMatch[1]}`);
            }
            
            // WordPress REST API endpoints
            if (/wp-json\/wp\/v2\//i.test(content)) {
              wpScore += 3;
              detectedIndicators.push('WordPress REST API');
            }
            
            // WordPress admin area references
            if (/wp-admin\/admin-ajax\.php/i.test(content)) {
              wpScore += 2;
              detectedIndicators.push('WordPress admin-ajax');
            }
            
            // WordPress theme directory structure
            if (/wp-content\/themes\/[^\/\s"']+\/style\.css/i.test(content)) {
              wpScore += 2;
              detectedIndicators.push('WordPress theme structure');
            }
            
            // WordPress plugin directory structure  
            if (/wp-content\/plugins\/[^\/\s"']+\/[^\/\s"']+\.js/i.test(content)) {
              wpScore += 2;
              detectedIndicators.push('WordPress plugin structure');
            }
            
            // WordPress includes
            if (/wp-includes\/js\/wp-embed\.min\.js/i.test(content)) {
              wpScore += 2;
              detectedIndicators.push('WordPress wp-embed');
            }
            
            // WordPress version info in comments
            if (/<!--[\s]*WordPress[\s]+[\d\.]+[\s]*-->/i.test(content)) {
              wpScore += 2;
              detectedIndicators.push('WordPress version comment');
            }
            
            // Require a higher minimum score and multiple indicators
            if (wpScore >= 4 && detectedIndicators.length >= 2) {
              isWordPress = true;
            }
            
            // Log detection details for debugging
            console.log(`\n=== WordPress Detection for ${normalizedDomain} ===`);
            console.log(`Score: ${wpScore}`);
            console.log(`Indicators found: [${detectedIndicators.join(', ')}]`);
            console.log(`Detection result: ${wpScore >= 4 && detectedIndicators.length >= 2 ? 'WordPress' : 'Not WordPress'}`);
            console.log(`Requirements: Score >= 4 AND >= 2 indicators`);
            console.log(`=====================================\n`);

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

            // Detect other technologies with more precision
            if (/react/i.test(content) && (/react\.js|reactjs|react\.min\.js/i.test(content) || /__react/i.test(content))) {
              technologies.push('React');
            }
            if (/vue/i.test(content) && (/vue\.js|vuejs|vue\.min\.js/i.test(content) || /\bVue\b/g.test(content))) {
              technologies.push('Vue.js');
            }
            if (/angular/i.test(content) && (/angular\.js|angularjs|angular\.min\.js/i.test(content) || /ng-/i.test(content))) {
              technologies.push('Angular');
            }
            if (/next\.js/i.test(content) || /_next\//i.test(content)) {
              technologies.push('Next.js');
            }
            if (/tailwind/i.test(content) && (/tailwindcss|tailwind\.css/i.test(content) || /\btw-/i.test(content))) {
              technologies.push('Tailwind CSS');
            }
            if (/bootstrap/i.test(content) && (/bootstrap\.css|bootstrap\.js|bootstrap\.min/i.test(content) || /\bbs-/i.test(content))) {
              technologies.push('Bootstrap');
            }
            
            // Detect static site generators
            if (/<meta[^>]*generator[^>]*content="[^"]*Jekyll[^"]*"/i.test(content)) {
              technologies.push('Jekyll');
            }
            if (/<meta[^>]*generator[^>]*content="[^"]*Hugo[^"]*"/i.test(content)) {
              technologies.push('Hugo');
            }
            if (/<meta[^>]*generator[^>]*content="[^"]*Gatsby[^"]*"/i.test(content)) {
              technologies.push('Gatsby');
            }
            
            // Detect common hosting/static site patterns
            if (/netlify/i.test(content)) {
              technologies.push('Netlify');
            }
            if (/vercel/i.test(content)) {
              technologies.push('Vercel');
            }
            
            // If no WordPress indicators but has static site characteristics
            if (wpScore < 3 && !content.includes('wp-') && technologies.length > 0) {
              technologies.push('Static HTML');
            }

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
