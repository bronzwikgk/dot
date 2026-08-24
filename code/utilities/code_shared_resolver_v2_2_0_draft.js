/**
 * @objective: Resolve symbols, dependencies, and ambiguities from AST.
 * @roadmap: Lifecycle stage: resolve_dependencies.
 * @constraints: Deterministic, no AI heuristics.
 */
export class ourActionLang_Resolver_v2_2_0_ready_Gem {
  constructor(config = {}) {
    this.config = config;
  }

  resolve(ast) {
    const result = {
      symbols: {},
      dependencies: [],
      ambiguities: [],
      warnings: [],
      errors: [],
      graph: {
        nodes: [],
        edges: [],
        hasCycle: false,
        cyclePaths: []
      }
    };

    if (!ast || ast.type !== "root") {
      result.errors.push({
        stage: "resolve",
        code: "INVALID_AST",
        message: "Resolver expected root AST"
      });
      return result;
    }

    const children = Array.isArray(ast.children) ? ast.children : [];
    for (let i = 0; i < children.length; i += 1) {
      const node = children[i];
      const nodeId = this.nodeId(node, i);
      result.graph.nodes.push({ id: nodeId, type: node.type });

      if (i > 0) {
        const prevId = this.nodeId(children[i - 1], i - 1);
        result.graph.edges.push({ from: prevId, to: nodeId, relation: "next" });
        result.dependencies.push({ from: prevId, to: nodeId, relation: "next" });
      }

      if (node.type !== "literal") {
        const key = node.type;
        if (!result.symbols[key]) {
          result.symbols[key] = [];
        }
        result.symbols[key].push(nodeId);
      }

      if (node.type === "literal") {
        result.warnings.push({
          stage: "resolve",
          code: "UNRESOLVED_LITERAL",
          message: `Unresolved literal token '${String(node.value ?? "")}'`,
          nodeId
        });
      }

      const attrs = node.attributes ?? {};
      if (attrs && typeof attrs === "object" && attrs.ref) {
        const ref = String(attrs.ref);
        result.dependencies.push({ from: nodeId, to: ref, relation: "ref" });
        result.graph.edges.push({ from: nodeId, to: ref, relation: "ref" });
      }
    }

    const cycle = this.detectCycle(result.graph.nodes, result.graph.edges);
    result.graph.hasCycle = cycle.hasCycle;
    result.graph.cyclePaths = cycle.paths;

    if (cycle.hasCycle) {
      result.errors.push({
        stage: "resolve",
        code: "DEPENDENCY_CYCLE",
        message: "Dependency cycle detected",
        paths: cycle.paths
      });
    }

    return result;
  }

  nodeId(node, index) {
    if (node && typeof node === "object" && typeof node.id === "string" && node.id.length > 0) {
      return node.id;
    }
    return `ast_node_${index}`;
  }

  detectCycle(nodes, edges) {
    const adjacency = {};
    for (let i = 0; i < nodes.length; i += 1) {
      adjacency[nodes[i].id] = [];
    }

    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      if (!adjacency[edge.from]) {
        adjacency[edge.from] = [];
      }
      adjacency[edge.from].push(edge.to);
    }

    const visited = {};
    const visiting = {};
    const paths = [];

    const walk = (nodeId, stack) => {
      if (visiting[nodeId]) {
        const cycleStart = stack.indexOf(nodeId);
        const cyclePath = cycleStart >= 0 ? stack.slice(cycleStart).concat(nodeId) : [nodeId, nodeId];
        paths.push(cyclePath);
        return;
      }
      if (visited[nodeId]) {
        return;
      }

      visiting[nodeId] = true;
      stack.push(nodeId);

      const next = adjacency[nodeId] ?? [];
      for (let i = 0; i < next.length; i += 1) {
        walk(next[i], stack);
      }

      stack.pop();
      visiting[nodeId] = false;
      visited[nodeId] = true;
    };

    const ids = Object.keys(adjacency);
    for (let i = 0; i < ids.length; i += 1) {
      if (!visited[ids[i]]) {
        walk(ids[i], []);
      }
    }

    return { hasCycle: paths.length > 0, paths };
  }
}

export default ourActionLang_Resolver_v2_2_0_ready_Gem;
