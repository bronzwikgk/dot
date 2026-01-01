// ============================================================================
// UNIVERSAL ERMS FRAMEWORK v3.0
// ============================================================================
// Entity Record Management System (ERMS)
// Supports: Node.js, Browser, Google Apps Script
// Features: Config-driven entities, Tree/Table records, Multi-format support
// ============================================================================

// ============================================================================
// 1. RUNTIME DETECTION & PLATFORM ADAPTATION
// ============================================================================
const RUNTIME = (() => {
  const detectors = [
    // Google Apps Script
    {
      name: 'appscript',
      test: () => typeof ScriptApp !== 'undefined' || 
                  typeof google !== 'undefined' && 
                  google.script && google.script.run,
      priority: 1
    },
    // Browser
    {
      name: 'browser',
      test: () => typeof window !== 'undefined' && typeof document !== 'undefined',
      priority: 2
    },
    // Node.js
    {
      name: 'node',
      test: () => typeof process !== 'undefined' && process.versions && process.versions.node,
      priority: 3
    },
    // Deno
    {
      name: 'deno',
      test: () => typeof Deno !== 'undefined',
      priority: 4
    },
    // Bun
    {
      name: 'bun',
      test: () => typeof Bun !== 'undefined',
      priority: 5
    }
  ];

  detectors.sort((a, b) => a.priority - b.priority);
  
  for (const detector of detectors) {
    try {
      if (detector.test()) {
        const version = detector.name === 'node' ? process.version :
                      detector.name === 'browser' ? navigator.userAgent :
                      detector.name === 'appscript' ? 'GAS' : 'unknown';
        
        console.log(`📱 Detected runtime: ${detector.name} (${version})`);
        return {
          platform: detector.name,
          version: version,
          timestamp: Date.now(),
          features: getPlatformFeatures(detector.name)
        };
      }
    } catch (e) {
      continue;
    }
  }
  
  return { platform: 'unknown', version: 'unknown', timestamp: Date.now(), features: {} };
})();

function getPlatformFeatures(platform) {
  const features = {
    fileSystem: false,
    localStorage: false,
    indexedDB: false,
    googleSheets: false,
    scriptProperties: false,
    googleDrive: false,
    httpServer: false,
    domAccess: false
  };

  switch (platform) {
    case 'node':
      features.fileSystem = true;
      features.httpServer = true;
      break;
    case 'browser':
      features.localStorage = true;
      features.indexedDB = true;
      features.domAccess = true;
      break;
    case 'appscript':
      features.googleSheets = true;
      features.scriptProperties = true;
      features.googleDrive = true;
      break;
  }

  return features;
}

// ============================================================================
// 2. CONFIGURATION LOADER (supports .js, .json, .yml, .jsonl, .txt)
// ============================================================================
class ConfigLoader {
  static async loadConfig(path, options = {}) {
    const ext = path.split('.').pop().toLowerCase();
    const runtime = RUNTIME.platform;
    
    console.log(`📂 Loading config: ${path} (${ext}) on ${runtime}`);
    
    try {
      switch (ext) {
        case 'js':
          return await this.loadJSConfig(path, runtime);
        case 'json':
          return await this.loadJSONConfig(path, runtime);
        case 'yml':
        case 'yaml':
          return await this.loadYAMLConfig(path, runtime);
        case 'jsonl':
          return await this.loadJSONLConfig(path, runtime);
        case 'txt':
        case 'csv':
          return await this.loadTextConfig(path, runtime, options);
        case 'xml':
          return await this.loadXMLConfig(path, runtime);
        case 'html':
          return await this.loadHTMLConfig(path, runtime);
        default:
          throw new Error(`Unsupported config format: ${ext}`);
      }
    } catch (error) {
      console.error(`Failed to load config ${path}:`, error);
      return options.default || {};
    }
  }

