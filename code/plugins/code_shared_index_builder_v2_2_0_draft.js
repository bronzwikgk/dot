import crypto from "node:crypto";

/**
 * @objective: Build immutable DataIndex artifact from datasets and stage metadata.
 * @roadmap: Lifecycle stage: index.
 */
export class ourActionLang_IndexBuilder_v2_2_0_ready_Gem {
  constructor(config = {}) {
    this.config = config;
  }

  buildIndex(input = {}) {
    const now = new Date().toISOString();
    const project = input.project ?? "ourActionLang";

    const data = {
      indexId: `dataIndex_${project}_master`,
      generatedAt: now,
      project,
      datasets: input.datasets ?? {},
      datalists: input.datalists ?? [],
      datatree: input.datatree ?? { type: "root", children: [] },
      deploy: input.deploy ?? {},
      meta: {
        version: input.version ?? "0.0.0-dev",
        immutable: true
      }
    };

    const payload = JSON.stringify(data);
    const checksum = crypto.createHash("sha256").update(payload).digest("hex");

    data.meta.checksum = checksum;
    return data;
  }
}

export default ourActionLang_IndexBuilder_v2_2_0_ready_Gem;
