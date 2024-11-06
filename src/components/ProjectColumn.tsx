import React from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface ProjectColumnProps {
  project: string;
  tasks: Task[];
  onProjectChange: (id: string, project: string) => void;
  onToggleExpand: (id: string) => void;
  onPriorityChange: (id: string, priority: 'Low' | 'Medium' | 'High') => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string) => void;
}

const projectColors = {
  'Uncategorized': 'bg-gray-400',
  'Personal': 'bg-sky-500',
  'Work': 'bg-violet-500',
  'Health': 'bg-emerald-500',
  'Shopping': 'bg-amber-500',
  'Learning': 'bg-indigo-500',
  'Travel': 'bg-rose-500',
  'Home': 'bg-teal-500',
  'Finance': 'bg-lime-500'
};

// Keep track of used colors
const usedColors = new Set<string>();

// Generate consistent color for new projects
const getProjectColor = (project: string) => {
  if (!project || project === 'Uncategorized') return projectColors['Uncategorized'];
  
  if (projectColors[project as keyof typeof projectColors]) {
    return projectColors[project as keyof typeof projectColors];
  }

  // Get available colors (excluding Uncategorized and already used colors)
  const availableColors = Object.values(projectColors)
    .slice(1) // Exclude Uncategorized
    .filter(color => !usedColors.has(color));

  // If all colors are used, reset the used colors set
  if (availableColors.length === 0) {
    usedColors.clear();
    return getProjectColor(project); // Retry with cleared set
  }

  // Hash the project name to consistently select a color
  const hash = project.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const selectedColor = availableColors[hash % availableColors.length];
  
  // Mark the color as used
  usedColors.add(selectedColor);
  return selectedColor;
};

export function ProjectColumn({
  project,
  tasks,
  onProjectChange,
  onToggleExpand,
  onPriorityChange,
  onDelete,
  onAddSubtask
}: ProjectColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const column = e.currentTarget as HTMLDivElement;
    if (!column.classList.contains('bg-blue-50')) {
      column.classList.add('bg-blue-50');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const column = e.currentTarget as HTMLDivElement;
    column.classList.remove('bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const column = e.currentTarget as HTMLDivElement;
    column.classList.remove('bg-blue-50');
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onProjectChange(taskId, project);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getProjectColor(project)}`} />
          <h2 className="font-medium text-gray-900">{project}</h2>
          <span className="ml-1 bg-gray-100 text-gray-600 text-sm px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      <div
        className="bg-gray-50 rounded-xl p-4 flex-1 min-h-[calc(100vh-200px)] transition-colors duration-200"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={() => {}}
              onToggleExpand={onToggleExpand}
              onPriorityChange={onPriorityChange}
              onDelete={onDelete}
              onAddSubtask={onAddSubtask}
            />
          ))
        )}
      </div>
    </div>
  );
}