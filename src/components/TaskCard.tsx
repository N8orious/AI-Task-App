import React, { useState, useRef, useEffect } from 'react';
import { Trash2, CheckCircle2, ChevronRight, ChevronDown, Plus, Sparkles } from 'lucide-react';
import type { SubTask, Task, TaskStatus, ActionItem } from '../types/task';

interface TaskCardProps {
  task: Task | SubTask;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onToggleExpand: (id: string) => void;
  onPriorityChange: (id: string, priority: 'Low' | 'Medium' | 'High') => void;
  onDelete: (id: string) => void;
  onAddSubtask: (parentId: string) => void;
  depth?: number;
  parentProject?: string;
}

const projectColors = {
  'Uncategorized': {
    border: 'border-gray-200',
    background: 'bg-white',
    shadow: 'shadow-sm',
    hover: 'hover:shadow-md hover:border-gray-300'
  },
  'Personal': {
    border: 'border-sky-100',
    background: 'bg-sky-50/30',
    shadow: 'shadow-sky-100/50',
    hover: 'hover:shadow-sky-100/50 hover:border-sky-200'
  },
  'Work': {
    border: 'border-violet-100',
    background: 'bg-violet-50/30',
    shadow: 'shadow-violet-100/50',
    hover: 'hover:shadow-violet-100/50 hover:border-violet-200'
  },
  'Health': {
    border: 'border-emerald-100',
    background: 'bg-emerald-50/30',
    shadow: 'shadow-emerald-100/50',
    hover: 'hover:shadow-emerald-100/50 hover:border-emerald-200'
  },
  'Shopping': {
    border: 'border-amber-100',
    background: 'bg-amber-50/30',
    shadow: 'shadow-amber-100/50',
    hover: 'hover:shadow-amber-100/50 hover:border-amber-200'
  },
  'Learning': {
    border: 'border-indigo-100',
    background: 'bg-indigo-50/30',
    shadow: 'shadow-indigo-100/50',
    hover: 'hover:shadow-indigo-100/50 hover:border-indigo-200'
  },
  'Travel': {
    border: 'border-rose-100',
    background: 'bg-rose-50/30',
    shadow: 'shadow-rose-100/50',
    hover: 'hover:shadow-rose-100/50 hover:border-rose-200'
  },
  'Home': {
    border: 'border-teal-100',
    background: 'bg-teal-50/30',
    shadow: 'shadow-teal-100/50',
    hover: 'hover:shadow-teal-100/50 hover:border-teal-200'
  },
  'Finance': {
    border: 'border-lime-100',
    background: 'bg-lime-50/30',
    shadow: 'shadow-lime-100/50',
    hover: 'hover:shadow-lime-100/50 hover:border-lime-200'
  }
};

const priorityColors = {
  'High': 'bg-red-50 text-red-600',
  'Medium': 'bg-yellow-50 text-yellow-600',
  'Low': 'bg-green-50 text-green-600'
};

const getProjectStyle = (project: string) => {
  return projectColors[project as keyof typeof projectColors] || projectColors['Uncategorized'];
};

