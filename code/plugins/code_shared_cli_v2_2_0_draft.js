import fs from "node:fs";
import path from "node:path";

export function buildMenuLines() {
  return [
    "ourActionLang CLI Menu",
    "",
    "1. init      - create/select project scaffold",
    "2. define    - parse definitions and build AST",
    "3. validate  - strict validation without execute",
    "4. compile   - compile plan from definitions",
    "5. run       - execute plan (strict/tolerant)",
    "6. activity  - generate runtime activity records",
    "7. index     - build/activate data index",
    "8. release   - create release snapshot",
    "9. rollback  - rollback to previous/target release",
    "10. doctor   - run health checks",
    "",
    "Definition-driven nested menu:",
    "  oal menu --menu-file ./definitions/cli_menu.ourlang",
    "  oal menu --path main_menu/index_menu",
    "  oal menu --path main_menu --select compile",
    "",
    "Examples:",
    "  oal compile --input \"- @def: Create utility TaskSorter\"",
    "  oal run --file ./input_oal/input_oal.txt --mode strict --backend default",
    "  oal activity --input \"make memo\" --actor user_1"
  ];
}

export function parseCliRequest(argv = []) {
  const out = {
    command: "",
    input: "",
    file: "",
    execute: false,
    backend: "",
    continueOnError: false,
    storage: "",
    mode: "tolerant",
    actor: "system",
    activate: false,
    to: "",
    project: "ourActionLang",
    template: "",
    help: false,
    menu: false,
    menuFile: "",
    menuPath: "",
    select: ""
  };

  const knownCommands = new Set([
    "init",
    "define",
    "validate",
    "compile",
    "run",
    "activity",
    "index",
    "release",
    "rollback",
    "doctor",
    "menu"
  ]);

  let i = 0;
  if (argv.length > 0 && knownCommands.has(String(argv[0]).toLowerCase())) {
    out.command = String(argv[0]).toLowerCase();
    i = 1;
  }

  for (; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--help") {
      out.help = true;
      continue;
    }
    if (token === "--menu") {
      out.menu = true;
      continue;
    }
    if (token === "--execute") {
      out.execute = true;
      continue;
    }
    if (token === "--continue-on-error") {
      out.continueOnError = true;
      continue;
    }
    if (token === "--activate") {
      out.activate = true;
      continue;
    }
    if (token === "--input") {
      out.input = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--file") {
      out.file = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--backend") {
      out.backend = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--storage") {
      out.storage = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--mode") {
      out.mode = argv[i + 1] ?? "tolerant";
      i += 1;
      continue;
    }
    if (token === "--actor") {
      out.actor = argv[i + 1] ?? "system";
      i += 1;
      continue;
    }
    if (token === "--to") {
      out.to = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--project") {
      out.project = argv[i + 1] ?? "ourActionLang";
      i += 1;
      continue;
    }
    if (token === "--template") {
      out.template = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--menu-file") {
      out.menuFile = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--path") {
      out.menuPath = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
    if (token === "--select") {
      out.select = argv[i + 1] ?? "";
      i += 1;
      continue;
    }
  }

  if (!out.command) {
    if (out.menu || out.menuFile || out.menuPath || out.select) {
      out.command = "menu";
    } else if (out.input || out.file) {
      out.command = "compile";
    }
  }

  return out;
}

export function loadInputFromArgs(args) {
  if (args.input && args.input.trim()) {
    return args.input.trim();
  }
  if (args.file && args.file.trim()) {
    const filePath = path.resolve(args.file);
    return fs.readFileSync(filePath, "utf-8");
  }
  return "";
}

export function inferEntityFromCommand(command) {
  if (typeof command !== "string" || command.length === 0) {
    return "unknown_entity";
  }
  const parts = command.split("_");
  if (parts.length <= 1) {
    return "generic_entity";
  }
  return parts.slice(1).join("_");
}

export function generateActivitiesFromReport(report, actor = "system") {
  const activities = [];
  const plan = Array.isArray(report?.plan) ? report.plan : [];
  const traceId = typeof report?.trace_id === "string" ? report.trace_id : "trace_unknown";
  for (let i = 0; i < plan.length; i += 1) {
    const item = plan[i];
    const actionRef = item?.command ?? "unknown_action";
    const entityRef = inferEntityFromCommand(actionRef);
    activities.push({
      activity_id: `activity_${i}`,
      actor,
      action_ref: actionRef,
      entity_ref: entityRef,
      payload: item?.payload ?? {},
      timestamp: new Date().toISOString(),
      outcome: "planned",
      trace_id: traceId
    });
  }
  return activities;
}

export function parseSimpleCommand(commandText = "") {
  const tokens = [];
  const text = String(commandText);
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    tokens.push(m[1] ?? m[2] ?? m[3] ?? "");
  }
  return tokens.filter(Boolean);
}

