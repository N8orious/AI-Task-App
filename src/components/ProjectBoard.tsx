import React from 'react';
import { Task } from '../types/task';
import { ProjectColumn } from './ProjectColumn';
import { AddProject } from './AddProject';

interface ProjectBoardProps {
  tasks: Task[];
  projects: string[];
  onProjectChange: (id: string, project: string) => void;
  onToggleExpand: (id: string) => void;
  onPriorityChange: (id: string, priority: 'Low' | 'Medium' | 'High') => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string) => void;
  onAddProject: (projectName: string) => void;
}

export function ProjectBoard({
  tasks,
  projects,
  onProjectChange,
  onToggleExpand,
  onPriorityChange,
  onDelete,
  onAddSubtask,
  onAddProject
}: ProjectBoardProps) {
  const priorityOrder = {
    'High': 0,
    'Medium': 1,
    'Low': 2
  };

  const sortByPriority = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      const priorityA = a.priority || 'Low';
      const priorityB = b.priority || 'Low';
      return priorityOrder[priorityA] - priorityOrder[priorityB];
    });
  };

  const getProjectTasks = (project: string) => {
    return sortByPriority(
      tasks.filter(task => {
        if (project === 'Uncategorized') {
          return !task.project || task.project === 'Uncategorized' || task.project === '';
        }
        return task.project === project;
      })
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
      {projects.map(project => (
        <ProjectColumn
          key={project}
          project={project}
          tasks={getProjectTasks(project)}
          onProjectChange={onProjectChange}
          onToggleExpand={onToggleExpand}
          onPriorityChange={onPriorityChange}
          onDelete={onDelete}
          onAddSubtask={onAddSubtask}
        />
      ))}
      <AddProject onAddProject={onAddProject} />
    </div>
  );
}