export function TaskCard({ 
  task, 
  onStatusChange, 
  onToggleExpand, 
  onPriorityChange,
  onDelete,
  onAddSubtask,
  depth = 0,
  parentProject
}: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [isGeneratingActions, setIsGeneratingActions] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleCheckboxClick = () => {
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    onStatusChange(task.id, newStatus);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedContent(task.content);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedContent.trim() !== task.content) {
      task.content = editedContent.trim();
    }
  };

  const getPriority = () => {
    return task.priority || 'Low';
  };

  const handlePriorityClick = () => {
    const priorities: ('Low' | 'Medium' | 'High')[] = ['Low', 'Medium', 'High'];
    const currentIndex = priorities.indexOf(getPriority());
    const nextPriority = priorities[(currentIndex + 1) % priorities.length];
    onPriorityChange(task.id, nextPriority);
  };

  // Mock AI generation - in production, this would call your AI service
  const generateActionItems = async () => {
    setIsGeneratingActions(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newActionItems: ActionItem[] = [
        { id: crypto.randomUUID(), content: "Research and gather requirements", isCompleted: false },
        { id: crypto.randomUUID(), content: "Create initial draft or prototype", isCompleted: false },
        { id: crypto.randomUUID(), content: "Review and gather feedback", isCompleted: false },
        { id: crypto.randomUUID(), content: "Make necessary revisions", isCompleted: false },
        { id: crypto.randomUUID(), content: "Final review and approval", isCompleted: false }
      ];
      
      task.actionItems = newActionItems;
      setIsGeneratingActions(false);
    } catch (error) {
      console.error('Error generating action items:', error);
      setIsGeneratingActions(false);
    }
  };

  const toggleActionItem = (actionItemId: string) => {
    if (task.actionItems) {
      task.actionItems = task.actionItems.map(item =>
        item.id === actionItemId
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      );
    }
  };

  const projectStyle = getProjectStyle(parentProject || task.project || 'Uncategorized');

  return (
    <div className={`mb-3 ${depth > 0 ? 'ml-6' : ''}`}>
      <div 
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`p-4 rounded-xl border ${projectStyle.border} ${projectStyle.background} 
                   ${projectStyle.shadow} transition-all duration-200 
                   ${projectStyle.hover} cursor-move group relative`}
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center">
            {hasSubtasks && (
              <button 
                onClick={() => onToggleExpand(task.id)}
                className="mr-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {task.isExpanded ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </button>
            )}
            <button 
              onClick={handleCheckboxClick}
              className="focus:outline-none"
            >
              {task.status === 'done' ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <div className="w-5 h-5 rounded-sm border-2 border-gray-300 hover:border-gray-400 transition-colors" />
              )}
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              {isEditing ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  className="flex-1 px-2 py-1 border border-blue-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-200
                           font-medium text-gray-900 bg-white"
                />
              ) : (
                <h3 
                  onDoubleClick={handleDoubleClick}
                  className={`font-medium ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-900'}`}
                >
                  {task.content}
                </h3>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={generateActionItems}
                  disabled={isGeneratingActions}
                  className={`text-xs px-2 py-1 rounded-md font-medium
                            ${isGeneratingActions ? 'bg-blue-50 text-blue-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
                            transition-all duration-200`}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePriorityClick}
                  className={`text-xs px-2 py-1 rounded-md font-medium ${priorityColors[getPriority()]} 
                            transition-all duration-200 hover:opacity-80`}
                >
                  {getPriority()}
                </button>
                <button 
                  onClick={() => onDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            )}
            {task.actionItems && task.actionItems.length > 0 && (
              <div className="mt-3 space-y-2">
                {task.actionItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 pl-2">
                    <button
                      onClick={() => toggleActionItem(item.id)}
                      className="focus:outline-none"
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-sm border-2 border-gray-300 hover:border-gray-400 transition-colors" />
                      )}
                    </button>
                    <span className={`text-sm ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {item.content}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {isHovered && !isEditing && (
          <button
            onClick={() => onAddSubtask(task.id)}
            className="absolute -bottom-3 left-8 z-10 bg-white rounded-full p-1 shadow-md
                     border border-gray-200 text-gray-500 hover:text-gray-700
                     transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      {hasSubtasks && task.isExpanded && (
        <div className="mt-2 border-l-2 border-gray-100 pl-2">
          {task.subtasks.map((subtask) => (
            <TaskCard
              key={subtask.id}
              task={subtask}
              onStatusChange={onStatusChange}
              onToggleExpand={onToggleExpand}
              onPriorityChange={onPriorityChange}
              onDelete={onDelete}
              onAddSubtask={onAddSubtask}
              depth={depth + 1}
              parentProject={task.project}
            />
          ))}
        </div>
      )}
    </div>
  );
}