import { entityDemoConfig } from "../config/entity_demo_config.js";
import { ActionEntity } from "./plugins/actionEntity_v1.js";
import { entityUniqueIdConfig } from "../config/entity_unique_id_config.js";
import { ActionValidator } from "./utils/ActionValidator_v2_3.js";
import { ActionEntityRequestSchema_v1 } from "../schema/actionEntity_request_schema_v1.js";

export const demoAppConfig = {
    name: "ehh-v-104 Demo",
    version: "1.0.0",
    viewRootId: "appview",
    datasets: [
        "dataset_entity_collection",
        "dataset_runtime",
        "dataset_navigation_routes",
        "dataset_user_flow"
    ],
    entityConfigs: {
        demo_user: entityDemoConfig,
        entity_unique_id: entityUniqueIdConfig
    },
    routes: [
        {
            path: "/",
            method: "GET",
            action: "site.home",
            target: "view.home",
            responseType: "html",
            targetFile: "./website/view_homepage.html",
            contentFile: "./website/view_homepage.html",
            isDefault: true
        },
        {
            path: "/app/dashboard",
            method: "GET",
            action: "app.dashboard",
            target: "view.dashboard",
            responseType: "html",
            targetFile: "./view/layout_app.html"
        },
        {
            path: "/app/site",
            method: "GET",
            action: "app.site",
            target: "view.site",
            responseType: "html",
            targetFile: "./view/layout_site.html",
            contentFile: "../website/view_site.html"
        },
        {
            path: "/api/v1/users",
            method: "GET",
            action: "api.users.list",
            target: "entity.demo_user",
            responseType: "json",
            entity: "demo_user"
        },
        {
            path: "/api/v1/users",
            method: "POST",
            action: "api.users.create",
            target: "entity.demo_user",
            responseType: "json",
            entity: "demo_user"
        },
        {
            path: "/api/v1/unique-id",
            method: "POST",
            action: "api.unique_id.create",
            target: "entity.unique_id",
            responseType: "json",
            entity: "entity_unique_id"
        }
    ]
};

const baseEventListeners = [
    { target: "window", event: "load", handler: "handleEvent" },
    { target: "document", event: "click", handler: "handleEvent" }
];

export const browserDemoConfig = {
    ...demoAppConfig,
    runtime: "browser",
    mode: "spa",
    listeners: baseEventListeners,
    viewRootId: demoAppConfig.viewRootId || "appview",
    theme: "ehh-dark",
    featureFlags: {
        enableHydration: true,
        enableDemoLogging: true
    }
};

export const nodeDemoConfig = {
    ...demoAppConfig,
    runtime: "node",
    mode: "server",
    listeners: [
        { target: "httpServer", event: "request", handler: "createNodeHandler" }
    ],
    server: {
        port: 4200,
        host: "127.0.0.1",
        cors: true
    },
    featureFlags: {
        enableApiLogging: true,
        enableAutoRestart: false
    }
};

export class ActionApp {
    constructor(config) {
        this.config = config;
        this.context = {
            routes: config.routes || [],
            history: [],
            currentRoute: null
        };
        this.viewRootId = config.viewRootId || "appview";
        this.entities = {};
        if (config && config.entityConfigs) {
            var entityKeys = Object.keys(config.entityConfigs);
            for (var idx = 0; idx < entityKeys.length; idx += 1) {
                var key = entityKeys[idx];
                this.entities[key] = config.entityConfigs[key];
            }
        }
        if (!this.entities.demo_user) {
            this.entities.demo_user = entityDemoConfig;
        }
        if (!this.entities.entity_unique_id) {
            this.entities.entity_unique_id = entityUniqueIdConfig;
        }
        this.entityCreator = new ActionEntity(this.entities);
        this.requestSchema = ActionEntityRequestSchema_v1;
    }

    // Initializes SPA listeners and triggers the default route during browser startups.
    start() {
        this.context.routes = this.config.routes || [];
        if (typeof window !== "undefined" && window.document) {
            this.bindEventListeners();
            var loadEvent = {
                type: "load",
                target: window,
                currentTarget: window
            };
            this.handleEvent(loadEvent);
        }
    }

