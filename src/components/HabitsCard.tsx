import React from 'react';
import { habits } from '../data/plan';
import { cn } from '../lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import * as motion from 'motion/react-client';

interface HabitsCardProps {
  completedHabits: string[];
  onToggle: (id: string) => void;
}

export function HabitsCard({ completedHabits, onToggle }: HabitsCardProps) {
  const progress = (completedHabits.length / habits.length) * 100;
  
  return (
    <div className="bg-indigo-900 text-white rounded-[32px] p-6 shadow-xl mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>📋 每日微习惯</span>
          <span className="bg-indigo-800 text-[10px] px-2 py-1 rounded-full text-indigo-200">必修</span>
        </h3>
        <div className="text-xs font-semibold text-indigo-300">
          {completedHabits.length}/{habits.length} 完成
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {habits.map((habit, idx) => {
          const isDone = completedHabits.includes(habit.id);
          return (
            <button
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className={cn(
                "flex flex-col items-start p-4 rounded-2xl border transition-all active:scale-[0.98] text-left relative overflow-hidden",
                isDone 
                  ? "bg-indigo-500 border-white/20 shadow-inner" 
                  : "bg-white/5 hover:bg-white/10 border-white/5"
              )}
            >
              <span className="text-2xl mb-2">{habit.emoji}</span>
              <span className={cn("text-sm font-semibold", isDone ? "text-white" : "text-indigo-100")}>{habit.name}</span>
              {isDone && <span className="text-[10px] text-indigo-100 font-bold tracking-wider mt-1 opacity-90">COMPLETED ✔</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
