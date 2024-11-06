import React, { useState, useEffect } from 'react';
import { Map, X } from 'lucide-react';
import { QuestProgress } from './QuestProgress';
import confetti from 'canvas-confetti';

interface CompactQuestProgressProps {
  currentStage: number;
}

const questStorylets = [
  "You've discovered an ancient map leading to untold treasures...",
  "Deep in the lost jungle, you follow cryptic markings on weathered stones...",
  "Scaling the mystic peak, whispers of ancient secrets guide your path...",
  "Within the temple ruins, forgotten knowledge awaits your discovery...",
  "The sacred relic pulses with power, your quest nears its legendary end..."
];

export function CompactQuestProgress({ currentStage }: CompactQuestProgressProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  const percentage = Math.min(((currentStage - 1) / 4) * 100, 100);

  useEffect(() => {
    if (percentage === 100 && !hasShownConfetti) {
      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: number = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          setHasShownConfetti(true);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Create confetti from random positions
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [percentage, hasShownConfetti]);

  // Reset confetti flag when progress changes
  useEffect(() => {
    if (percentage < 100) {
      setHasShownConfetti(false);
    }
  }, [percentage]);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-4 right-4 flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 
                   px-4 py-2 rounded-full transition-all duration-200 group"
      >
        <Map className="w-4 h-4 text-amber-700" />
        <span className="font-medium text-amber-900">
          Quest: {Math.round(percentage)}%
        </span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl relative animate-in fade-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-amber-800 text-center mb-4">
                {percentage === 100 ? '🎉 Quest Completed! 🎉' : 'Quest Progress'}
              </h2>
              <p className="text-center text-amber-600 italic mb-8">
                {questStorylets[currentStage - 1]}
              </p>
              <QuestProgress 
                currentStage={currentStage} 
                showLabels={true}
                isVisible={isModalOpen}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}