    // Binds runtime listeners defined in config so the unified pipeline can run in the browser.
    bindEventListeners() {
        var self = this;
        var listeners = (this.config && this.config.listeners) || [];
        listeners.forEach(function (listener) {
            var target = self.resolveListenerTarget(listener.target);
            if (!target || typeof target.addEventListener !== "function") {
                return;
            }
            var handler =
                typeof listener.handler === "string" && typeof self[listener.handler] === "function"
                    ? self[listener.handler].bind(self)
                    : listener.handler;
            if (typeof handler !== "function") {
                return;
            }
            target.addEventListener(listener.event, handler);
        });
    }

    resolveListenerTarget(name) {
        if (name === "window" && typeof window !== "undefined") {
            return window;
        }
        if (name === "document" && typeof document !== "undefined") {
            return document;
        }
        return null;
    }

    // Normalizes DOM events into request objects and reroutes them through the pipeline.
    handleEvent(event) {
        var request = this.createRequestFromEvent(event);
        if (request) {
            console.log("[Layer] Event -> Intent", request);
            this.handleRequest(request);
        }
    }

    // Builds the request payload from SPA interactions, honoring data-route attributes.
    createRequestFromEvent(event) {
        var path = "/";
        var method = "GET";
        var payloadValue;
        if (event && event.type === "click") {
            var source = event.target;
            while (source && source !== document.body) {
                if (source.dataset && source.dataset.route) {
                    path = source.dataset.route;
                    if (source.dataset.method) {
                        method = source.dataset.method;
                    }
                    if (source.dataset.payload) {
                        try {
                            payloadValue = JSON.parse(source.dataset.payload);
                        } catch (parseError) {
                            console.warn("[Layer] Payload parse failed", parseError);
                        }
                    }
                    if (event && event.preventDefault) {
                        event.preventDefault();
                    }
                    break;
                }
                source = source.parentElement;
            }
        } else if (event && event.type === "load") {
            var defaultRoute = this.findDefaultRoute();
            if (defaultRoute) {
                path = defaultRoute.path;
            }
        }
        var request = {
            path: path,
            method: method,
            actor: "user",
            timestamp: new Date().toISOString()
        };
        request.payload = payloadValue !== undefined ? payloadValue : {};
        console.log("[Layer] Intent", request);
        return request;
    }

    // Finds the route marked as default for browser load events.
    findDefaultRoute() {
        var routes = this.context.routes;
        for (var index = 0; index < routes.length; index += 1) {
            var candidate = routes[index];
            if (candidate.isDefault) {
                return candidate;
            }
        }
        if (routes.length > 0) {
            return routes[0];
        }
        return null;
    }

    // Sends SPA requests through the execution model and renders HTML when suitable.
    handleRequest(request) {
        var route = this.processRequest(request);
        if (!route) {
            this.applyError("Route not found for " + request.path);
            return;
        }
        console.log("[Layer] Action", route);
        if (route.responseType === "json") {
            this.handleJsonRoute(route, request);
            return;
        }
        this.renderView(route, request);
    }

    // Matches a request against the configured route table using path + method.
    processRequest(request) {
        var routes = this.context.routes;
        for (var index = 0; index < routes.length; index += 1) {
            var candidate = routes[index];
            if (candidate.path === request.path && candidate.method === request.method) {
                console.log("[Layer] Context", {
                    route: candidate,
                    request: request
                });
                return candidate;
            }
        }
        return null;
    }

    // Fetches layout/view markup and renders it into the configured root element.
    renderView(route, request) {
        this.applyContext(route);
        console.log("[Layer] Cache", {
            route: route,
            history: this.context.history.slice(-1)
        });
        if (route.responseType !== "html") {
            return;
        }
        if (typeof window === "undefined" || !window.document) {
            return;
        }
        var rootElement = window.document.getElementById(this.viewRootId);
        if (!rootElement) {
            return;
        }
        var targetFile = route.targetFile;
        if (!targetFile) {
            return;
        }
        if (typeof fetch === "undefined") {
            rootElement.innerHTML = "<div>SPA render requires fetch support.</div>";
            return;
        }
        var self = this;
        var self = this;
        fetch(targetFile).then(function (response) {
            return response.text();
        }).then(async function (text) {
            var contextVars = {
                currentRoute: route.targetFile || targetFile,
                routePath: route.path,
                routeTarget: route.target,
                contentFile: route.contentFile || route.targetFile || targetFile
            };
            var resolvedText = await self.resolveIncludes(text, targetFile, contextVars);
            rootElement.innerHTML = resolvedText;
            console.log("[Layer] Effect -> Output", {
                route: route,
                htmlLength: resolvedText.length
            });
        }).catch(function () {
            rootElement.innerHTML = "<div>Rendering failed.</div>";
        });
    }

