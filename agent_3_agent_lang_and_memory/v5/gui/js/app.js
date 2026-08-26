import action_entity from "../../code/plugins/action_entity_v5_0_0.js";
import app_shell from "../../code/plugins/app_shell_v4_0_0.js";
import app_entry from "../../code/plugins/app_entry_v1_0_0.js";
import an_app_lang from "../../code/plugins/an_app_lang_v1_0_0.js";
import an_app_brain from "../../code/plugins/an_app_brain_v1_0_0.js";
import an_bot from "../../code/plugins/an_bot_v1_0_0.js";
import an_memory from "../../code/plugins/an_memory_v1_0_0.js";
import workflow_system from "../../code/plugins/workflow_system_v1_0_0.js";
import ui_surface from "../../code/plugins/ui_surface_v1_0_0.js";
import template_system from "../../code/plugins/template_system_v1_0_0.js";
import quality_audit from "../../code/plugins/quality_audit_v1_0_0.js";

const entry = new app_entry({ actor: "ui" });
const boot = await entry.boot({ name: "An App V5" });
const shell = entry.get_shell();
const lang = new an_app_lang({ actor: "ui" });
const brain = new an_app_brain({ actor: "ui" });
const bot = new an_bot({ actor: "ui" });
const memory = new an_memory({ actor: "ui" });
const wf = new workflow_system({ actor: "ui" });
const ui = new ui_surface({ actor: "ui" });
const tmpl = new template_system({ actor: "ui" });
const audit = new quality_audit({ actor: "ui" });

ui.register_layout("block_editor", (e) => ({ type: "block_editor", data: e }));
ui.register_layout("tree", (e) => ({ type: "tree", data: e }));
ui.register_layout("diagram", (e) => ({ type: "diagram", data: e }));
ui.register_layout("table", (e) => ({ type: "table", data: e }));
ui.register_layout("notebook", (e) => ({ type: "notebook", data: e }));
ui.register_layout("code_editor", (e) => ({ type: "code_editor", data: e }));

const book = shell.entities.create_book({ name: "My App" });
shell.entities.create_cell({ book_id: book.id, cell_type: "markdown", content: "Hello" });

const runBtn = document.getElementById("run_button");
const commandInput = document.getElementById("command_input");
const projectionView = document.getElementById("projection_view");
const propertiesPanel = document.getElementById("properties_panel");
const summaryGrid = document.getElementById("summary_grid");
const templateList = document.getElementById("template_list");

let currentLayout = "block_editor";

function render() {
  const result = ui.render(book, currentLayout);
  projectionView.innerHTML = `<pre>${JSON.stringify(result.data, null, 2)}</pre>`;
  const entities = shell.entities.query({});
  propertiesPanel.innerHTML = `<p>${entities.length} entities</p>`;
  summaryGrid.innerHTML = `<div class="summary_item"><strong>${entities.length}</strong>entities</div>`;
}

const templates = tmpl.list_templates();
templateList.innerHTML = templates.map((t) => `<button class="template_button">${t.name}</button>`).join("");

document.querySelectorAll(".projection_tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".projection_tabs .active")?.classList.remove("active");
    btn.classList.add("active");
    currentLayout = btn.dataset.profile;
    render();
  });
});

runBtn.addEventListener("click", () => {
  const text = commandInput.value;
  const pipeline_result = lang.pipeline(text);
  const brain_result = brain.pipeline(text);
  render();
});

render();
