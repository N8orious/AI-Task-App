import React, { useState, useEffect } from 'react';
import { Map, Trees, Mountain, Building, Gem, Check } from 'lucide-react';

interface QuestProgressProps {
  currentStage: number; // 1-5
  showLabels?: boolean;
  isVisible?: boolean;
}

export function QuestProgress({ currentStage = 1, showLabels = true, isVisible = true }: QuestProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [showIcons, setShowIcons] = useState(false);

  const stages = [
    { icon: Map, label: 'Ancient Map' },
    { icon: Trees, label: 'Lost Jungle' },
    { icon: Mountain, label: 'Mystic Peak' },
    { icon: Building, label: 'Temple Ruins' },
    { icon: Gem, label: 'Sacred Relic' }
  ];

  const percentage = Math.min(((currentStage - 1) / (stages.length - 1)) * 100, 100);

  useEffect(() => {
    if (isVisible) {
      // Reset animations
      setAnimatedPercentage(0);
      setShowIcons(false);

      // Start progress bar animation
      setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 100);

      // Show icons with delay
      setTimeout(() => {
        setShowIcons(true);
      }, 600);
    }
  }, [isVisible, percentage]);

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-8">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-amber-100 -translate-y-1/2 rounded-full" />
        
        {/* Animated Progress */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${animatedPercentage}%` }}
        />

        {/* Stages */}
        <div className="relative z-10 flex justify-between">
          {stages.map((stage, index) => {
            const StageIcon = stage.icon;
            const isCompleted = index + 1 < currentStage;
            const isActive = index + 1 === currentStage;
            const isPending = index + 1 > currentStage;

            return (
              <div 
                key={index} 
                className={`
                  flex flex-col items-center transform
                  transition-all duration-500 delay-[${index * 100}ms]
                  ${showIcons ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
              >
                <div className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 transform
                  ${isCompleted ? 'bg-amber-500 text-white' : ''}
                  ${isActive ? 'bg-amber-500 text-white scale-110 ring-4 ring-amber-200' : ''}
                  ${isPending ? 'bg-amber-50 text-amber-300' : ''}
                `}>
                  {isCompleted ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : (
                    <StageIcon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                  )}
                  
                  {/* Connection Line */}
                  {index < stages.length - 1 && (
                    <div className="absolute left-full w-full h-1 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                
                {showLabels && (
                  <span className={`
                    mt-3 text-sm font-medium transition-all duration-300
                    ${showIcons ? 'opacity-100' : 'opacity-0'}
                    ${isCompleted || isActive ? 'text-amber-800' : 'text-amber-300'}
                  `}>
                    {stage.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Percentage Indicator */}
      <div className={`
        text-center mt-6 transition-all duration-500 delay-700
        ${showIcons ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
      `}>
        <span className="text-2xl font-bold text-amber-800">
          {Math.round(animatedPercentage)}%
        </span>
        <span className="ml-1 text-amber-600">
          Quest Complete
        </span>
      </div>
    </div>
  );
}