  static async loadJSConfig(path, runtime) {
    // Dynamic import for ES modules
    if (runtime === 'node' || runtime === 'browser') {
      if (runtime === 'node') {
        // Node.js dynamic import
        const module = await import(path.startsWith('.') ? path : `./${path}`);
        return module.default || module;
      } else if (runtime === 'browser') {
        // Browser dynamic import
        const module = await import(path);
        return module.default || module;
      }
    } else if (runtime === 'appscript') {
      // Apps Script - eval the script content
      const content = await this.readFile(path, runtime);
      const module = {};
      const exports = {};
      const moduleExports = {};
      
      // Create a safe execution context
      const func = new Function('module', 'exports', content);
      func(moduleExports, exports);
      
      return moduleExports.exports || moduleExports || exports;
    }
  }

  static async loadJSONConfig(path, runtime) {
    const content = await this.readFile(path, runtime);
    return JSON.parse(content);
  }

  static async loadYAMLConfig(path, runtime) {
    const content = await this.readFile(path, runtime);
    
    // Simple YAML parser (for basic configs)
    return this.parseSimpleYAML(content);
  }

  static async loadJSONLConfig(path, runtime) {
    const content = await this.readFile(path, runtime);
    const lines = content.split('\n').filter(line => line.trim());
    return lines.map(line => JSON.parse(line));
  }

  static async loadTextConfig(path, runtime, options) {
    const content = await this.readFile(path, runtime);
    
    if (options.format === 'csv') {
      return this.parseCSV(content, options);
    }
    
    return content;
  }

  static async loadXMLConfig(path, runtime) {
    const content = await this.readFile(path, runtime);
    return this.parseXML(content);
  }

  static async loadHTMLConfig(path, runtime) {
    const content = await this.readFile(path, runtime);
    return { html: content, type: 'html' };
  }

  static async readFile(path, runtime) {
    switch (runtime) {
      case 'node':
        const fs = await import('fs').promises;
        return await fs.readFile(path, 'utf8');
        
      case 'browser':
        // For browser, fetch the file
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
        
      case 'appscript':
        // Apps Script - read from Google Drive or script properties
        if (path.startsWith('properties://')) {
          const key = path.replace('properties://', '');
          return PropertiesService.getScriptProperties().getProperty(key) || '';
        } else if (path.startsWith('drive://')) {
          const fileId = path.replace('drive://', '');
          const file = DriveApp.getFileById(fileId);
          return file.getBlob().getDataAsString();
        } else {
          // Assume it's a script file
          return this.getScriptContent(path);
        }
        
      default:
        throw new Error(`Cannot read files on platform: ${runtime}`);
    }
  }

  static async writeFile(path, content, runtime) {
    switch (runtime) {
      case 'node':
        const fs = await import('fs').promises;
        const dir = path.split('/').slice(0, -1).join('/');
        if (dir) await fs.mkdir(dir, { recursive: true });
        return await fs.writeFile(path, content, 'utf8');
        
      case 'browser':
        // Browser - download as file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = path.split('/').pop();
        a.click();
        URL.revokeObjectURL(url);
        return true;
        
      case 'appscript':
        // Apps Script - write to Drive or properties
        if (path.startsWith('properties://')) {
          const key = path.replace('properties://', '');
          PropertiesService.getScriptProperties().setProperty(key, content);
          return true;
        } else if (path.startsWith('drive://')) {
          const fileId = path.replace('drive://', '');
          const file = DriveApp.getFileById(fileId);
          file.setContent(content);
          return true;
        }
        return false;
        
      default:
        throw new Error(`Cannot write files on platform: ${runtime}`);
    }
  }

