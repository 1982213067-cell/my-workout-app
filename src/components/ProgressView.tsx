import React, { useRef, useState } from 'react';
import { AppState } from '../hooks/useWorkoutStore';
import { Camera, Plus, Trash2, ArrowRight, Check } from 'lucide-react';
import { cn, compressImage } from '../lib/utils';
import * as motion from 'motion/react-client';

interface ProgressViewProps {
  state: AppState;
  onAddPhoto: (date: string, base64: string) => void;
  onDeletePhoto: (date: string) => void;
}

export function ProgressView({ state, onAddPhoto, onDeletePhoto }: ProgressViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const photos = state.photos || {};
  const photoDates = Object.keys(photos).sort(); // chronological
  
  // Default selection for comparison: earliest and latest IF available
  const [compareLeft, setCompareLeft] = useState<string | null>(photoDates[0] || null);
  const [compareRight, setCompareRight] = useState<string | null>(photoDates[photoDates.length - 1] || null);
  
  // Bulk edit state
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const base64 = await compressImage(file);
      const today = new Date();
      // formatting date explicitly
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      onAddPhoto(dateStr, base64);
      
      // Auto update comparison if 
      if (!compareLeft) setCompareLeft(dateStr);
      else setCompareRight(dateStr);

    } catch (err) {
      alert("图片处理失败，请重试");
    }
  };

  const hasPhotos = photoDates.length > 0;

  return (
    <div className="pb-28 px-4 pt-8 max-w-lg mx-auto">
      <div className="mb-8 pl-2">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">形体反馈</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">肉眼的直观对比，是最好的驱动力。</p>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef} 
        onChange={handlePhotoUpload} 
        className="hidden" 
      />

      {/* Comparison Area */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-4">
          <h3 className="font-bold text-lg text-slate-800">拍照对比</h3>
          <span className="text-indigo-600 text-[10px] bg-indigo-50 px-2 py-1 object-contain rounded-full font-bold inline-block">Before & After</span>
        </div>

        {!hasPhotos ? (
          <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Camera className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm font-medium">暂无照片记录</p>
            <p className="text-slate-400 text-xs mt-1">拍摄你的第一张体态记录吧</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              {/* Left Photo */}
              <div className="flex-1">
                <select 
                  className="w-full mb-2 bg-slate-50 text-xs font-bold text-slate-600 p-2 rounded-lg border border-slate-100 outline-none"
                  value={compareLeft || ''}
                  onChange={(e) => setCompareLeft(e.target.value)}
                >
                  <option value="" disabled>选择日期</option>
                  {photoDates.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden relative shadow-sm border border-slate-100/50">
                  {compareLeft && photos[compareLeft] ? (
                    <img src={photos[compareLeft]} alt={`Before ${compareLeft}`} className="w-full h-full object-cover" />
                  ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs font-bold">请选择照片</div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col justify-center items-center">
                <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shadow-sm z-10 -mx-4 ring-4 ring-white">
                   <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Right Photo */}
              <div className="flex-1">
                <select 
                  className="w-full mb-2 bg-slate-50 text-xs font-bold text-slate-600 p-2 rounded-lg border border-slate-100 outline-none"
                  value={compareRight || ''}
                  onChange={(e) => setCompareRight(e.target.value)}
                >
                  <option value="" disabled>选择日期</option>
                  {photoDates.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div className="aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden relative shadow-sm border border-slate-100/50">
                   {compareRight && photos[compareRight] ? (
                    <img src={photos[compareRight]} alt={`After ${compareRight}`} className="w-full h-full object-cover" />
                  ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-xs font-bold">请选择照片</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full mt-6 bg-indigo-600 text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200"
        >
          <Camera className="w-5 h-5" />
          {hasPhotos ? "记录今日体态" : "开启第一天记录"}
        </button>
      </div>

      {/* Gallery */}
      {hasPhotos && (
        <div className="mb-4 bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="mb-4 flex justify-between items-center px-1 border-b border-slate-50 pb-3">
            <h3 className="font-bold text-lg text-slate-800">
              {isEditMode ? `已选择 ${selectedDates.length} 张` : '照片库'}
            </h3>
            
            <div className="flex items-center gap-2">
              {isEditMode && selectedDates.length > 0 && (
                <button 
                  onClick={() => {
                    if (confirm(`确认删除选中的 ${selectedDates.length} 张记录吗？`)) {
                      selectedDates.forEach(date => {
                        onDeletePhoto(date);
                        if (compareLeft === date) setCompareLeft(null);
                        if (compareRight === date) setCompareRight(null);
                      });
                      setIsEditMode(false);
                      setSelectedDates([]);
                    }
                  }} 
                  className="text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                >
                  删除
                </button>
              )}
              <button
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  if (isEditMode) setSelectedDates([]);
                }}
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm",
                  isEditMode ? "text-slate-600 bg-slate-100 hover:bg-slate-200" : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                )}
              >
                {isEditMode ? '取消' : '批量管理'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
             {photoDates.slice().reverse().map(date => {
               const isSelected = selectedDates.includes(date);
               return (
               <div 
                 key={date} 
                 className={cn(
                   "relative aspect-square bg-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-200",
                   isEditMode ? "cursor-pointer" : "group"
                 )}
                 onClick={() => {
                   if (isEditMode) {
                     setSelectedDates(prev => 
                       prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
                     );
                   }
                 }}
               >
                 <img 
                   src={photos[date]} 
                   alt={date} 
                   className={cn(
                     "w-full h-full object-cover transition-all duration-300", 
                     isEditMode && isSelected ? "scale-90 rounded-2xl opacity-70" : ""
                   )} 
                 />

                 {!isEditMode && (
                   <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-2">
                     <span className="text-white text-[10px] font-bold">{date.slice(5)}</span>
                   </div>
                 )}
                 
                 {/* Normal Delete Button */}
                 {!isEditMode && (
                   <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('确认删除这张体态记录吗？')) {
                          onDeletePhoto(date);
                          if (compareLeft === date) setCompareLeft(null);
                          if (compareRight === date) setCompareRight(null);
                        }
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <Trash2 className="w-3.5 h-3.5" />
                   </button>
                 )}

                 {/* Selector Overlay */}
                 {isEditMode && (
                   <div className="absolute top-2 right-2">
                     <div className={cn(
                       "w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors shadow-sm", 
                       isSelected ? "bg-indigo-600 border-indigo-600" : "border-white/90 bg-black/20"
                     )}>
                       {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                     </div>
                   </div>
                 )}
               </div>
             )})}
          </div>
        </div>
      )}

    </div>
  );
}
