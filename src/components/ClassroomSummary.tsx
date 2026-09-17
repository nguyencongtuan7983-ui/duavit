import React from 'react';
import { Student, HistoryRecord } from '../types';
import { Trophy, History, Shuffle, Users, PlusCircle } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { DUCK_COLORS, DUCK_ACCESSORIES } from '../data/defaultStudents';

interface ClassroomSummaryProps {
  students: Student[];
  history: HistoryRecord[];
  onUpdateStudents: (students: Student[]) => void;
  onOpenAddModal: () => void;
  soundEnabled: boolean;
}

export const ClassroomSummary: React.FC<ClassroomSummaryProps> = ({
  students,
  history,
  onUpdateStudents,
  onOpenAddModal,
  soundEnabled,
}) => {
  const activeCount = students.filter((s) => s.isActive && !s.isEliminated).length;
  const eliminatedCount = students.filter((s) => s.isEliminated).length;

  // Shuffle colors & accessories for a fresh fun look!
  const handleShuffleDuckLooks = () => {
    if (soundEnabled) soundEffects.quack();
    const updated = students.map((s) => ({
      ...s,
      color: DUCK_COLORS[Math.floor(Math.random() * DUCK_COLORS.length)],
      accessory: DUCK_ACCESSORIES[Math.floor(Math.random() * DUCK_ACCESSORIES.length)],
    }));
    onUpdateStudents(updated);
  };

  return (
    <div className="w-full mt-4 bg-white/90 backdrop-blur-sm rounded-3xl p-4 border border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
      {/* Stats summary badges */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Users className="w-4 h-4 text-amber-700" />
          <span className="font-bold text-slate-700">
            Tổng số: <strong className="text-amber-950 font-black">{students.length}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-emerald-900">
            Sẵn sàng đua: <strong className="font-black">{activeCount}</strong> bạn
          </span>
        </div>

        <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="font-bold text-rose-900">
            Đã gọi / Đã loại: <strong className="font-black">{eliminatedCount}</strong> bạn
          </span>
        </div>
      </div>

      {/* History & Quick Utilities */}
      <div className="flex flex-wrap items-center gap-2">
        {history.length > 0 && (
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl font-bold">
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Lượt đua gần nhất: </span>
            <span className="text-amber-900 font-black">
              {history[0].studentName}
            </span>
          </div>
        )}

        <button
          onClick={handleShuffleDuckLooks}
          title="Đổi màu sắc và phụ kiện vịt ngẫu nhiên cho vui"
          className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-xl border border-amber-300 transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Đổi màu vịt</span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Thêm học sinh</span>
        </button>
      </div>
    </div>
  );
};