  static parseSimpleYAML(content) {
    const lines = content.split('\n');
    const result = {};
    let currentKey = '';
    let currentObj = result;
    const stack = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const indent = line.match(/^\s*/)[0].length;
      const keyMatch = trimmed.match(/^([^:]+):\s*(.*)$/);

      if (keyMatch) {
        const [, key, value] = keyMatch;
        const cleanKey = key.trim();
        
        // Handle indentation
        while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }

        if (stack.length > 0) {
          currentObj = stack[stack.length - 1].obj;
        } else {
          currentObj = result;
        }

        if (value.trim() === '') {
          // Nested object
          const newObj = {};
          currentObj[cleanKey] = newObj;
          stack.push({ indent, obj: newObj });
          currentObj = newObj;
        } else {
          // Simple value
          const cleanValue = value.trim();
          currentObj[cleanKey] = this.parseYAMLValue(cleanValue);
        }
      } else if (trimmed.startsWith('- ')) {
        // Array item
        const value = trimmed.substring(2).trim();
        if (!Array.isArray(currentObj)) {
          currentObj = [];
          stack[stack.length - 1].obj[stack[stack.length - 1].key] = currentObj;
        }
        currentObj.push(this.parseYAMLValue(value));
      }
    }

    return result;
  }

  static parseYAMLValue(value) {
    // Try to parse as number
    if (!isNaN(value) && value.trim() !== '') {
      const num = parseFloat(value);
      if (!isNaN(num)) return num;
    }

    // Try to parse as boolean
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;

    // Try to parse as null
    if (value.toLowerCase() === 'null') return null;

    // Return as string
    return value;
  }

  static parseCSV(content, options = {}) {
    const delimiter = options.delimiter || ',';
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(delimiter).map(h => h.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i], delimiter);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
    
    return data;
  }

  static parseCSVLine(line, delimiter) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"' && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  static parseXML(content) {
    // Simple XML parser for config files
    const result = {};
    const tagStack = [];
    let currentTag = '';
    let currentText = '';
    let inTag = false;
    let inComment = false;
    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const nextChar = content[i + 1];
      
      // Handle comments
      if (char === '<' && nextChar === '!') {
        inComment = true;
        continue;
      }
      if (inComment && char === '>' && content[i - 1] === '-') {
        inComment = false;
        continue;
      }
      if (inComment) continue;
      
      if (char === '<') {
        if (currentText.trim()) {
          this.addToResult(result, tagStack, currentText.trim());
          currentText = '';
        }
        
        if (nextChar === '/') {
          // Closing tag
          const endIndex = content.indexOf('>', i);
          const tagName = content.substring(i + 2, endIndex).trim();
          if (tagStack.length > 0 && tagStack[tagStack.length - 1] === tagName) {
            tagStack.pop();
          }
          i = endIndex;
        } else {
          // Opening tag
          const endIndex = content.indexOf('>', i);
          const tagContent = content.substring(i + 1, endIndex).trim();
          const tagMatch = tagContent.match(/^([^\s]+)/);
          
          if (tagMatch) {
            const tagName = tagMatch[1];
            tagStack.push(tagName);
            currentTag = tagName;
          }
          i = endIndex;
        }
      } else if (char === '>') {
        inTag = false;
      } else if (!inTag) {
        currentText += char;
      }
    }
    
    if (currentText.trim()) {
      this.addToResult(result, tagStack, currentText.trim());
    }
    
    return result;
  }

  static addToResult(result, tagStack, value) {
    let current = result;
    for (let i = 0; i < tagStack.length - 1; i++) {
      const tag = tagStack[i];
      if (!current[tag]) {
        current[tag] = {};
      }
      current = current[tag];
    }
    
    const lastTag = tagStack[tagStack.length - 1];
    if (lastTag) {
      if (current[lastTag]) {
        if (!Array.isArray(current[lastTag])) {
          current[lastTag] = [current[lastTag]];
        }
        current[lastTag].push(value);
      } else {
        current[lastTag] = value;
      }
    }
  }

  static getScriptContent(path) {
    // Apps Script specific - get script file content
    // This is a simplified version
    try {
      // In Apps Script, you'd use something like:
      // return HtmlService.createHtmlOutputFromFile(path).getContent();
      return '';
    } catch (e) {
      console.error(`Cannot read script file: ${path}`, e);
      return '';
    }
  }

  static async loadDirectory(dirPath, runtime) {
    const files = [];
    const configs = {};
    
    switch (runtime) {
      case 'node':
        const fs = await import('fs').promises;
        const path = await import('path');
        
        try {
          const entries = await fs.readdir(dirPath, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            
            if (entry.isDirectory()) {
              const subConfigs = await this.loadDirectory(fullPath, runtime);
              Object.assign(configs, subConfigs);
            } else if (entry.isFile() && this.isConfigFile(entry.name)) {
              try {
                const config = await this.loadConfig(fullPath, runtime);
                const name = entry.name.replace(/\.[^/.]+$/, '');
                configs[name] = config;
                files.push(fullPath);
              } catch (error) {
                console.error(`Failed to load ${fullPath}:`, error);
              }
            }
          }
        } catch (error) {
          console.error(`Cannot read directory ${dirPath}:`, error);
        }
        break;
        
      case 'browser':
        // In browser, we'd need a different approach (maybe fetch from server)
        console.warn('Directory loading not fully supported in browser');
        break;
        
      case 'appscript':
        // In Apps Script, list files from Google Drive
        console.warn('Directory loading not fully supported in Apps Script');
        break;
    }
    
    return { configs, files };
  }

  static isConfigFile(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return ['js', 'json', 'yml', 'yaml', 'jsonl', 'txt', 'csv', 'xml', 'html'].includes(ext);
  }
}

