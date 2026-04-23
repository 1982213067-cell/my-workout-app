import React, { useState } from 'react';
import { useWorkoutStore, WorkoutType, calcRecommendedType } from './hooks/useWorkoutStore';
import { HabitsCard } from './components/HabitsCard';
import { WorkoutSection } from './components/WorkoutSection';
import { HistoryView } from './components/HistoryView';
import { ProgressView } from './components/ProgressView';
import { CalendarRange, Activity, Dumbbell, Coffee, Trophy, CheckCircle2, Circle, Camera, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';
import * as motion from 'motion/react-client';

export default function App() {
  const [tab, setTab] = useState<'home' | 'history' | 'progress'>('home');
  const { state, today, getTodayRecord, toggleHabit, toggleExercise, toggleDailyCheckIn, setWorkoutType, setExerciseWeight, addPhoto, deletePhoto } = useWorkoutStore();

  const currentRecord = getTodayRecord();
  const completedExercises = currentRecord.completedExercises || [];
  const exerciseWeights = currentRecord.exerciseWeights || {};
  
  const recommendedType = calcRecommendedType(state.startDate, today);

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-gray-900 font-sans selection:bg-brand/20">
      {tab === 'home' ? (
        <div className="pb-24 px-4 pt-6 max-w-lg mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-6 pt-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm">C</div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">今日训练计划</h1>
                <p className="text-slate-500 text-sm mt-0.5 font-medium">
                  {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} · {new Date().toLocaleDateString('zh-CN', { weekday: 'long' })}
                </p>
              </div>
            </div>
          </header>

          {/* Big Daily Check-In Toggle */}
          <button 
            onClick={() => toggleDailyCheckIn(today)}
            className={cn(
               "w-full mb-6 p-4 rounded-[24px] border shadow-sm flex items-center justify-between transition-all active:scale-[0.98]",
               currentRecord.isCheckedIn 
                 ? "bg-indigo-600 border-indigo-500 shadow-indigo-200" 
                 : "bg-white border-slate-200 hover:bg-slate-50"
            )}
          >
            <div className="flex items-center gap-3">
              {currentRecord.isCheckedIn ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </motion.div>
              ) : (
                <Circle className="w-8 h-8 text-slate-300" />
              )}
              <div className="text-left">
                <div className={cn("font-bold text-lg leading-tight", currentRecord.isCheckedIn ? "text-white" : "text-slate-800")}>
                  {currentRecord.isCheckedIn ? "今日已打卡" : "完成今日打卡"}
                </div>
                <div className={cn("text-xs mt-0.5", currentRecord.isCheckedIn ? "text-indigo-200" : "text-slate-500")}>
                  {currentRecord.isCheckedIn ? "太棒了！坚持就是胜利 🎉" : "完成全部训练后点击此处"}
                </div>
              </div>
            </div>
          </button>

          {/* Daily Habits */}
          <HabitsCard 
            completedHabits={currentRecord.completedHabits}
            onToggle={(id) => toggleHabit(today, id)}
          />

          {/* Main Workout Container (Bento Style) */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 mb-6 flex flex-col">
            
            <div className="flex items-center gap-1.5 mb-3 px-1 text-slate-500 text-xs font-bold">
               <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" />
               基于“做2休1”周期，今日为你智能排期<span className={cn("px-1.5 py-0.5 rounded-md text-[10px] ml-1", recommendedType === 'A' ? "bg-indigo-50 text-indigo-600" : recommendedType === 'B' ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600")}>{recommendedType === 'A' ? '下肢日' : recommendedType === 'B' ? '上肢日' : '休息日'}</span>
            </div>

            {/* Workout Planner Tabs */}
            <div className="mb-6">
              <div className="bg-slate-50 p-1 rounded-xl flex gap-1 relative overflow-hidden border border-slate-100">
              <button 
                onClick={() => setWorkoutType(today, 'A')}
                className={cn(
                  "relative flex-1 py-2.5 px-3 text-sm font-semibold rounded-lg z-10 transition-colors flex items-center justify-center gap-2",
                  currentRecord.workoutType === 'A' ? "text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Dumbbell className="w-4 h-4" /> 下肢日 (A)
                {currentRecord.workoutType === 'A' && (
                  <motion.div layoutId="workout-tab-bg" className="absolute inset-0 bg-indigo-600 rounded-lg -z-10 shadow-sm" />
                )}
              </button>
              
              <button 
                onClick={() => setWorkoutType(today, 'B')}
                className={cn(
                  "relative flex-1 py-2.5 px-3 text-sm font-semibold rounded-lg z-10 transition-colors flex items-center justify-center gap-2",
                  currentRecord.workoutType === 'B' ? "text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Activity className="w-4 h-4" /> 上肢日 (B)
                {currentRecord.workoutType === 'B' && (
                  <motion.div layoutId="workout-tab-bg" className="absolute inset-0 bg-blue-500 rounded-lg -z-10 shadow-sm" />
                )}
              </button>

              <button 
                onClick={() => setWorkoutType(today, 'Rest')}
                className={cn(
                  "relative flex-1 py-2.5 px-3 text-sm font-semibold rounded-lg z-10 transition-colors flex items-center justify-center gap-2",
                  currentRecord.workoutType === 'Rest' ? "text-slate-800" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Coffee className="w-4 h-4" /> 休息
                {currentRecord.workoutType === 'Rest' && (
                  <motion.div layoutId="workout-tab-bg" className="absolute inset-0 bg-white rounded-lg -z-10 shadow-sm border border-slate-200" />
                )}
              </button>
            </div>
          </div>

          <div className="min-h-[300px]">
             <motion.div
               key={currentRecord.workoutType || 'none'}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
             >
                {currentRecord.workoutType === 'A' && (
                  <WorkoutSection 
                    type="A" 
                    completedExercises={completedExercises} 
                    exerciseWeights={exerciseWeights}
                    onToggleExercise={(id) => toggleExercise(today, id)} 
                    onWeightChange={(id, val) => setExerciseWeight(today, id, val)}
                  />
                )}
                {currentRecord.workoutType === 'B' && (
                  <WorkoutSection 
                    type="B" 
                    completedExercises={completedExercises} 
                    exerciseWeights={exerciseWeights}
                    onToggleExercise={(id) => toggleExercise(today, id)} 
                    onWeightChange={(id, val) => setExerciseWeight(today, id, val)}
                  />
                )}
                {currentRecord.workoutType === 'Rest' && (
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center text-orange-800 mt-4">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-3xl">☕</div>
                     <h3 className="font-bold text-lg mb-2">今天好好休息吧！</h3>
                     <p className="text-sm opacity-80">肌肉是在休息中生长的。<br/>别忘了完成上面的矫正微习惯哦。</p>
                  </div>
                )}
                {currentRecord.workoutType === null && (
                  <div className="py-12 text-center text-slate-400">
                    <p>今天练什么？在上方选择你的训练计划 💪</p>
                  </div>
                )}
             </motion.div>
          </div>
          </div>
        </div>
      ) : tab === 'history' ? (
        <HistoryView state={state} onToggleCheckIn={toggleDailyCheckIn} />
      ) : (
        <ProgressView state={state} onAddPhoto={addPhoto} onDeletePhoto={deletePhoto} />
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-50 pointer-events-none safe-area-bottom flex justify-center">
        <nav className="h-16 w-full max-w-[280px] flex justify-around items-center px-4 bg-white/95 backdrop-blur-md rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 pointer-events-auto">
          <button 
            onClick={() => setTab('home')}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[60px] transition-colors rounded-full py-1.5",
              tab === 'home' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Activity className={cn("w-6 h-6", tab === 'home' && "fill-indigo-100")} strokeWidth={tab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide">训练</span>
          </button>
          
          <button 
            onClick={() => setTab('progress')}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[60px] transition-colors rounded-full py-1.5",
              tab === 'progress' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Camera className={cn("w-6 h-6", tab === 'progress' && "fill-indigo-100")} strokeWidth={tab === 'progress' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide">对比</span>
          </button>

          <button 
            onClick={() => setTab('history')}
            className={cn(
              "flex flex-col items-center justify-center gap-1 min-w-[60px] transition-colors rounded-full py-1.5",
              tab === 'history' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <CalendarRange className={cn("w-6 h-6", tab === 'history' && "fill-indigo-100")} strokeWidth={tab === 'history' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide">数据</span>
          </button>
        </nav>
      </div>

      <style>{`
        .safe-area-bottom { margin-bottom: env(safe-area-inset-bottom, 0px); }
        .pb-safe { padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px)); }
      `}</style>
    </div>
  );
}
