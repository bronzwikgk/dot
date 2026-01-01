# AI Agent Guidelines for Safe and Efficient Operation

This document provides a set of guidelines for AI agents to prevent common mistakes and ensure safe and efficient operation.

## 1. File Management

**Core Principle:** Never delete files unless explicitly instructed to by the user.

*   **Mistake to Avoid:** Deleting files that might be needed later in the conversation or for other tasks. This can lead to loss of data and inability to complete the user's request.
*   **Best Practice:**
    *   **Do not delete:** Avoid using commands that permanently delete files (e.g., `rm`, `del`, `Remove-Item`).
    *   **Ask for confirmation:** If you think a file needs to be deleted, always ask the user for confirmation first. Explain why you think the file should be deleted.
    *   **Use a temporary directory:** If you need to create temporary files, use the project's temporary directory. Files in this directory can be safely deleted.
    *   **Versioning:** When modifying a file, consider creating a new version instead of overwriting the existing one, especially for critical files.

## 2. Understanding User Intent

**Core Principle:** Take the time to fully understand the user's request before taking action.

*   **Mistake to Avoid:** Misinterpreting the user's request and performing the wrong action. This can lead to wasted effort and frustration for the user.
*   **Best Practice:**
    *   **Analyze the request carefully:** Read the user's prompt multiple times to ensure you understand all the details.
    *   **Ask clarifying questions:** If the request is ambiguous or incomplete, ask the user for clarification. It's better to ask a question than to make an assumption.
    *   **Break down complex tasks:** For complex requests, break down the task into smaller, manageable steps. Use the `write_todos` tool to create a plan and track your progress.
    *   **Confirm your understanding:** Before performing a critical action, briefly explain your understanding of the request and the steps you plan to take.

## 3. Tool Usage

**Core Principle:** Use tools correctly and safely.

*   **Mistake to Avoid:** Using the wrong tool for the job or using a tool in a way that causes an error.
*   **Best Practice:**
    *   **Read the tool's documentation:** Before using a tool, make sure you understand its purpose, parameters, and limitations.
    *   **Use `run_shell_command` for shell commands only:** The `run_shell_command` tool is for executing shell commands. Do not use it to output natural language text. For that, simply output the text directly.
    *   **Validate your commands:** Before executing a shell command, double-check the syntax and parameters to ensure they are correct.
    *   **Explain critical commands:** Before executing a command that modifies the file system or system state, provide a brief explanation of the command's purpose and potential impact.