// ============================================================================
// 3. PLUGIN SYSTEM
// ============================================================================
class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
    this.dependencies = new Map();
  }

  async loadPlugin(name, config) {
    console.log(`🔌 Loading plugin: ${name}`);
    
    try {
      let plugin;
      
      if (config.path) {
        // Load from file
        plugin = await ConfigLoader.loadConfig(config.path, RUNTIME.platform);
      } else if (config.code) {
        // Inline code
        const func = new Function('exports', 'module', 'require', config.code);
        const module = { exports: {} };
        func(module.exports, module, this.require.bind(this));
        plugin = module.exports;
      } else {
        throw new Error(`Plugin ${name} has no path or code`);
      }
      
      // Initialize plugin
      if (typeof plugin.initialize === 'function') {
        await plugin.initialize(config.options || {});
      }
      
      // Register hooks
      if (plugin.hooks) {
        for (const [hookName, hookFn] of Object.entries(plugin.hooks)) {
          this.registerHook(hookName, hookFn);
        }
      }
      
      // Store plugin
      this.plugins.set(name, {
        name,
        instance: plugin,
        config,
        enabled: true,
        loadedAt: Date.now()
      });
      
      console.log(`✅ Plugin ${name} loaded successfully`);
      return plugin;
      
    } catch (error) {
      console.error(`❌ Failed to load plugin ${name}:`, error);
      throw error;
    }
  }

  async unloadPlugin(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) return false;
    
    // Call cleanup if available
    if (plugin.instance.cleanup && typeof plugin.instance.cleanup === 'function') {
      await plugin.instance.cleanup();
    }
    
    // Remove hooks
    for (const [hookName, hooks] of this.hooks.entries()) {
      this.hooks.set(hookName, hooks.filter(h => h.plugin !== name));
    }
    
    this.plugins.delete(name);
    console.log(`🔌 Plugin ${name} unloaded`);
    return true;
  }

  async enablePlugin(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) return false;
    
    plugin.enabled = true;
    
    if (plugin.instance.onEnable && typeof plugin.instance.onEnable === 'function') {
      await plugin.instance.onEnable();
    }
    
    console.log(`🔌 Plugin ${name} enabled`);
    return true;
  }

  async disablePlugin(name) {
    const plugin = this.plugins.get(name);
    if (!plugin) return false;
    
    plugin.enabled = false;
    
    if (plugin.instance.onDisable && typeof plugin.instance.onDisable === 'function') {
      await plugin.instance.onDisable();
    }
    
    console.log(`🔌 Plugin ${name} disabled`);
    return true;
  }

  registerHook(hookName, hookFn, pluginName = 'unknown') {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    
    this.hooks.get(hookName).push({
      plugin: pluginName,
      fn: hookFn,
      priority: 10
    });
    
    // Sort by priority
    this.hooks.get(hookName).sort((a, b) => b.priority - a.priority);
  }

  async callHook(hookName, ...args) {
    const hooks = this.hooks.get(hookName) || [];
    const results = [];
    
    for (const hook of hooks) {
      try {
        const plugin = this.plugins.get(hook.plugin);
        if (plugin && plugin.enabled) {
          const result = await hook.fn(...args);
          results.push({ plugin: hook.plugin, result });
        }
      } catch (error) {
        console.error(`Hook ${hookName} failed in plugin ${hook.plugin}:`, error);
        results.push({ plugin: hook.plugin, error });
      }
    }
    
    return results;
  }

  getPlugin(name) {
    return this.plugins.get(name)?.instance;
  }

  listPlugins() {
    return Array.from(this.plugins.values()).map(p => ({
      name: p.name,
      enabled: p.enabled,
      loadedAt: p.loadedAt
    }));
  }

  require(name) {
    // Simple require function for plugins
    if (this.plugins.has(name)) {
      return this.plugins.get(name).instance;
    }
    
    // Check for built-in modules
    if (RUNTIME.platform === 'node') {
      try {
        return require(name);
      } catch (e) {
        // Not a node module
      }
    }
    
    throw new Error(`Cannot find module: ${name}`);
  }
}

