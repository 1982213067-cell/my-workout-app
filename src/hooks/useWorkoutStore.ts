import { useState, useEffect } from 'react';
import { getTodayDateString } from '../lib/utils';

export type WorkoutType = 'A' | 'B' | 'Rest' | null;

export interface DailyRecord {
  workoutType: WorkoutType;
  completedHabits: string[]; // array of habit ids
  completedExercises?: string[]; // array of exercise ids
  isCheckedIn?: boolean; // explicit daily check-in flag
  exerciseWeights?: Record<string, string>; // mapping exerciseId to recorded weight/resistance
}

export interface AppState {
  startDate: string | null;
  records: Record<string, DailyRecord>;
  photos?: Record<string, string>; // date (YYYY-MM-DD) -> base64 image
}

const STORAGE_KEY = 'home_workout_v1';

export const calcRecommendedType = (startDate: string | null, targetDate: string): WorkoutType => {
  if (!startDate) return 'A';
  const start = new Date(startDate);
  const target = new Date(targetDate);
  start.setHours(0,0,0,0);
  target.setHours(0,0,0,0);
  const diffTime = target.getTime() - start.getTime();
  if (diffTime < 0) return 'A';
  const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const cycle = daysPassed % 3;
  if (cycle === 0) return 'A';
  if (cycle === 1) return 'B';
  return 'Rest';
};

export function useWorkoutStore() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load local storage', e);
    }
    return {
      startDate: getTodayDateString(),
      records: {},
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const today = getTodayDateString();

  const createDefaultRecord = (stateRef: AppState, dateStr: string): DailyRecord => ({
    workoutType: calcRecommendedType(stateRef.startDate, dateStr),
    completedHabits: [],
    completedExercises: [],
    isCheckedIn: false,
    exerciseWeights: {}
  });

  const getTodayRecord = (): DailyRecord => {
    return state.records[today] || createDefaultRecord(state, today);
  };

  const toggleHabit = (date: string, habitId: string) => {
    setState((prev) => {
      const record = prev.records[date] || createDefaultRecord(prev, date);
      const hasHabit = record.completedHabits.includes(habitId);
      const newHabits = hasHabit 
        ? record.completedHabits.filter(id => id !== habitId)
        : [...record.completedHabits, habitId];
        
      return {
        ...prev,
        records: {
          ...prev.records,
          [date]: { ...record, completedHabits: newHabits }
        }
      };
    });
  };

  const setWorkoutType = (date: string, type: WorkoutType) => {
     setState((prev) => {
        const record = prev.records[date] || createDefaultRecord(prev, date);
        return {
          ...prev,
          records: {
            ...prev.records,
            [date]: { ...record, workoutType: type }
          }
        };
     });
  };

  const toggleExercise = (date: string, exerciseId: string) => {
    setState((prev) => {
      const record = prev.records[date] || createDefaultRecord(prev, date);
      const completed = record.completedExercises || [];
      const hasExercise = completed.includes(exerciseId);
      const newExercises = hasExercise 
        ? completed.filter(id => id !== exerciseId)
        : [...completed, exerciseId];
        
      return {
        ...prev,
        records: {
          ...prev.records,
          [date]: { ...record, completedExercises: newExercises }
        }
      };
    });
  };

  const toggleDailyCheckIn = (date: string) => {
    setState((prev) => {
      const record = prev.records[date] || createDefaultRecord(prev, date);
      return {
        ...prev,
        records: {
          ...prev.records,
          [date]: { ...record, isCheckedIn: !record.isCheckedIn }
        }
      };
    });
  };

  const addPhoto = (date: string, base64: string) => {
    setState((prev) => ({
      ...prev,
      photos: {
        ...(prev.photos || {}),
        [date]: base64
      }
    }));
  };

  const deletePhoto = (date: string) => {
    setState((prev) => {
      const newPhotos = { ...(prev.photos || {}) };
      delete newPhotos[date];
      return { ...prev, photos: newPhotos };
    });
  };

  const setExerciseWeight = (date: string, exerciseId: string, weight: string) => {
    setState((prev) => {
      const record = prev.records[date] || createDefaultRecord(prev, date);
      return {
        ...prev,
        records: {
          ...prev.records,
          [date]: { 
            ...record, 
            exerciseWeights: {
              ...(record.exerciseWeights || {}),
              [exerciseId]: weight
            } 
          }
        }
      };
    });
  };

  return {
    state,
    today,
    getTodayRecord,
    toggleHabit,
    toggleExercise,
    toggleDailyCheckIn,
    setWorkoutType,
    setExerciseWeight,
    addPhoto,
    deletePhoto
  };
}
