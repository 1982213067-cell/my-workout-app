import React, { useState } from 'react';
import { AppState } from '../hooks/useWorkoutStore';
import { habits } from '../data/plan';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface HistoryViewProps {
  state: AppState;
  onToggleCheckIn: (date: string) => void;
}

export function HistoryView({ state, onToggleCheckIn }: HistoryViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  let workoutDaysCount = 0;
  let habitsCountTotal = 0;
  Object.keys(state.records).forEach(dateStr => {
    if (dateStr.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
      const rec = state.records[dateStr];
      if (rec.isCheckedIn) workoutDaysCount++;
      habitsCountTotal += rec.completedHabits.length;
    }
  });

  return (
    <div className="pb-28 px-4 pt-8 max-w-lg mx-auto">
      <div className="mb-8 pl-2 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">打卡记录</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">每日坚持，记录力量与体态的蜕变。</p>
        </div>
      </div>

       <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-600 text-white rounded-[24px] p-5 shadow-lg shadow-indigo-200 flex flex-col justify-between">
           <span className="text-indigo-200 text-xs font-bold mb-2">本月打卡</span>
           <div className="text-3xl font-black">{workoutDaysCount}<span className="text-sm font-medium text-indigo-300 ml-1">天</span></div>
        </div>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
           <span className="text-slate-400 text-xs font-bold mb-2">本月微习惯</span>
           <div className="text-3xl font-black text-slate-800">{habitsCountTotal}<span className="text-sm font-medium text-slate-400 ml-1">次</span></div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-4">
          <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-lg text-slate-800">
            {year}年 {month + 1}月
          </h3>
          <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['一', '二', '三', '四', '五', '六', '日'].map(d => (
            <div key={d} className="text-center text-[10px] text-slate-400 font-bold mb-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="w-10 h-10" />;
            
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const record = state.records[dateStr];
            const todayStr = new Date().toDateString();
            const isToday = todayStr === date.toDateString();
            
            // Allow clicking days in the future? Usually no data anyway.
            // Reset hours for date comparison
            const dateNoTime = new Date(date);
            dateNoTime.setHours(0,0,0,0);
            const nowNoTime = new Date();
            nowNoTime.setHours(0,0,0,0);
            
            const isFuture = dateNoTime > nowNoTime;

            const habitsCount = record ? record.completedHabits.length : 0;
            const habitsDone = habitsCount === habits.length;

            return (
              <div 
                key={idx} 
                className="flex flex-col items-center gap-1.5 min-w-0 cursor-pointer active:scale-95 transition-transform" 
                onClick={() => !isFuture && onToggleCheckIn(dateStr)}
              >
                <div 
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all",
                    isFuture ? "bg-slate-50 border border-dashed border-slate-200 text-slate-300" :
                    record?.isCheckedIn ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" :
                    isToday ? "ring-2 ring-indigo-600 bg-white text-indigo-600" : 
                    "bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-400"
                  )}
                >
                  {record?.isCheckedIn ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : record?.workoutType === 'A' || record?.workoutType === 'B' ? (
                    record.workoutType
                  ) : record?.workoutType === 'Rest' ? (
                    "休"
                  ) : (
                    date.getDate()
                  )}
                </div>
                {/* Micro Bento dot indicators for habits */}
                <div className={cn("grid grid-cols-2 gap-[2px]", isFuture ? "opacity-0" : "opacity-100")}>
                  {habits.map((h, i) => {
                    const isHabitDone = record?.completedHabits.includes(h.id);
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "w-1.5 h-1.5 rounded-[1px]",
                          isHabitDone ? "bg-indigo-500" : "bg-slate-200"
                        )} 
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-5 pt-4 border-t border-slate-50 flex gap-4 text-[10px] text-slate-500 font-medium justify-center flex-wrap">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-indigo-600" /> 已打卡</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm border border-slate-200 bg-slate-50" /> 未打卡</div>
          <div className="flex items-center gap-1.5 ml-2">
            <div className="grid grid-cols-2 gap-[1px]">
               <div className="w-[3px] h-[3px] rounded-[1px] bg-indigo-500" /><div className="w-[3px] h-[3px] rounded-[1px] bg-indigo-500" />
               <div className="w-[3px] h-[3px] rounded-[1px] bg-slate-200" /><div className="w-[3px] h-[3px] rounded-[1px] bg-indigo-500" />
            </div>
            <span>微习惯进度</span>
          </div>
        </div>
      </div>
    </div>
  );
}