// ============================================================================
// 4. EXTERNAL API SERVICE
// ============================================================================
class ExternalAPIService {
  constructor(config = {}) {
    this.config = {
      defaultTimeout: 30000,
      retryAttempts: 3,
      circuitBreaker: {
        failureThreshold: 5,
        resetTimeout: 60000
      },
      rateLimits: {},
      ...config
    };
    
    this.apiClients = new Map();
    this.circuits = new Map();
    this.rateLimiters = new Map();
    this.apiKeys = new Map();
    
    // Initialize based on platform
    this.initPlatformClient();
  }

  initPlatformClient() {
    switch (RUNTIME.platform) {
      case 'node':
        // Use node-fetch or built-in fetch in newer Node
        this.fetch = async (url, options) => {
          if (typeof fetch !== 'undefined') {
            return fetch(url, options);
          } else {
            // Fallback to node-fetch
            const nodeFetch = await import('node-fetch');
            return nodeFetch.default(url, options);
          }
        };
        break;
        
      case 'browser':
        this.fetch = window.fetch.bind(window);
        break;
        
      case 'appscript':
        this.fetch = this.appsScriptFetch.bind(this);
        break;
        
      default:
        throw new Error(`Unsupported platform for HTTP: ${RUNTIME.platform}`);
    }
  }

  appsScriptFetch(url, options = {}) {
    // Apps Script URL Fetch service
    const params = {
      method: options.method || 'GET',
      headers: options.headers || {},
      muteHttpExceptions: true,
      followRedirects: true
    };
    
    if (options.body) {
      params.payload = options.body;
      if (options.headers && options.headers['Content-Type'] === 'application/json') {
        params.contentType = 'application/json';
      }
    }
    
    try {
      const response = UrlFetchApp.fetch(url, params);
      return {
        ok: response.getResponseCode() >= 200 && response.getResponseCode() < 300,
        status: response.getResponseCode(),
        statusText: response.getResponseCode() === 200 ? 'OK' : 'Error',
        headers: { 'content-type': response.getContentType() },
        json: () => Promise.resolve(JSON.parse(response.getContentText())),
        text: () => Promise.resolve(response.getContentText())
      };
    } catch (error) {
      throw new Error(`Apps Script fetch failed: ${error.message}`);
    }
  }

  async registerAPI(name, config) {
    console.log(`🌐 Registering API: ${name}`);
    
    const apiConfig = {
      baseURL: config.baseURL,
      timeout: config.timeout || this.config.defaultTimeout,
      headers: config.headers || {},
      auth: config.auth,
      rateLimit: config.rateLimit,
      retry: config.retry !== undefined ? config.retry : this.config.retryAttempts,
      ...config
    };
    
    this.apiClients.set(name, apiConfig);
    
    // Initialize circuit breaker
    this.circuits.set(name, {
      failures: 0,
      lastFailure: 0,
      state: 'CLOSED' // CLOSED, OPEN, HALF_OPEN
    });
    
    // Initialize rate limiter if configured
    if (apiConfig.rateLimit) {
      this.rateLimiters.set(name, {
        requests: [],
        windowMs: apiConfig.rateLimit.windowMs || 60000,
        maxRequests: apiConfig.rateLimit.maxRequests || 60
      });
    }
    
    return apiConfig;
  }

