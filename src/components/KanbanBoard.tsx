import React, { useState } from 'react';
import { Task, TaskStatus, ViewMode } from '../types/task';
import { TaskCard } from './TaskCard';
import { Trash2, X } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  viewMode: ViewMode;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onToggleExpand: (id: string) => void;
  onPriorityChange: (id: string, priority: 'Low' | 'Medium' | 'High') => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string) => void;
}

interface ClearConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  columnTitle: string;
}

function ClearConfirmModal({ isOpen, onClose, onConfirm, columnTitle }: ClearConfirmModalProps) {
  if (!isOpen) return null;

  const questThemedMessages = {
    'To Do': {
      title: "Abandon These Quests?",
      message: "These scrolls contain untold adventures. Are you sure you wish to clear them from your quest log?"
    },
    'On Progress': {
      title: "Halt Your Journey?",
      message: "Your progress on these epic quests will be lost to the winds of time. Do you wish to proceed?"
    },
    'Done': {
      title: "Clear Your Victories?",
      message: "These are tales of your triumph. Are you certain you want to remove them from the chronicles?"
    }
  };

  const theme = questThemedMessages[columnTitle as keyof typeof questThemedMessages];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 animate-in fade-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{theme.title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">{theme.message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                     transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export function KanbanBoard({ 
  tasks, 
  viewMode, 
  onStatusChange, 
  onToggleExpand,
  onPriorityChange,
  onDelete,
  onAddSubtask
}: KanbanBoardProps) {
  const [clearModalState, setClearModalState] = useState<{
    isOpen: boolean;
    columnTitle: string;
    status: TaskStatus;
  }>({
    isOpen: false,
    columnTitle: '',
    status: 'todo'
  });

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

  const columns = {
    'To Do': {
      tasks: sortByPriority(tasks.filter(t => t.status === 'todo')),
      color: 'indigo',
      count: tasks.filter(t => t.status === 'todo').length,
      status: 'todo' as TaskStatus
    },
    'On Progress': {
      tasks: sortByPriority(tasks.filter(t => t.status === 'inProgress')),
      color: 'amber',
      count: tasks.filter(t => t.status === 'inProgress').length,
      status: 'inProgress' as TaskStatus
    },
    'Done': {
      tasks: sortByPriority(tasks.filter(t => t.status === 'done')),
      color: 'emerald',
      count: tasks.filter(t => t.status === 'done').length,
      status: 'done' as TaskStatus
    }
  };

  const statusMap: Record<string, TaskStatus> = {
    'To Do': 'todo',
    'On Progress': 'inProgress',
    'Done': 'done'
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnTitle: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId && viewMode === 'status') {
      onStatusChange(taskId, statusMap[columnTitle]);
    }
  };

  const handleClearColumn = (columnTitle: string, status: TaskStatus) => {
    setClearModalState({
      isOpen: true,
      columnTitle,
      status
    });
  };

  const confirmClearColumn = () => {
    const tasksToDelete = tasks.filter(t => t.status === clearModalState.status);
    tasksToDelete.forEach(task => onDelete(task.id));
    setClearModalState({ isOpen: false, columnTitle: '', status: 'todo' });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
        {Object.entries(columns).map(([title, column]) => (
          <div 
            key={title} 
            className="flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, title)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-${column.color}-500`} />
                <h2 className="font-medium text-gray-900">{title}</h2>
                <span className="ml-1 bg-gray-100 text-gray-600 text-sm px-2 py-0.5 rounded-full">
                  {column.count}
                </span>
              </div>
              {column.count > 0 && (
                <button
                  onClick={() => handleClearColumn(title, column.status)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                           rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="bg-gray-50 rounded-xl p-4 min-h-[calc(100vh-200px)]">
              {column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onToggleExpand={onToggleExpand}
                  onPriorityChange={onPriorityChange}
                  onDelete={onDelete}
                  onAddSubtask={onAddSubtask}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <ClearConfirmModal
        isOpen={clearModalState.isOpen}
        onClose={() => setClearModalState({ isOpen: false, columnTitle: '', status: 'todo' })}
        onConfirm={confirmClearColumn}
        columnTitle={clearModalState.columnTitle}
      />
    </>
  );
}