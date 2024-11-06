import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';

interface TaskInputProps {
  onTaskAdd: (content: string) => void;
}

export function TaskInput({ onTaskAdd }: TaskInputProps) {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onTaskAdd(input.trim());
      setInput('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = input.substring(0, start) + '    ' + input.substring(end);
      setInput(newValue);
      // Set cursor position after the inserted tabs
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto mb-8">
      <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
        {!isExpanded ? (
          <div className="flex items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Enter your tasks..."
              className="w-full p-6 pr-24 font-sans text-gray-800 text-lg
                       placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 
                       bg-blue-600 text-white px-6 py-2 rounded-lg
                       hover:bg-blue-700 transition-colors duration-200
                       flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 px-6 pt-4 text-sm text-gray-500">
              <FileText className="w-4 h-4" />
              <span>Use 4 spaces or Tab key for indentation</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Parent Task:&#10;    Subtask 1&#10;    Subtask 2&#10;Parent Task 2:&#10;    Subtask 2.1"
              rows={8}
              className="w-full p-6 font-mono text-gray-800 text-base
                       placeholder-gray-400 focus:outline-none resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-2 p-4 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800
                         transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg
                         hover:bg-blue-700 transition-colors duration-200
                         flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Tasks
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}