    async handleJsonRoute(route, request) {
        try {
            var normalizedRequest = this.validateEntityRequest(route, request);
            var response = await this.entityCreator.createEntity(normalizedRequest);
            console.log("[Layer] Effect -> Output", response);
            this.displayEntityResult(response);
        } catch (error) {
            console.error("[Layer] Entity Error", error);
        }
    }

    normalizeEntityRequest(route, request) {
        var normalized = request && typeof request === "object" ? { ...request } : {};
        if (route && route.entity) {
            normalized.targetName = normalized.targetName || route.entity;
        }
        normalized.payload = normalized.payload && typeof normalized.payload === "object" ? { ...normalized.payload } : {};
        return normalized;
    }

    validateEntityRequest(route, request) {
        if (!route || !route.entity) {
            throw new Error("Entity route missing target definition");
        }
        var normalized = this.normalizeEntityRequest(route, request);
        ActionValidator.validateAndThrow(normalized, this.requestSchema, {
            fieldPrefix: "request"
        });
        return normalized;
    }

    // Records context state every time a route completes so history + caching stay consistent.
    applyContext(route) {
        if (!this.context.history) {
            this.context.history = [];
        }
        this.context.currentRoute = route;
        this.context.history.push({
            path: route.path,
            action: route.action,
            timestamp: new Date().toISOString()
        });
        console.log("[Layer] Context -> History", this.context.history.slice(-2));
    }

    // Logs pipeline issues so developers can trace missing routes or data.
    applyError(message) {
        console.warn(message);
    }

    displayEntityResult(response) {
        if (typeof document === "undefined") {
            return;
        }
        var target = document.getElementById("unique-id-result");
        if (!target || !response || !response.payload) {
            return;
        }
        var payload = response.payload;
        target.textContent = `Generated ${payload.generatedId} for "${payload.itemName}" (index ${payload.index})`;
    }

    // Builds a server-side request descriptor from Node.js incoming HTTP data.
    createNodeRequest(req) {
        var base = "http://localhost";
        var parsed = new URL(req.url || "", base);
        var query = {};
        var iterator = parsed.searchParams.entries();
        var step = iterator.next();
        while (!step.done) {
            var pair = step.value;
            query[pair[0]] = pair[1];
            step = iterator.next();
        }
        var request = {
            path: parsed.pathname,
            method: req.method || "GET",
            query: query,
            actor: "system",
            headers: req.headers || {}
        };
        return request;
    }

    // Produces a handler that plugs directly into native Node.js HTTP servers.
    createNodeHandler() {
        var self = this;
        return function (req, res) {
            var request = self.createNodeRequest(req);
            var route = self.processRequest(request);
            if (!route) {
                self.sendJson(res, 404, {
                    error: "route_not_found",
                    path: request.path,
                    method: request.method
                });
                return;
            }
            if (route.responseType === "json") {
                self.collectRequestBody(req, function (bodyText) {
                    Promise.resolve(self.handleApiAction(route, request, bodyText, res)).catch(function (error) {
                        self.sendJson(res, 500, {
                            error: "handler_error",
                            message: error.message
                        });
                    });
                });
            } else {
                self.sendHtml(res, route).catch(function () {
                    self.sendJson(res, 500, {
                        error: "render_failed"
                    });
                });
            }
        };
    }

    // Gathers payload data from HTTP POST/PUT requests before validation.
    collectRequestBody(req, callback) {
        var payload = "";
        req.on("data", function (chunk) {
            payload += chunk;
        });
        req.on("end", function () {
            callback(payload);
        });
        req.on("error", function () {
            callback("");
        });
    }

