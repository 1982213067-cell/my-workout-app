import React from 'react';
import { Exercise, dayA, dayB } from '../data/plan';
import { CheckCircle2, Circle, Dumbbell } from 'lucide-react';
import { cn } from '../lib/utils';
import * as motion from 'motion/react-client';

interface WorkoutSectionProps {
  type: 'A' | 'B';
  completedExercises: string[];
  exerciseWeights: Record<string, string>;
  onToggleExercise: (id: string) => void;
  onWeightChange: (id: string, weight: string) => void;
}

export function WorkoutSection({ type, completedExercises, exerciseWeights, onToggleExercise, onWeightChange }: WorkoutSectionProps) {
  const exercises = type === 'A' ? dayA : dayB;
  
  return (
    <div className="space-y-4">
      <div className="mb-5 flex justify-between items-end border-b border-slate-50 pb-4">
        <div>
          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 inline-block">TODAY'S WORKOUT</span>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight mt-1">
            {type === 'A' ? 'DAY A: 下肢骨骼微调' : 'DAY B: 上肢体态重塑'}
          </h2>
        </div>
        <p className="text-slate-400 text-xs font-semibold whitespace-nowrap ml-4 mb-1">预计 45min</p>
      </div>

      <div className="space-y-3">
        {exercises.map((ex, idx) => (
          <ExerciseCard 
            key={ex.id} 
            exercise={ex} 
            index={idx} 
            isCompleted={completedExercises.includes(ex.id)}
            weight={exerciseWeights[ex.id] || ''}
            onToggle={() => onToggleExercise(ex.id)}
            onWeightChange={(val: string) => onWeightChange(ex.id, val)}
          />
        ))}
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, index, isCompleted, weight, onToggle, onWeightChange }: { exercise: Exercise; index: number; key?: React.Key; isCompleted: boolean; weight: string; onToggle: () => void; onWeightChange: (val: string) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onToggle}
      className={cn(
        "rounded-[20px] p-3 flex items-start gap-4 border cursor-pointer transition-all active:scale-[0.99]",
        isCompleted ? "opacity-60 bg-slate-50 border-slate-100 grayscale-[0.2]" : "bg-slate-50 hover:bg-slate-100/50 border-slate-100"
      )}
    >
      {/* Number Block */}
      <div className="w-12 h-12 bg-white rounded-[14px] flex-shrink-0 flex flex-col items-center justify-center font-bold text-indigo-600 border border-slate-200 shadow-sm mt-0.5">
        {isCompleted ? <CheckCircle2 className="w-6 h-6 text-indigo-600 fill-indigo-100" /> : String(index + 1).padStart(2, '0')}
      </div>
      
      <div className="flex-1 min-w-0 pr-1">
         <div className="flex justify-between items-start">
           <div>
             <h3 className={cn(
                "font-bold truncate text-[15px]",
                isCompleted ? "text-slate-500 line-through" : "text-slate-800"
             )}>{exercise.name}</h3>
             <div className="flex items-center gap-2 mt-1 mb-1.5">
               <span className={cn(
                "inline-block px-1.5 py-[2px] rounded md text-[9px] font-bold tracking-widest leading-none",
                exercise.type === 'warmup' ? "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-600/10" : "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10",
                isCompleted && "bg-slate-100 text-slate-400 ring-slate-400/10"
               )}>
                 {exercise.type === 'warmup' ? '激活' : '主项'}
               </span>
               <span className="text-[11px] font-bold text-slate-600 leading-none">{exercise.setsReps}</span>
             </div>
           </div>
         </div>
         <p className={cn("text-[11px] leading-relaxed mt-1 block", isCompleted ? "text-slate-400" : "text-slate-500")}>
           <span className="font-semibold text-slate-700">🎯 {exercise.target}</span><br />
           {exercise.cues}
         </p>
         
         {exercise.type === 'main' && (
           <div 
             className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2"
             onClick={(e) => e.stopPropagation()} // Prevent toggling the card when clicking the input area
           >
             <Dumbbell className={cn("w-3.5 h-3.5", isCompleted ? "text-slate-400" : "text-indigo-400")} />
             <input
               type="text"
               placeholder="记录重量 / 弹力带"
               value={weight}
               onChange={(e) => onWeightChange(e.target.value)}
               className={cn(
                 "flex-1 bg-white border rounded-lg px-2.5 py-1.5 text-xs outline-none transition-shadow",
                 isCompleted ? "border-slate-200 text-slate-400" : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 text-slate-700"
               )}
             />
           </div>
         )}
      </div>
    </motion.div>
  );
}
