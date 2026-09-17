import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Users,
  Timer,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  UserCheck,
  Sparkles,
  Sliders,
  GraduationCap,
} from 'lucide-react';
import { RaceStatus } from '../types';
import { soundEffects } from '../utils/audio';
import { TARGET_CLASSES } from '../data/defaultStudents';

interface RaceControlsProps {
  status: RaceStatus;
  selectedClass: string;
  onSelectClass: (className: string) => void;
  activeCount: number;
  eliminatedCount: number;
  totalCount: number;
  durationSeconds: number;
  onChangeDuration: (seconds: number) => void;
  autoEliminate: boolean;
  onToggleAutoEliminate: (val: boolean) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onStartRace: () => void;
  onResetRace: () => void;
  onOpenStudentModal: () => void;
  onRestoreAllEliminated: () => void;
}

const DURATION_PRESETS = [5, 10, 15, 20, 30];

export const RaceControls: React.FC<RaceControlsProps> = ({
  status,
  selectedClass,
  onSelectClass,
  activeCount,
  eliminatedCount,
  totalCount,
  durationSeconds,
  onChangeDuration,
  autoEliminate,
  onToggleAutoEliminate,
  soundEnabled,
  onToggleSound,
  onStartRace,
  onResetRace,
  onOpenStudentModal,
  onRestoreAllEliminated,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isRacingOrCountdown = status === 'countdown' || status === 'racing';

  return (
    <header className="w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-lg border-2 border-amber-200/80 p-4 sm:p-5 mb-4">
      {/* Top Row: App Title & Quick Utility Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-3.5 mb-3.5">
        {/* App Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-2xl shadow-md border-2 border-amber-200">
            🦆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight flex items-center gap-1.5 font-['Fredoka',sans-serif]">
                LUCKY WHEELS
              </h1>
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                Đua Vịt Lớp Học
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wide">
                Tác giả:
              </span>
              <span className="bg-amber-100 text-amber-950 border border-amber-300/80 px-2 py-0.2 rounded-md text-xs font-black tracking-wide shadow-xs">
                NGUYỄN CÔNG TUẤN
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-500 mt-0.5">
              Vòng quay gọi tên học sinh ngẫu nhiên kịch tính & vui nhộn
            </p>
          </div>
        </div>

        {/* Action Controls: Manage Students, Sound, Fullscreen */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Manage Students Button */}
          <button
            id="btn-manage-students"
            onClick={onOpenStudentModal}
            disabled={isRacingOrCountdown}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 disabled:opacity-50 text-amber-950 font-black text-xs sm:text-sm border border-amber-300 shadow-sm transition-all active:scale-95"
          >
            <Users className="w-4 h-4 text-amber-800" />
            <span>Danh sách học sinh</span>
            <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-xs font-black">
              {activeCount}/{totalCount}
            </span>
          </button>

          {/* Sound Toggle Button */}
          <button
            id="btn-toggle-sound"
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) soundEffects.quack();
            }}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className={`p-2.5 rounded-2xl border transition-all ${
              soundEnabled
                ? 'bg-amber-400 border-amber-400 text-amber-950 shadow-sm'
                : 'bg-slate-100 border-slate-300 text-slate-400 hover:text-slate-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="btn-toggle-fullscreen"
            onClick={toggleFullscreen}
            title="Toàn màn hình (thích hợp máy chiếu / Smartboard)"
            className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 shadow-sm transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 7 Class Selection Buttons: 10A2, 10A4, 10A5, 11A4, 11A5, 11A6, 11A7 */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-3 border-b border-amber-100/90 bg-amber-50/50 p-2.5 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wide">
          <div className="p-1.5 bg-amber-200/80 rounded-lg text-amber-900">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span>CHỌN LỚP HỌC (7 LỚP):</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {TARGET_CLASSES.map((cls) => {
            const isSelected = selectedClass.toUpperCase() === cls.toUpperCase();
            return (
              <button
                key={cls}
                id={`btn-class-${cls.toLowerCase()}`}
                disabled={isRacingOrCountdown}
                onClick={() => {
                  if (isSelected) return;
                  if (soundEnabled) soundEffects.pop();
                  onSelectClass(cls);
                }}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-amber-950 border-2 border-white ring-2 ring-amber-400 scale-105 shadow-md font-extrabold'
                    : 'bg-white hover:bg-amber-100/80 text-slate-700 hover:text-amber-950 border border-amber-200/70 hover:border-amber-300'
                } ${isRacingOrCountdown ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>Lớp {cls}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Duration selector, Auto-eliminate toggle, Big Race Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Duration Selection (Thời gian bao nhiêu giây) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 mr-1">
            <Timer className="w-4 h-4 text-amber-600" />
            <span>THỜI GIAN ĐUA:</span>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center bg-amber-50 p-1 rounded-2xl border border-amber-200 gap-1">
            {DURATION_PRESETS.map((sec) => (
              <button
                key={sec}
                id={`btn-duration-${sec}s`}
                disabled={isRacingOrCountdown}
                onClick={() => {
                  onChangeDuration(sec);
                  if (soundEnabled) soundEffects.pop();
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                  durationSeconds === sec && !showCustomDuration
                    ? 'bg-amber-400 text-amber-950 shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {sec}s
              </button>
            ))}

            {/* Custom slider toggle */}
            <button
              onClick={() => setShowCustomDuration(!showCustomDuration)}
              title="Chỉnh số giây tùy ý"
              className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                showCustomDuration
                  ? 'bg-amber-400 text-amber-950'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Custom Duration Slider (if toggled) */}
          {showCustomDuration && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-amber-300 shadow-sm animate-in fade-in">
              <input
                id="input-custom-duration-slider"
                type="range"
                min="3"
                max="60"
                step="1"
                value={durationSeconds}
                disabled={isRacingOrCountdown}
                onChange={(e) => onChangeDuration(Number(e.target.value))}
                className="w-24 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-black text-amber-900 min-w-[28px]">
                {durationSeconds}s
              </span>
            </div>
          )}
        </div>

        {/* Auto-Eliminate Called Students Switch (Loại tên học sinh đã gọi) */}
        <div className="flex items-center gap-2 bg-amber-50/80 px-3.5 py-2 rounded-2xl border border-amber-200">
          <label
            htmlFor="toggle-auto-eliminate"
            className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700"
          >
            <input
              id="toggle-auto-eliminate"
              type="checkbox"
              checked={autoEliminate}
              disabled={isRacingOrCountdown}
              onChange={(e) => {
                onToggleAutoEliminate(e.target.checked);
                if (soundEnabled) soundEffects.pop();
              }}
              className="w-4 h-4 rounded text-amber-600 accent-amber-500 focus:ring-amber-400 cursor-pointer"
            />
            <span className="font-extrabold text-amber-950">
              Loại tên học sinh đã gọi
            </span>
          </label>

          {eliminatedCount > 0 && (
            <button
              onClick={onRestoreAllEliminated}
              title="Khôi phục lại danh sách các bạn đã gọi"
              className="ml-1 text-[11px] font-black text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <UserCheck className="w-3 h-3" />
              Đã loại {eliminatedCount} (Khôi phục)
            </button>
          )}
        </div>

        {/* Start / Reset Race Button */}
        <div className="flex items-center gap-2 ml-auto">
          {status === 'finished' && (
            <button
              id="btn-reset-race"
              onClick={onResetRace}
              className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Đặt lại</span>
            </button>
          )}

          <button
            id="btn-start-race"
            onClick={onStartRace}
            disabled={isRacingOrCountdown || activeCount === 0}
            className={`px-6 sm:px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl transition-all active:scale-95 ${
              isRacingOrCountdown
                ? 'bg-amber-300 text-amber-900/60 cursor-not-allowed'
                : activeCount === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-amber-950 border-2 border-white shadow-amber-400/40 hover:scale-102'
            }`}
          >
            {isRacingOrCountdown ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>ĐANG ĐUA VỊT...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>BẮT ĐẦU ĐUA VỊT ({durationSeconds}s)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