function parseItemList(content) {
  const hasItemsMatch = content.match(/has items\s+(.+)$/i);
  if (!hasItemsMatch) {
    return [];
  }
  const raw = hasItemsMatch[1];
  return raw
    .split(",")
    .map((item) => item.trim())
    .map((item) => item.replace(/^"|"$/g, ""))
    .filter(Boolean)
    .map((item) => item.replace(/\s+/g, "_").toLowerCase());
}

function ensureMenu(menus, id) {
  if (!menus[id]) {
    menus[id] = { id, items: [] };
  }
}

function ensureMenuItem(menu, itemId) {
  let item = menu.items.find((it) => it.id === itemId);
  if (!item) {
    item = { id: itemId, label: itemId, action_type: "none", target: "" };
    menu.items.push(item);
  }
  return item;
}

function inferScopeMenuId(flowContent, fallbackMenuId) {
  const scopeMatch = flowContent.match(/\[in\s+"([^"]+)"\]/i);
  if (scopeMatch) {
    return scopeMatch[1];
  }
  return fallbackMenuId;
}

export function parseMenuDefinitions(definitionText = "") {
  const menus = {};
  let currentMenuId = "";
  let rootMenuId = "";

  const lines = String(definitionText).split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    const directive = line.match(/^-+\s*@([a-z]+):\s*(.*)$/i);
    if (!directive) {
      continue;
    }
    const keyword = directive[1].toLowerCase();
    const content = directive[2];

    if (keyword === "def") {
      const menuDef = content.match(/menu named "([^"]+)"/i);
      if (menuDef) {
        currentMenuId = menuDef[1];
        if (!rootMenuId) {
          rootMenuId = currentMenuId;
        }
        ensureMenu(menus, currentMenuId);
      }
      continue;
    }

    if (keyword === "fact") {
      if (!currentMenuId) continue;
      ensureMenu(menus, currentMenuId);
      const items = parseItemList(content);
      for (let j = 0; j < items.length; j += 1) {
        ensureMenuItem(menus[currentMenuId], items[j]);
      }
      continue;
    }

    if (keyword === "flow") {
      const menuId = inferScopeMenuId(content, currentMenuId);
      if (!menuId) continue;
      ensureMenu(menus, menuId);

      const cmdMatch = content.match(/selects\s+"([^"]+)"\s*,\s*call command\s+"([^"]+)"/i);
      if (cmdMatch) {
        const itemId = cmdMatch[1].replace(/\s+/g, "_").toLowerCase();
        const item = ensureMenuItem(menus[menuId], itemId);
        item.action_type = "command";
        item.target = cmdMatch[2];
        continue;
      }

      const submenuMatch = content.match(/selects\s+"([^"]+)"\s*,\s*open submenu\s+"([^"]+)"/i);
      if (submenuMatch) {
        const itemId = submenuMatch[1].replace(/\s+/g, "_").toLowerCase();
        const item = ensureMenuItem(menus[menuId], itemId);
        item.action_type = "submenu";
        item.target = submenuMatch[2];
        ensureMenu(menus, submenuMatch[2]);
        continue;
      }

      const gotoMatch = content.match(/selects\s+"([^"]+)"\s*,\s*go to\s+"([^"]+)"/i);
      if (gotoMatch) {
        const itemId = gotoMatch[1].replace(/\s+/g, "_").toLowerCase();
        const item = ensureMenuItem(menus[menuId], itemId);
        item.action_type = "submenu";
        item.target = gotoMatch[2];
        ensureMenu(menus, gotoMatch[2]);
      }
    }
  }

  return {
    root_menu_id: rootMenuId || Object.keys(menus)[0] || "",
    menus
  };
}

export function resolveMenuByPath(menuModel, pathExpression = "") {
  const menus = menuModel?.menus ?? {};
  const root = menuModel?.root_menu_id ?? "";

  if (!pathExpression || !pathExpression.trim()) {
    return menus[root] ?? null;
  }

  const rawSegments = pathExpression
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);

  if (rawSegments.length === 0) {
    return menus[root] ?? null;
  }

  const last = rawSegments[rawSegments.length - 1];
  if (menus[last]) {
    return menus[last];
  }

  return null;
}

export function renderMenu(menu) {
  if (!menu) {
    return ["Menu not found."];
  }
  const lines = [`Menu: ${menu.id}`];
  if (!Array.isArray(menu.items) || menu.items.length === 0) {
    lines.push("(no items)");
    return lines;
  }
  for (let i = 0; i < menu.items.length; i += 1) {
    const item = menu.items[i];
    let suffix = "";
    if (item.action_type === "command") {
      suffix = ` -> command: ${item.target}`;
    } else if (item.action_type === "submenu") {
      suffix = ` -> submenu: ${item.target}`;
    }
    lines.push(`${i + 1}. ${item.id}${suffix}`);
  }
  return lines;
}
