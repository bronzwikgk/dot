/*
Overview: Validate the dot ActionFs helper by exercising file/folder operations in isolation.
Purpose: Give operators confidence that folder creation, serialization, copying, moving, and cleanup all work.
Audience: Developers needing to verify the ActionFs contract without running the full ActionEntity story.
Problem Addressed: Ensures the shared filesystem helper behaves correctly across common workflows.
Use Cases: Create files, append data, copy/move items, rename entries, and clear directories programmatically.
Features: Read, write, append, copy, move, rename, and clear operations; logs each step for troubleshooting.
Benefits: Detect regressions early and document ActionFs reliability in a dedicated test run.
User Stories: As a maintainer I can run this helper to confirm configuration-free folder utilities before release.
User Flow: The script executes sequential operations, logging progress and timing, and removes artifacts afterward.
System Components: Depends on `ActionFs` from the plugin directory and Node's `path` primitives.
Edge Cases: Handles missing directories gracefully and cleans up even if earlier operations fail.
Test Cases: Creation/read/append/copy/move/rename/clear through the ActionFs public API.
Configuration:
- version: v1.0.0
- status: inprogress
- agent: KW-wonderAgent
Schema:
- type: object
- properties:
  - ActionFs: object
  - path: object
*/

import path from 'path';
import { ActionFs } from '../../shunya/src/plugins/actionEntity/dot-actionFs-v1.0.0-inprogress-KW-wonderAgent.js';

const regeneratePath = path.resolve('./actionfs-test');
const actionFs = new ActionFs(regeneratePath);

async function run() {
  console.log('ActionFs test: starting workspace at', regeneratePath);

  const inputDir = path.join(regeneratePath, 'inputs');
  const outputDir = path.join(regeneratePath, 'outputs');
  const primaryFile = path.join(inputDir, 'origin.txt');
  const copiedFile = path.join(outputDir, 'origin-copy.txt');
  const movedFile = path.join(outputDir, 'moved', 'origin-final.txt');

  await actionFs.createFile(primaryFile, 'initial content');
  const initialContent = await actionFs.readFile(primaryFile);
  console.log('Read initial content:', initialContent);

  await actionFs.appendToFile(primaryFile, '\nadditional line');
  const appendedContent = await actionFs.readFile(primaryFile);
  console.log('Read after append:', appendedContent);

  await actionFs.copyFile(primaryFile, copiedFile);
  await actionFs.move(copiedFile, movedFile);
  await actionFs.renameItem(movedFile, path.join(outputDir, 'final.txt'));

  const exists = await actionFs.fileExists(path.join(outputDir, 'final.txt'));
  console.log('Final file exists:', exists);

  const outputEntries = await actionFs.readdir(outputDir);
  console.log('Output directory contents:', outputEntries);

  if (await actionFs.fileExists(primaryFile)) {
    await actionFs.clearDirectory(inputDir);
  }

  if (await actionFs.fileExists(outputDir)) {
    await actionFs.clearDirectory(outputDir);
  }

  if (await actionFs.fileExists(regeneratePath)) {
    await actionFs.rmdir(regeneratePath);
  }

  console.log('ActionFs test: completed, workspace cleaned');
}

run().catch(function (error) {
  console.error('ActionFs test failure', error);
  process.exit(1);
});
