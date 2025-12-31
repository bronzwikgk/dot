
/**
 * @fileoverview ActionFS is a utility module designed for AI agents to perform file system operations.
 * It provides a standardized and asynchronous interface for common file tasks,
 * ensuring consistency and error handling across different agent interactions.
 *
 * Features:
 * - Read and write file contents (`readFile`, `writeFile`).
 * - Check existence of files or directories (`exists`).
 * - Create and read directories (`mkdir`, `readdir`).
 * - Get file/directory statistics (`stat`).
 * - Delete files and directories (`rm`, `rmdir`).
 *
 * How to use:
 * Import the `actionFS` instance from this module into your agent's script.
 *
 * Example:
 * ```javascript
 * import { actionFS } from './src/actionFS.js';
 *
 * async function agentTask() {
 *   // Create a directory
 *   await actionFS.mkdir('new_folder');
 *
 *   // Write content to a file
 *   await actionFS.writeFile('new_folder/data.txt', 'Hello from AI Agent!');
 *
 *   // Read content from a file
 *   const content = await actionFS.readFile('new_folder/data.txt');
 *   console.log(content);
 *
 *   // Check if a file exists
 *   const fileExists = await actionFS.exists('new_folder/data.txt');
 *   console.log(`File exists: ${fileExists}`);
 * }
 *
 * agentTask();
 * ```
 */

import * as fs from 'fs/promises';
import path from 'path';

class ActionFS {
    /**
     * Reads the content of a file.
     * @param {string} filePath - The path to the file.
     * @param {string} [encoding='utf8'] - The file encoding.
     * @returns {Promise<string>} The content of the file.
     */
    async readFile(filePath, encoding = 'utf8') {
        try {
            return await fs.readFile(filePath, encoding);
        } catch (error) {
            console.error(`Error reading file at ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Writes content to a file.
     * @param {string} filePath - The path to the file.
     * @param {string} content - The content to write.
     * @param {string} [encoding='utf8'] - The file encoding.
     * @returns {Promise<void>}
     */
    async writeFile(filePath, content, encoding = 'utf8') {
        try {
            await fs.writeFile(filePath, content, encoding);
        } catch (error) {
            console.error(`Error writing to file at ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Checks if a file or directory exists.
     * @param {string} itemPath - The path to the file or directory.
     * @returns {Promise<boolean>} True if the item exists, false otherwise.
     */
    async exists(itemPath) {
        try {
            await fs.access(itemPath);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Creates a directory.
     * @param {string} dirPath - The path to the directory.
     * @param {object} [options={ recursive: true }] - The options for creating the directory.
     * @returns {Promise<void>}
     */
    async mkdir(dirPath, options = { recursive: true }) {
        try {
            await fs.mkdir(dirPath, options);
        } catch (error) {
            console.error(`Error creating directory at ${dirPath}:`, error);
            throw error;
        }
    }

    /**
     * Reads the content of a directory.
     * @param {string} dirPath - The path to the directory.
     * @returns {Promise<string[]>} An array of file and directory names.
     */
    async readdir(dirPath) {
        try {
            return await fs.readdir(dirPath);
        } catch (error) {
            console.error(`Error reading directory at ${dirPath}:`, error);
            throw error;
        }
    }

    /**
     * Gets the stats of a file or directory.
     * @param {string} itemPath - The path to the file or directory.
     * @returns {Promise<fs.Stats>} The stats of the item.
     */
    async stat(itemPath) {
        try {
            return await fs.stat(itemPath);
        } catch (error) {
            console.error(`Error getting stats for ${itemPath}:`, error);
            throw error;
        }
    }

    /**
     * Deletes a file.
     * @param {string} filePath - The path to the file.
     * @returns {Promise<void>}
     */
    async rm(filePath) {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error(`Error deleting file at ${filePath}:`, error);
            throw error;
        }
    }

    /**
     * Deletes a directory.
     * @param {string} dirPath - The path to the directory.
     * @param {object} [options={ recursive: true }] - The options for deleting the directory.
     * @returns {Promise<void>}
     */
    async rmdir(dirPath, options = { recursive: true }) {
        try {
            await fs.rmdir(dirPath, options);
        } catch (error) {
            console.error(`Error deleting directory at ${dirPath}:`, error);
            throw error;
        }
    }
}

export const actionFS = new ActionFS();
