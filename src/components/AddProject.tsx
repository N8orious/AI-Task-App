import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddProjectProps {
  onAddProject: (projectName: string) => void;
}

export function AddProject({ onAddProject }: AddProjectProps) {
  const [newProject, setNewProject] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.trim()) {
      onAddProject(newProject.trim());
      setNewProject('');
      setIsAddingProject(false);
    }
  };

  return (
    <div className="flex flex-col">
      {isAddingProject ? (
        <form onSubmit={handleAddProject} className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="Project name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingProject(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingProject(true)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600
                   hover:text-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      )}
    </div>
  );
}