    // Creates entities via ActionEntity and replies with standardized metadata.
    async handleApiAction(route, request, rawBody, res) {
        var payload = {};
        if (rawBody) {
            try {
                payload = JSON.parse(rawBody);
            } catch (error) {
                this.sendJson(res, 400, {
                    error: "invalid_json",
                    message: error.message
                });
                return;
            }
        }
        if (!route.entity) {
            this.sendJson(res, 400, {
                error: "missing_entity",
                message: "Route does not declare an entity target"
            });
            return;
        }
        try {
            var normalizedRequest = this.validateEntityRequest(route, { ...request, payload: payload });
            var response = await this.entityCreator.createEntity(normalizedRequest);
            console.log("[Layer] Effect -> Output", response);
            this.sendJson(res, 200, response);
        } catch (error) {
            this.sendJson(res, 500, {
                error: "entity_creation_failed",
                detail: error.message
            });
        }
    }

    // Sends JSON responses from the Node.js handler with proper headers.
    sendJson(res, statusCode, payload) {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = statusCode;
        res.end(JSON.stringify(payload));
    }

    // Streams HTML layouts into the HTTP response when JSON is not required.
    async sendHtml(res, route) {
        if (typeof window !== "undefined") {
            return;
        }
        var targetFile = route.targetFile || "";
        if (!targetFile) {
            this.sendJson(res, 500, {
                error: "missing_target_file"
            });
            return;
        }
        var content = "";
        try {
            var urlModule = await import("url");
            var pathModule = await import("path");
            var fsModule = await import("fs");
            var fileURL = urlModule.fileURLToPath(import.meta.url);
            var baseDir = pathModule.dirname(fileURL);
            var filePath = pathModule.resolve(baseDir, "..", targetFile);
            content = fsModule.readFileSync(filePath, "utf-8");
        } catch (error) {
            this.sendJson(res, 500, {
                error: "file_read_error",
                message: error.message
            });
            return;
        }
        res.setHeader("Content-Type", "text/html");
        res.statusCode = 200;
        res.end(content);
    }

    async resolveIncludes(html, targetPath, contextVars) {
        if (!html || typeof html !== "string") {
            return "";
        }
        var includeRegex = /include="([^"]+)"/g;
        var matches = [];
        var match;
        while ((match = includeRegex.exec(html)) !== null) {
            matches.push({
                fullMatch: match[0],
                path: match[1]
            });
        }
        if (matches.length === 0) {
            return html;
        }
        var resolved = html;
        for (var i = 0; i < matches.length; i += 1) {
            var entry = matches[i];
            var interpolatedPath = this.interpolatePath(entry.path, contextVars);
            var baseDir = this.resolveBasePath(targetPath);
            var resolvedPath = this.resolveRelativePath(baseDir, interpolatedPath);
            var includedText = "";
            try {
                var response = await fetch(resolvedPath);
                includedText = await response.text();
                includedText = await this.resolveIncludes(includedText, resolvedPath, contextVars);
            } catch (error) {
                includedText = "";
            }
            resolved = resolved.replace(entry.fullMatch, includedText);
        }
        return resolved;
    }

    resolveBasePath(targetPath) {
        if (!targetPath) {
            return "";
        }
        var idx = targetPath.lastIndexOf("/");
        if (idx >= 0) {
            return targetPath.substring(0, idx + 1);
        }
        return "";
    }

    resolveRelativePath(basePath, relativePath) {
        if (!relativePath) {
            return basePath;
        }
        var segments = [];
        if (basePath) {
            segments = basePath.split("/").filter(function (segment) {
                return segment.length > 0;
            });
        }
        var parts = relativePath.split("/");
        for (var idx = 0; idx < parts.length; idx += 1) {
            var part = parts[idx];
            if (!part || part === ".") {
                continue;
            }
            if (part === "..") {
                if (segments.length > 0) {
                    segments.pop();
                }
                continue;
            }
            segments.push(part);
        }
        var normalized = segments.join("/");
        if (relativePath.startsWith("../") || relativePath.startsWith("./")) {
            return normalized;
        }
        return "./" + normalized;
    }

    interpolatePath(path, vars) {
        if (!path || !vars) {
            return path;
        }
        return path.replace(/\{\{\s*([^\}]+)\s*\}\}/g, function (match, key) {
            var trimmed = key.trim();
            if (vars && trimmed in vars) {
                return vars[trimmed];
            }
            return match;
        });
    }
}

export const actionApp = ActionApp;
