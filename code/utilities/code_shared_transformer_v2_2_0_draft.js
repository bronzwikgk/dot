/**
 * @objective: Produce index-ready structural models from AST.
 * @roadmap: Lifecycle stage: transform_models.
 */
export class ourActionLang_Transformer_v2_2_0_ready_Gem {
  transform(ast) {
    const children = Array.isArray(ast?.children) ? ast.children : [];

    const datalist = children.map((node, index) => ({
      id: node.id ?? `ast_node_${index}`,
      type: node.type ?? "unknown",
      attributes: node.attributes ?? {},
      meta: node.meta ?? {}
    }));

    const entitySet = new Set();
    for (let i = 0; i < children.length; i += 1) {
      const attrs = children[i]?.attributes ?? {};
      if (typeof attrs.entity_type === "string" && attrs.entity_type.length > 0) {
        entitySet.add(attrs.entity_type);
      }
    }

    const schemaModel = {
      entities: [...entitySet].map((entity) => ({ name: entity, source: "ast" })),
      directives: children
        .filter((node) => typeof node.type === "string" && node.type.startsWith("directive_"))
        .map((node) => ({
          keyword: node.attributes?.keyword ?? "unknown",
          content: node.attributes?.content ?? ""
        }))
    };

    const datatree = {
      id: "ast_root",
      type: "root",
      children: datalist.map((node) => ({ id: node.id, type: node.type }))
    };

    return {
      schemaModel,
      datalist,
      datatree
    };
  }
}

export default ourActionLang_Transformer_v2_2_0_ready_Gem;
