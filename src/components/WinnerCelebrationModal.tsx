import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DuckRacer } from '../types';
import { DuckSprite } from './DuckSprite';
import { Trophy, Sparkles, UserCheck, RotateCcw, ArrowRight } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface WinnerCelebrationModalProps {
  isOpen: boolean;
  winner: DuckRacer | null;
  autoEliminate: boolean;
  onContinue: (eliminateWinner: boolean) => void;
  onReRace: () => void;
  soundEnabled: boolean;
}

export const WinnerCelebrationModal: React.FC<WinnerCelebrationModalProps> = ({
  isOpen,
  winner,
  autoEliminate,
  onContinue,
  onReRace,
  soundEnabled,
}) => {
  useEffect(() => {
    if (isOpen && winner) {
      // Trigger multiple confetti bursts
      const duration = 2500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#FACC15', '#FB923C', '#38BDF8', '#4ADE80', '#F472B6'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#FACC15', '#FB923C', '#38BDF8', '#4ADE80', '#F472B6'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen, winner]);

  if (!isOpen || !winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-300 via-amber-100 to-yellow-50 rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl text-center overflow-hidden">
        {/* Decorative background sunburst rays */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-widest shadow-md border-2 border-white mb-3">
          <Trophy className="w-4 h-4 text-amber-900 fill-amber-900" />
          <span>VỊT VỀ ĐÍCH ĐẦU TIÊN!</span>
          <Sparkles className="w-4 h-4 text-amber-900" />
        </div>

        {/* Giant Winner Duck Sprite */}
        <div className="relative my-3 flex justify-center items-center">
          <div className="relative p-4 rounded-full bg-gradient-to-tr from-sky-400/30 to-amber-200/50 border-4 border-amber-300 shadow-xl">
            <DuckSprite
              color={winner.color}
              accessory={winner.accessory === 'none' ? 'crown' : winner.accessory}
              size={120}
              isBoosting={true}
              quacking={true}
            />
          </div>
        </div>

        {/* Winner Student Name Announcement */}
        <div className="space-y-1 my-4">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            🎉 XIN CHÚC MỪNG BẠN
          </p>
          <h1
            id="winner-student-name"
            className="text-3xl sm:text-4xl font-black text-amber-950 tracking-tight drop-shadow-sm px-2 py-1 bg-white/70 rounded-2xl border-2 border-amber-300"
          >
            {winner.name}
          </h1>
          <p className="text-xs font-extrabold text-amber-800 mt-2">
            Đã bứt phá xuất sắc để giành chiến thắng trong chặng đua!
          </p>
        </div>

        {/* Elimination Notification Info */}
        <div className="bg-white/80 rounded-2xl p-3 border border-amber-300/80 mb-6 text-xs">
          {autoEliminate ? (
            <div className="flex items-center justify-center gap-1.5 text-amber-950 font-bold">
              <UserCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>
                Chế độ tự động: <strong>{winner.name}</strong> sẽ được loại khỏi các vòng sau.
              </span>
            </div>
          ) : (
            <div className="text-slate-600 font-bold">
              Bạn có muốn loại <strong>{winner.name}</strong> khỏi vòng đua tiếp theo không?
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {autoEliminate ? (
            <button
              id="btn-winner-continue-eliminate"
              onClick={() => {
                if (soundEnabled) soundEffects.pop();
                onContinue(true);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 active:scale-98 text-amber-950 font-black text-base rounded-2xl shadow-lg border-2 border-amber-300 flex items-center justify-center gap-2 transition-all"
            >
              <span>Loại & Bắt đầu lượt đua mới</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                id="btn-winner-eliminate-continue"
                onClick={() => {
                  if (soundEnabled) soundEffects.pop();
                  onContinue(true);
                }}
                className="py-3 px-3 bg-red-500 hover:bg-red-600 text-white font-black text-xs sm:text-sm rounded-xl shadow flex items-center justify-center gap-1.5 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Loại tên & Tiếp tục</span>
              </button>
              <button
                id="btn-winner-keep-continue"
                onClick={() => {
                  if (soundEnabled) soundEffects.pop();
                  onContinue(false);
                }}
                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Giữ lại & Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              id="btn-winner-rerace"
              onClick={() => {
                if (soundEnabled) soundEffects.pop();
                onReRace();
              }}
              className="text-xs font-bold text-slate-600 hover:text-amber-950 flex items-center gap-1 underline underline-offset-4"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Đua lại vòng này (giữ nguyên thí sinh)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