  async callAPI(apiName, endpoint, options = {}) {
    const apiConfig = this.apiClients.get(apiName);
    if (!apiConfig) {
      throw new Error(`API not registered: ${apiName}`);
    }
    
    // Check circuit breaker
    if (this.isCircuitOpen(apiName)) {
      throw new Error(`Circuit breaker open for API: ${apiName}`);
    }
    
    // Check rate limit
    await this.checkRateLimit(apiName);
    
    const url = new URL(endpoint, apiConfig.baseURL).toString();
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        ...apiConfig.headers,
        ...options.headers
      },
      timeout: options.timeout || apiConfig.timeout
    };
    
    // Add authentication
    this.addAuthentication(requestOptions, apiConfig.auth);
    
    // Add body for POST/PUT/PATCH
    if (options.body && ['POST', 'PUT', 'PATCH'].includes(requestOptions.method)) {
      if (typeof options.body === 'object') {
        requestOptions.body = JSON.stringify(options.body);
        requestOptions.headers['Content-Type'] = 'application/json';
      } else {
        requestOptions.body = options.body;
      }
    }
    
    // Add query parameters
    if (options.params) {
      const urlObj = new URL(url);
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          urlObj.searchParams.append(key, String(value));
        }
      });
      requestOptions.url = urlObj.toString();
    } else {
      requestOptions.url = url;
    }
    
    let lastError;
    
    // Retry logic
    for (let attempt = 0; attempt <= apiConfig.retry; attempt++) {
      try {
        const response = await this.fetch(requestOptions.url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Reset circuit breaker on success
        this.resetCircuit(apiName);
        
        return {
          success: true,
          data,
          status: response.status,
          headers: response.headers,
          attempt: attempt + 1
        };
        
      } catch (error) {
        lastError = error;
        
        // Record failure for circuit breaker
        this.recordFailure(apiName);
        
        if (attempt < apiConfig.retry) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Retry ${attempt + 1}/${apiConfig.retry} after ${delay}ms`);
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError;
  }

  async callWithOAuth(apiName, endpoint, options = {}) {
    const apiConfig = this.apiClients.get(apiName);
    if (!apiConfig?.auth?.type === 'oauth2') {
      throw new Error(`OAuth2 not configured for API: ${apiName}`);
    }
    
    // Get or refresh token
    const token = await this.getOAuthToken(apiName);
    
    const requestOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    };
    
    return this.callAPI(apiName, endpoint, requestOptions);
  }

  async getOAuthToken(apiName) {
    const apiConfig = this.apiClients.get(apiName);
    const authConfig = apiConfig.auth;
    
    // Check if token exists and is valid
    const tokenKey = `oauth_token_${apiName}`;
    let tokenData = this.getStoredToken(tokenKey);
    
    if (tokenData && tokenData.expires_at > Date.now()) {
      return tokenData.access_token;
    }
    
    // Need to refresh or get new token
    const tokenUrl = authConfig.tokenURL;
    const params = tokenData ? {
      grant_type: 'refresh_token',
      refresh_token: tokenData.refresh_token,
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret
    } : {
      grant_type: 'authorization_code',
      code: authConfig.code,
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      redirect_uri: authConfig.redirectURI
    };
    
    const response = await this.fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params).toString()
    });
    
    if (!response.ok) {
      throw new Error('Failed to get OAuth token');
    }
    
    const newTokenData = await response.json();
    newTokenData.expires_at = Date.now() + (newTokenData.expires_in * 1000);
    
    this.storeToken(tokenKey, newTokenData);
    return newTokenData.access_token;
  }

  async sendWebhook(url, payload, options = {}) {
    const webhookOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(payload),
      timeout: options.timeout || 10000
    };
    
    // Add signature if secret is provided
    if (options.secret) {
      const signature = this.createWebhookSignature(payload, options.secret);
      webhookOptions.headers['X-Webhook-Signature'] = signature;
    }
    
    try {
      const response = await this.fetch(url, webhookOptions);
      return {
        success: response.ok,
        status: response.status,
        data: await response.text()
      };
    } catch (error) {
      console.error('Webhook failed:', error);
      return { success: false, error: error.message };
    }
  }

  createWebhookSignature(payload, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }

  async manageAPIKey(apiName, keyName, keyValue) {
    this.apiKeys.set(`${apiName}_${keyName}`, {
      value: keyValue,
      createdAt: Date.now(),
      lastUsed: Date.now()
    });
    
    // Encrypt if possible
    if (RUNTIME.platform === 'node') {
      const crypto = await import('crypto');
      const cipher = crypto.createCipher('aes-256-gcm', this.config.encryptionKey);
      const encrypted = cipher.update(keyValue, 'utf8', 'hex') + cipher.final('hex');
      this.apiKeys.set(`${apiName}_${keyName}`, {
        ...this.apiKeys.get(`${apiName}_${keyName}`),
        encrypted,
        iv: cipher.getAuthTag().toString('hex')
      });
    }
  }

  getAPIKey(apiName, keyName) {
    const key = this.apiKeys.get(`${apiName}_${keyName}`);
    return key?.value || null;
  }

  // Circuit breaker methods
  isCircuitOpen(apiName) {
    const circuit = this.circuits.get(apiName);
    if (!circuit) return false;
    
    if (circuit.state === 'OPEN') {
      // Check if reset timeout has passed
      if (Date.now() - circuit.lastFailure > this.config.circuitBreaker.resetTimeout) {
        circuit.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    
    return false;
  }

  recordFailure(apiName) {
    const circuit = this.circuits.get(apiName);
    if (!circuit) return;
    
    circuit.failures++;
    circuit.lastFailure = Date.now();
    
    if (circuit.failures >= this.config.circuitBreaker.failureThreshold) {
      circuit.state = 'OPEN';
      console.warn(`⚠️ Circuit breaker OPEN for ${apiName}`);
    }
  }

  resetCircuit(apiName) {
    const circuit = this.circuits.get(apiName);
    if (!circuit) return;
    
    circuit.failures = 0;
    circuit.state = 'CLOSED';
  }

  // Rate limiting methods
  async checkRateLimit(apiName) {
    const limiter = this.rateLimiters.get(apiName);
    if (!limiter) return;
    
    const now = Date.now();
    const windowStart = now - limiter.windowMs;
    
    // Remove old requests
    limiter.requests = limiter.requests.filter(time => time > windowStart);
    
    if (limiter.requests.length >= limiter.maxRequests) {
      const oldestRequest = limiter.requests[0];
      const waitTime = windowStart + limiter.windowMs - now;
      
      if (waitTime > 0) {
        console.log(`⏳ Rate limit hit for ${apiName}, waiting ${waitTime}ms`);
        await this.sleep(waitTime);
      }
    }
    
    limiter.requests.push(now);
  }

  // Helper methods
  addAuthentication(options, authConfig) {
    if (!authConfig) return;
    
    switch (authConfig.type) {
      case 'basic':
        const credentials = btoa(`${authConfig.username}:${authConfig.password}`);
        options.headers['Authorization'] = `Basic ${credentials}`;
        break;
        
      case 'bearer':
        options.headers['Authorization'] = `Bearer ${authConfig.token}`;
        break;
        
      case 'apiKey':
        if (authConfig.in === 'header') {
          options.headers[authConfig.name] = authConfig.value;
        } else if (authConfig.in === 'query') {
          // Will be handled by URL params
        }
        break;
    }
  }

  getStoredToken(key) {
    // Platform-specific token storage
    switch (RUNTIME.platform) {
      case 'node':
        const fs = require('fs').promises;
        try {
          const data = fs.readFileSync(`./tokens/${key}.json`, 'utf8');
          return JSON.parse(data);
        } catch {
          return null;
        }
        
      case 'browser':
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
        
      case 'appscript':
        const props = PropertiesService.getScriptProperties();
        const data = props.getProperty(key);
        return data ? JSON.parse(data) : null;
        
      default:
        return null;
    }
  }

  storeToken(key, tokenData) {
    switch (RUNTIME.platform) {
      case 'node':
        const fs = require('fs').promises;
        const path = require('path');
        const dir = path.dirname(`./tokens/${key}.json`);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`./tokens/${key}.json`, JSON.stringify(tokenData));
        break;
        
      case 'browser':
        localStorage.setItem(key, JSON.stringify(tokenData));
        break;
        
      case 'appscript':
        PropertiesService.getScriptProperties().set