import React, { useState } from 'react';
import { TaskInput } from './components/TaskInput';
import { KanbanBoard } from './components/KanbanBoard';
import { ProjectBoard } from './components/ProjectBoard';
import { CompactQuestProgress } from './components/CompactQuestProgress';
import { Task, TaskStatus, ViewMode } from './types/task';
import { parseTaskInput } from './utils/taskParser';
import { Layout } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('status');
  const [projects, setProjects] = useState<string[]>(['Uncategorized']);
  const [currentStage, setCurrentStage] = useState(1);

  // Calculate quest progress based on completed tasks
  React.useEffect(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const progress = totalTasks === 0 ? 1 : Math.ceil((completedTasks / totalTasks) * 5);
    setCurrentStage(Math.min(Math.max(progress, 1), 5));
  }, [tasks]);

  const handleTaskAdd = (content: string) => {
    const newTasks = parseTaskInput(content);
    setTasks(prev => [...prev, ...newTasks]);
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks(prevTasks => {
      const updateStatus = (items: Task[]): Task[] => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, status };
          }
          if (item.subtasks) {
            return {
              ...item,
              subtasks: updateStatus(item.subtasks)
            };
          }
          return item;
        });
      };
      return updateStatus(prevTasks);
    });
  };

  const handleProjectChange = (id: string, project: string) => {
    setTasks(prevTasks => {
      const updateProject = (items: Task[]): Task[] => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, project };
          }
          if (item.subtasks) {
            return {
              ...item,
              subtasks: updateProject(item.subtasks)
            };
          }
          return item;
        });
      };
      return updateProject(prevTasks);
    });
  };

  const handlePriorityChange = (id: string, priority: 'Low' | 'Medium' | 'High') => {
    setTasks(prevTasks => {
      const updatePriority = (items: Task[]): Task[] => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, priority };
          }
          if (item.subtasks) {
            return {
              ...item,
              subtasks: updatePriority(item.subtasks)
            };
          }
          return item;
        });
      };
      return updatePriority(prevTasks);
    });
  };

  const handleDelete = (id: string) => {
    setTasks(prevTasks => {
      const deleteTask = (items: Task[]): Task[] => {
        return items.filter(item => {
          if (item.id === id) return false;
          if (item.subtasks) {
            item.subtasks = deleteTask(item.subtasks);
          }
          return true;
        });
      };
      return deleteTask(prevTasks);
    });
  };

  const handleToggleExpand = (id: string) => {
    setTasks(prevTasks => {
      const toggleExpand = (items: Task[]): Task[] => {
        return items.map(item => {
          if (item.id === id) {
            return { ...item, isExpanded: !item.isExpanded };
          }
          if (item.subtasks) {
            return {
              ...item,
              subtasks: toggleExpand(item.subtasks)
            };
          }
          return item;
        });
      };
      return toggleExpand(prevTasks);
    });
  };

  const handleAddSubtask = (parentId: string) => {
    setTasks(prevTasks => {
      const addSubtask = (items: Task[]): Task[] => {
        return items.map(item => {
          if (item.id === parentId) {
            const newSubtask = {
              id: crypto.randomUUID(),
              content: 'New subtask',
              status: item.status,
              subtasks: [],
              isExpanded: true,
              priority: 'Low'
            };
            return {
              ...item,
              subtasks: [...(item.subtasks || []), newSubtask],
              isExpanded: true
            };
          }
          if (item.subtasks) {
            return {
              ...item,
              subtasks: addSubtask(item.subtasks)
            };
          }
          return item;
        });
      };
      return addSubtask(prevTasks);
    });
  };

  const handleAddProject = (projectName: string) => {
    if (!projects.includes(projectName)) {
      setProjects(prev => [...prev, projectName]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <CompactQuestProgress currentStage={currentStage} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('status')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === 'status' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Layout className="w-4 h-4" />
              Status View
            </button>
            <button
              onClick={() => setViewMode('project')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === 'project' 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Layout className="w-4 h-4" />
              Project View
            </button>
          </div>
        </div>
        <TaskInput onTaskAdd={handleTaskAdd} />
        {viewMode === 'status' ? (
          <KanbanBoard
            tasks={tasks}
            viewMode={viewMode}
            onStatusChange={handleStatusChange}
            onToggleExpand={handleToggleExpand}
            onPriorityChange={handlePriorityChange}
            onDelete={handleDelete}
            onAddSubtask={handleAddSubtask}
          />
        ) : (
          <ProjectBoard
            tasks={tasks}
            projects={projects}
            onProjectChange={handleProjectChange}
            onToggleExpand={handleToggleExpand}
            onPriorityChange={handlePriorityChange}
            onDelete={handleDelete}
            onAddSubtask={handleAddSubtask}
            onAddProject={handleAddProject}
          />
        )}
      </div>
    </div>
  );
}

export default App;