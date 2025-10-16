import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { detectionRequestSchema, type Plugin } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load plugin signatures once at startup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try multiple paths for plugin-signatures.json to support both dev and production
let signaturesPath = join(__dirname, 'plugin-signatures.json');
if (!existsSync(signaturesPath)) {
  // Fallback to source location if not found in dist
  signaturesPath = join(__dirname, '..', 'server', 'plugin-signatures.json');
}
if (!existsSync(signaturesPath)) {
  // Last fallback for production build without copy
  signaturesPath = join(process.cwd(), 'server', 'plugin-signatures.json');
}

const pluginSignatures = JSON.parse(readFileSync(signaturesPath, 'utf-8'));

// Load plugin metadata
let metadataPath = join(__dirname, 'plugin-metadata.json');
if (!existsSync(metadataPath)) {
  metadataPath = join(__dirname, '..', 'server', 'plugin-metadata.json');
}
if (!existsSync(metadataPath)) {
  metadataPath = join(process.cwd(), 'server', 'plugin-metadata.json');
}

const pluginMetadata: Record<string, Omit<Plugin, 'version'>> = JSON.parse(readFileSync(metadataPath, 'utf-8'));

// Helper function to enrich plugin slugs with metadata
function enrichPluginData(slugs: string[], versions: Map<string, string> = new Map()): Plugin[] {
  return slugs.map(slug => {
    const metadata = pluginMetadata[slug];
    if (metadata) {
      return {
        ...metadata,
        version: versions.get(slug) || undefined,
      };
    }
    // Fallback for plugins without metadata
    return {
      slug,
      name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      description: 'WordPress plugin',
      category: 'Other',
      icon: 'puzzle',
      color: '#6B7280',
      version: versions.get(slug) || undefined,
      dependencies: [],
      parent: null,
    };
  });
}

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

      // Basic SSRF protection - reject private IP ranges
      const hostname = new URL(urlToCheck).hostname;
      const isPrivateIP = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|localhost|::1|fc00:|fe80:)/i.test(hostname);
      
      if (isPrivateIP) {
        return res.status(400).json({
          error: 'Invalid domain - private IP addresses are not allowed',
          details: 'Please use a public domain name'
        });
      }

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
        let isWix = false;
        let cmsType = null;
        let wordPressVersion = null;
        let theme = null;
        let pluginCount = null;
        let plugins: Plugin[] = [];
        let technologies: string[] = [];
        const pluginVersions = new Map<string, string>();

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

        // Always try GET request for content analysis to get theme/plugin details
        // This ensures we can show the second card even when WordPress is detected via headers
        let contentAnalyzed = false;
        if (true) { // Always fetch content for details
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
            
            // Require a minimum score, but allow single strong indicators
            // If we have a generator meta tag (score 4), that's sufficient on its own
            if (wpScore >= 4 && detectedIndicators.length >= 1) {
              isWordPress = true;
            }
            
            // Extract WordPress version from generator meta tag
            const generatorMatch = content.match(/<meta[^>]*generator[^>]*content="WordPress\s+([\d\.]+)"[^>]*>/i);
            if (generatorMatch) {
              isWordPress = true;
              wordPressVersion = generatorMatch[1];
            }
            
            // Log detection details for debugging
            console.log(`\n=== WordPress Detection for ${normalizedDomain} ===`);
            console.log(`Score: ${wpScore}`);
            console.log(`Indicators found: [${detectedIndicators.join(', ')}]`);
            console.log(`Detection result: ${isWordPress ? 'WordPress' : 'Not WordPress'}`);
            console.log(`Requirements: Score >= 4 AND >= 1 indicator`);
            console.log(`=====================================\n`);

            // Only extract theme/plugin info if WordPress is detected
            if (isWordPress) {
              // Extract theme name - improved detection
              const themeMatches = content.match(/wp-content\/themes\/([^\/\?"'\s]+)/gi);
              if (themeMatches && themeMatches.length > 0) {
                // Get the most common theme (in case of child themes)
                const themeNames = themeMatches.map(match => 
                  match.match(/wp-content\/themes\/([^\/\?"'\s]+)/i)?.[1]
                ).filter(Boolean);
                theme = themeNames[0] || null;
              }
              
              // Also check for theme references in stylesheets
              if (!theme) {
                const styleThemeMatch = content.match(/themes\/([^\/\?"'\s]+)\/style\.css/i);
                if (styleThemeMatch) {
                  theme = styleThemeMatch[1];
                }
              }

              // Extract all plugins - strict detection to avoid false positives
              const detectedPlugins = new Set<string>();
              
              // WordPress core components to exclude (only actual core, not plugins)
              const coreComponents = new Set([
                'wp-site-health',
                'wp-block-editor',
                'wp-block-library',
                'wp-edit-blocks',
                'wp-edit-post',
                'wp-edit-widgets',
                'wp-format-library',
                'wp-list-reusable-blocks',
                'wp-widgets-customizer',
                'batch' // Common false positive - WordPress core batch processing
              ]);
              
              // Method 1: Path detection - detect from actual /wp-content/plugins/FOLDER-NAME/ paths
              // This is the most reliable method - plugins must load at least one asset to be detected
              // Also capture version numbers from query strings (?ver=1.2.3)
              const pluginPathPattern = /wp-content\/plugins\/([a-z0-9_-]+)(?:\/|\\)/gi;
              let pluginMatch;
              
              while ((pluginMatch = pluginPathPattern.exec(content)) !== null) {
                const pluginSlug = pluginMatch[1];
                if (pluginSlug && !coreComponents.has(pluginSlug)) {
                  detectedPlugins.add(pluginSlug);
                  
                  // Try to extract version from the same line
                  const versionMatch = content.substring(pluginMatch.index, pluginMatch.index + 200).match(/\?ver=([0-9.]+)/);
                  if (versionMatch) {
                    pluginVersions.set(pluginSlug, versionMatch[1]);
                    console.log(`Detected ${pluginSlug} version: ${versionMatch[1]}`);
                  }
                }
              }
              
              // Method 2: Try to get plugin directory listing (rarely works due to security)
              try {
                const pluginsUrl = new URL('/wp-content/plugins/', urlToCheck).href;
                const pluginsDirResponse = await fetch(pluginsUrl, {
                  method: 'GET',
                  headers: {
                    'User-Agent': 'GetStack WordPress Detector/1.0',
                  },
                  signal: AbortSignal.timeout(5000),
                });
                
                if (pluginsDirResponse.ok) {
                  const dirContent = await pluginsDirResponse.text();
                  
                  // Check if directory listing is enabled (look for typical directory listing patterns)
                  if (dirContent.includes('Index of') || dirContent.includes('Parent Directory')) {
                    console.log('Directory listing found for /wp-content/plugins/');
                    // Extract folder names from directory listing
                    const folderMatches = dirContent.match(/href="([^"\/]+)\//gi);
                    if (folderMatches) {
                      folderMatches.forEach(match => {
                        const folderMatch = match.match(/href="([^"\/]+)\//i);
                        if (folderMatch && folderMatch[1] && folderMatch[1] !== '..' && !coreComponents.has(folderMatch[1])) {
                          detectedPlugins.add(folderMatch[1]);
                        }
                      });
                    }
                  } else {
                    console.log('Directory listing disabled for /wp-content/plugins/');
                  }
                }
              } catch (dirError) {
                console.log('Plugin directory check failed (expected for most sites)');
              }
              
              // Method 6: CSS Class/ID Pattern Detection
              // Scan for known CSS class patterns used by popular plugins
              for (const [key, sig] of Object.entries(pluginSignatures.cssClassPatterns) as [string, { patterns: string[], name: string }][]) {
                for (const pattern of sig.patterns) {
                  const classRegex = new RegExp(`class="[^"]*${pattern}[^"]*"`, 'i');
                  if (classRegex.test(content)) {
                    detectedPlugins.add(sig.name);
                    console.log(`Detected ${sig.name} via CSS class: ${pattern}`);
                    break;
                  }
                }
              }
              
              // Method 7: Script/Style Handle Detection
              // Check for known script/style filenames and handles within script/link tags only
              for (const [key, sig] of Object.entries(pluginSignatures.scriptPatterns) as [string, { patterns: string[], name: string }][]) {
                for (const pattern of sig.patterns) {
                  // Only match within script or link tags to avoid false positives from body text
                  const scriptRegex = new RegExp(`<script[^>]*src=["'][^"']*${pattern}[^"']*["']`, 'i');
                  const linkRegex = new RegExp(`<link[^>]*href=["'][^"']*${pattern}[^"']*["']`, 'i');
                  
                  if (scriptRegex.test(content) || linkRegex.test(content)) {
                    detectedPlugins.add(sig.name);
                    console.log(`Detected ${sig.name} via script/style asset: ${pattern}`);
                    break;
                  }
                }
              }
              
              // Method 8: Meta and JSON-LD Detection
              // Parse meta tags and structured data for plugin references
              for (const [key, sig] of Object.entries(pluginSignatures.metaPatterns) as [string, { patterns: string[], name: string }][]) {
                for (const pattern of sig.patterns) {
                  const metaRegex = new RegExp(pattern, 'i');
                  if (metaRegex.test(content)) {
                    detectedPlugins.add(sig.name);
                    console.log(`Detected ${sig.name} via meta/JSON-LD: ${pattern}`);
                    break;
                  }
                }
              }
              
              // Method 9: WordPress REST API - Custom plugin endpoints
              try {
                const apiUrl = new URL('/wp-json/', urlToCheck).href;
                const apiResponse = await fetch(apiUrl, {
                  method: 'GET',
                  headers: {
                    'User-Agent': 'GetStack WordPress Detector/1.0',
                  },
                  signal: AbortSignal.timeout(5000),
                });
                
                if (apiResponse.ok) {
                  const apiData = await apiResponse.json();
                  
                  if (apiData && typeof apiData === 'object') {
                    const apiString = JSON.stringify(apiData);
                    
                    // Check for known plugin REST endpoints
                    for (const [key, sig] of Object.entries(pluginSignatures.restEndpoints) as [string, { endpoint: string, name: string }][]) {
                      if (apiString.includes(sig.endpoint)) {
                        detectedPlugins.add(sig.name);
                        console.log(`Detected ${sig.name} via REST endpoint: ${sig.endpoint}`);
                      }
                    }
                    
                    // Also look for custom plugin namespaces
                    const pluginApiMatches = apiString.match(/\/wp-json\/([a-z0-9-_]+)\/v\d+/gi);
                    if (pluginApiMatches) {
                      pluginApiMatches.forEach(match => {
                        const pluginMatch = match.match(/\/wp-json\/([a-z0-9-_]+)\/v\d+/i);
                        if (pluginMatch && pluginMatch[1] && pluginMatch[1] !== 'wp' && !coreComponents.has(pluginMatch[1])) {
                          detectedPlugins.add(pluginMatch[1]);
                        }
                      });
                    }
                  }
                }
              } catch (apiError) {
                // REST API not available or timed out - this is expected for many sites
                console.log('REST API check skipped or unavailable');
              }
              
              // Method 10: WPScan API - Enhanced plugin detection (if API token available)
              // Note: WPScan CLI tool can enumerate plugins, but the API only provides vulnerability lookups
              // We use this to validate and get additional info about already-detected plugins
              const wpscanToken = process.env.WPSCAN_API_TOKEN;
              if (wpscanToken && detectedPlugins.size > 0) {
                try {
                  console.log(`Using WPScan API to validate ${detectedPlugins.size} detected plugins...`);
                  
                  // Validate detected plugins against WPScan database
                  // This confirms they are real plugins and provides vulnerability data
                  const validatedPlugins = new Set<string>();
                  const pluginsToValidate = Array.from(detectedPlugins);
                  
                  for (const pluginSlug of pluginsToValidate) {
                    try {
                      const wpscanResponse = await fetch(`https://wpscan.com/api/v3/plugins/${pluginSlug}`, {
                        method: 'GET',
                        headers: {
                          'Authorization': `Token token=${wpscanToken}`,
                        },
                        signal: AbortSignal.timeout(3000),
                      });
                      
                      if (wpscanResponse.ok) {
                        const wpscanData = await wpscanResponse.json();
                        // Plugin exists in WPScan DB - it's a real plugin
                        validatedPlugins.add(pluginSlug);
                        console.log(`✓ WPScan validated: ${pluginSlug}`);
                      } else if (wpscanResponse.status === 404) {
                        // Plugin not in WPScan DB - might be custom or very new
                        console.log(`✗ Not in WPScan DB: ${pluginSlug} (keeping anyway)`);
                        validatedPlugins.add(pluginSlug);
                      } else {
                        // Other HTTP errors (401 unauthorized, 429 rate limit, 5xx server errors)
                        console.log(`WPScan API returned ${wpscanResponse.status} for ${pluginSlug}, keeping in list`);
                        validatedPlugins.add(pluginSlug);
                      }
                    } catch (wpscanError) {
                      // API call failed (network error, timeout) - keep the plugin anyway
                      console.log(`WPScan check failed for ${pluginSlug}, keeping in list`);
                      validatedPlugins.add(pluginSlug);
                    }
                  }
                  
                  // Update the detected plugins set with validated results
                  detectedPlugins.clear();
                  validatedPlugins.forEach(p => detectedPlugins.add(p));
                  
                  console.log('WPScan API validation completed');
                } catch (wpscanError) {
                  console.log('WPScan API integration skipped:', wpscanError);
                }
              }
              
              // Convert to array and set plugin count
              if (detectedPlugins.size > 0) {
                const pluginSlugs = Array.from(detectedPlugins);
                plugins = enrichPluginData(pluginSlugs, pluginVersions);
                pluginCount = `${detectedPlugins.size} detected`;
                console.log(`Detected ${plugins.length} plugins: ${pluginSlugs.join(', ')}`);
              }
              
              // If we have WordPress but no theme/plugin info, provide fallback
              if (!theme && !pluginCount) {
                theme = 'Active theme detected';
                pluginCount = 'Plugins detected';
              }
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

            // Wix Detection - only check if WordPress was not detected
            if (!isWordPress) {
              let wixScore = 0;
              const wixIndicators = [];

              // Check for Wix-specific headers first
              const wixRequestId = fullResponse.headers.get('X-Wix-Request-Id');
              const wixInstance = fullResponse.headers.get('X-Wix-Instance');
              const serverHeader = fullResponse.headers.get('Server');
              
              if (wixRequestId || wixInstance) {
                wixScore += 5;
                wixIndicators.push('Wix headers detected');
              }

              // Wix-specific content patterns
              if (/static\.wixstatic\.com/i.test(content)) {
                wixScore += 4;
                wixIndicators.push('Wix static content CDN');
              }

              if (/parastorage\.com/i.test(content)) {
                wixScore += 3;
                wixIndicators.push('Wix Parastorage');
              }

              if (/_wix_browser_sess/i.test(content)) {
                wixScore += 3;
                wixIndicators.push('Wix session cookie');
              }

              if (/wix-warmup-data/i.test(content)) {
                wixScore += 3;
                wixIndicators.push('Wix warmup data');
              }

              if (/wix-thunderbolt/i.test(content)) {
                wixScore += 3;
                wixIndicators.push('Wix Thunderbolt');
              }

              if (/<meta[^>]*name=["']generator["'][^>]*content=["'][^"']*Wix\.com[^"']*["']/i.test(content)) {
                wixScore += 4;
                wixIndicators.push('Wix generator meta tag');
              }

              // Wix-specific JavaScript patterns
              if (/clientSideRender\.min\.js/i.test(content) && /wix/i.test(content)) {
                wixScore += 2;
                wixIndicators.push('Wix client-side renderer');
              }

              // Require score >= 4 and at least 1 indicator for Wix detection
              // Strong indicators like Wix headers or CDN alone are sufficient
              if (wixScore >= 4 && wixIndicators.length >= 1) {
                isWix = true;
              }

              console.log(`\n=== Wix Detection for ${normalizedDomain} ===`);
              console.log(`Score: ${wixScore}`);
              console.log(`Indicators found: [${wixIndicators.join(', ')}]`);
              console.log(`Detection result: ${isWix ? 'Wix' : 'Not Wix'}`);
              console.log(`Requirements: Score >= 4 AND >= 1 indicator`);
              console.log(`=====================================\n`);
            }

          } catch (contentError) {
            console.error('Error fetching content:', contentError);
          }
        }

        // Set CMS type based on detection
        if (isWordPress) {
          cmsType = 'wordpress';
        } else if (isWix) {
          cmsType = 'wix';
        }

        // Store the detection result
        const detectionRequest = await storage.createDetectionRequest({
          domain: normalizedDomain,
          cmsType,
          isWordPress,
          wordPressVersion,
          theme,
          pluginCount,
          plugins,
          technologies,
          error: null,
        });

        res.json({
          id: detectionRequest.id,
          domain: normalizedDomain,
          cmsType,
          isWordPress,
          wordPressVersion,
          theme,
          pluginCount,
          plugins,
          technologies,
          createdAt: detectionRequest.createdAt,
        });

      } catch (fetchError) {
        console.error('WordPress detection error:', fetchError);
        
        // Store the error result
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
        const detectionRequest = await storage.createDetectionRequest({
          domain: normalizedDomain,
          cmsType: null,
          isWordPress: null,
          wordPressVersion: null,
          theme: null,
          pluginCount: null,
          plugins: [],
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
