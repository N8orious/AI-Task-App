import { Task, SubTask } from '../types/task';

interface ParsedLine {
  content: string;
  indentation: number;
}

export function parseTaskInput(input: string): Task[] {
  // Split input into lines and calculate indentation
  const lines = input.split('\n')
    .map(line => ({
      content: line.trim()
        .replace(/^[-*+]\s*(\[ \]|\[x\]|\[X\])?\s*/, '') // Remove Markdown task list syntax
        .replace(/^[-*+]\s+/, ''), // Remove any remaining list markers
      indentation: line.search(/\S|$/)
    }))
    .filter(line => line.content);

  if (lines.length === 0) return [];

  // Find the base indentation level (minimum non-zero indentation)
  const baseIndentation = Math.min(
    ...lines
      .map(line => line.indentation)
      .filter(indent => indent > 0)
  ) || 4; // Default to 4 spaces if no indentation found

  const tasks: Task[] = [];
  let currentTask: Task | null = null;
  let currentParent: Task | SubTask | null = null;
  let parentStack: (Task | SubTask)[] = [];
  let previousIndentLevel = 0;

  for (const line of lines) {
    const indentLevel = Math.floor(line.indentation / baseIndentation);

    // Create new task object
    const newTask: Task | SubTask = {
      id: crypto.randomUUID(),
      content: line.content,
      status: 'todo',
      subtasks: [],
      isExpanded: false, // Set to false by default
      priority: 'Low',
      project: 'Uncategorized', // Set default project for all new tasks
      ...(indentLevel === 0 && { project: 'Uncategorized' }) // Ensure root tasks have project set
    };

    if (indentLevel === 0) {
      // This is a root level task
      currentTask = newTask as Task;
      tasks.push(currentTask);
      parentStack = [currentTask];
      currentParent = null;
    } else {
      // Handle indentation changes
      if (indentLevel > previousIndentLevel) {
        // Going deeper - previous task becomes the parent
        currentParent = parentStack[parentStack.length - 1];
        parentStack.push(currentParent);
      } else if (indentLevel < previousIndentLevel) {
        // Going back up - pop from stack until we reach the correct level
        const levelsToGoUp = previousIndentLevel - indentLevel;
        for (let i = 0; i < levelsToGoUp + 1; i++) {
          parentStack.pop();
        }
        currentParent = parentStack[parentStack.length - 1];
      } else {
        // Same level - use the same parent
        currentParent = parentStack[parentStack.length - 2]; // Get parent from stack
      }

      // Add subtask to current parent
      if (currentParent) {
        currentParent.subtasks.push(newTask as SubTask);
      }
    }

    previousIndentLevel = indentLevel;
  }

  return tasks;
}