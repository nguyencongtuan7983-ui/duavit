/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Student, DuckRacer, RaceStatus, HistoryRecord } from './types';
import {
  TARGET_CLASSES,
  DEFAULT_CLASS_ROSTERS,
  DUCK_COLORS,
  DUCK_ACCESSORIES,
} from './data/defaultStudents';
import { RaceControls } from './components/RaceControls';
import { DuckRaceTrack } from './components/DuckRaceTrack';
import { StudentManagerModal } from './components/StudentManagerModal';
import { WinnerCelebrationModal } from './components/WinnerCelebrationModal';
import { ClassroomSummary } from './components/ClassroomSummary';
import { soundEffects } from './utils/audio';
import { Users, RotateCcw } from 'lucide-react';

const STORAGE_KEYS = {
  SELECTED_CLASS: 'lucky_wheels_selected_class_v2',
  DURATION: 'lucky_wheels_duration_v1',
  AUTO_ELIMINATE: 'lucky_wheels_auto_eliminate_v1',
  SOUND: 'lucky_wheels_sound_v1',
  HISTORY: 'lucky_wheels_history_v1',
};

function getInitialClassRoster(className: string): Student[] {
  try {
    const saved = localStorage.getItem(`lucky_wheels_roster_${className}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }

  const names = DEFAULT_CLASS_ROSTERS[className] || DEFAULT_CLASS_ROSTERS['10A2'] || [];
  return names.map((name, i) => ({
    id: `${className}-${i}-${Math.random().toString(36).substring(2, 6)}`,
    name,
    color: DUCK_COLORS[i % DUCK_COLORS.length],
    accessory: DUCK_ACCESSORIES[i % DUCK_ACCESSORIES.length],
    isActive: true,
    isEliminated: false,
    winsCount: 0,
  }));
}

export default function App() {
  // State: Currently selected class (10A2, 10A4, 10A5, 11A4, 11A5, 11A6, 11A7)
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_CLASS);
      if (saved && (TARGET_CLASSES as readonly string[]).includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return '10A2';
  });

  // State: Map of student lists for each of the 7 classes
  const [classRosters, setClassRosters] = useState<Record<string, Student[]>>(() => {
    const initial: Record<string, Student[]> = {};
    TARGET_CLASSES.forEach((cls) => {
      initial[cls] = getInitialClassRoster(cls);
    });
    return initial;
  });

  // Current active class student list
  const students = useMemo(() => {
    return classRosters[selectedClass] || [];
  }, [classRosters, selectedClass]);

  // Update student roster for currently active class
  const handleUpdateStudents = useCallback((updated: Student[]) => {
    setClassRosters((prev) => {
      const next = { ...prev, [selectedClass]: updated };
      try {
        localStorage.setItem(`lucky_wheels_roster_${selectedClass}`, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return next;
    });
  }, [selectedClass]);

  // Handle switching class from the 7 class buttons
  const handleSelectClass = useCallback((className: string) => {
    setSelectedClass(className);
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CLASS, className);
    } catch {
      // ignore
    }
    setRaceStatus('idle');
    setWinner(null);
    setShowWinnerModal(false);
  }, []);

  // State: Race Duration in Seconds
  const [durationSeconds, setDurationSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DURATION);
      if (saved) return Number(saved) || 10;
    } catch {
      // ignore
    }
    return 10;
  });

  // State: Auto Eliminate Called Students
  const [autoEliminate, setAutoEliminate] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTO_ELIMINATE);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return true; // Default ON as requested by user
  });

  // State: Sound FX
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return true;
  });

  // State: History Records
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // State: Race flow
  const [raceStatus, setRaceStatus] = useState<RaceStatus>('idle');
  const [winner, setWinner] = useState<DuckRacer | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
  const [showStudentModal, setShowStudentModal] = useState<boolean>(false);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DURATION, durationSeconds.toString());
  }, [durationSeconds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTO_ELIMINATE, JSON.stringify(autoEliminate));
  }, [autoEliminate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  // Filter racers participating in the current race (active & not eliminated)
  const participatingStudents = useMemo(() => {
    return students.filter((s) => s.isActive && !s.isEliminated);
  }, [students]);

  const racers: DuckRacer[] = useMemo(() => {
    return participatingStudents.map((s, idx) => ({
      id: s.id,
      name: s.name,
      color: s.color,
      accessory: s.accessory,
      progress: 2,
      laneIndex: idx,
      laneY: idx * 60,
      speed: 1,
      wobble: 0,
      quackPulse: 0,
      isBoosting: false,
      finished: false,
      rank: null,
    }));
  }, [participatingStudents]);

  // Handlers for Race
  const handleStartRace = useCallback(() => {
    if (participatingStudents.length === 0) {
      setShowStudentModal(true);
      return;
    }
    setWinner(null);
    setShowWinnerModal(false);
    setRaceStatus('countdown');

    // Countdown is ~2.8 seconds then start racing
    setTimeout(() => {
      setRaceStatus('racing');
    }, 2800);
  }, [participatingStudents]);

  const handleResetRace = useCallback(() => {
    setRaceStatus('idle');
    setWinner(null);
    setShowWinnerModal(false);
  }, []);

  const handleRaceFinished = useCallback((winningRacer: DuckRacer) => {
    setRaceStatus('finished');
    setWinner(winningRacer);
    setShowWinnerModal(true);

    // Record history
    const record: HistoryRecord = {
      id: Date.now().toString(),
      studentId: winningRacer.id,
      studentName: winningRacer.name,
      timestamp: Date.now(),
      duration: durationSeconds,
    };
    setHistory((prev) => [record, ...prev]);

    // Increment win count for student in active class
    handleUpdateStudents(
      students.map((s) =>
        s.id === winningRacer.id ? { ...s, winsCount: s.winsCount + 1 } : s
      )
    );
  }, [durationSeconds, handleUpdateStudents, students]);

  // Handle continuing after winner announcement
  const handleContinueAfterWin = useCallback((eliminateWinner: boolean) => {
    setShowWinnerModal(false);
    setRaceStatus('idle');

    if (winner && eliminateWinner) {
      handleUpdateStudents(
        students.map((s) =>
          s.id === winner.id ? { ...s, isEliminated: true, calledAt: Date.now() } : s
        )
      );
    }
    setWinner(null);
  }, [winner, handleUpdateStudents, students]);

  // Re-run same race
  const handleReRace = useCallback(() => {
    setShowWinnerModal(false);
    handleStartRace();
  }, [handleStartRace]);

  // Restore all eliminated students in the current class
  const handleRestoreAllEliminated = useCallback(() => {
    if (soundEnabled) soundEffects.pop();
    handleUpdateStudents(
      students.map((s) => ({ ...s, isEliminated: false, isActive: true }))
    );
  }, [handleUpdateStudents, soundEnabled, students]);

  const totalCount = students.length;
  const activeCount = participatingStudents.length;
  const eliminatedCount = students.filter((s) => s.isEliminated).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 p-3 sm:p-6 lg:p-8 flex flex-col justify-between max-w-7xl mx-auto">
      <div>
        {/* Header Controls with 7 Class selection buttons */}
        <RaceControls
          status={raceStatus}
          selectedClass={selectedClass}
          onSelectClass={handleSelectClass}
          activeCount={activeCount}
          eliminatedCount={eliminatedCount}
          totalCount={totalCount}
          durationSeconds={durationSeconds}
          onChangeDuration={setDurationSeconds}
          autoEliminate={autoEliminate}
          onToggleAutoEliminate={setAutoEliminate}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onStartRace={handleStartRace}
          onResetRace={handleResetRace}
          onOpenStudentModal={() => setShowStudentModal(true)}
          onRestoreAllEliminated={handleRestoreAllEliminated}
        />

        {/* Main Content Area */}
        {activeCount === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-amber-300 shadow-xl text-center my-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-4xl shadow-inner">
              🦆
            </div>
            {eliminatedCount > 0 ? (
              <>
                <h2 className="text-2xl font-black text-amber-950 mb-2">
                  TẤT CẢ HỌC SINH LỚP {selectedClass} ĐÃ ĐƯỢC GỌI TÊN! 🎉
                </h2>
                <p className="text-sm font-bold text-slate-600 max-w-md mx-auto mb-6">
                  Đã hoàn thành vòng gọi tên cho cả lớp {selectedClass} ({eliminatedCount} bạn). Bạn có thể khôi phục lại toàn bộ danh sách để bắt đầu vòng mới!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    id="btn-restore-all-empty-state"
                    onClick={handleRestoreAllEliminated}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm rounded-2xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Khôi phục lại tất cả {eliminatedCount} bạn lớp {selectedClass}</span>
                  </button>
                  <button
                    onClick={() => setShowStudentModal(true)}
                    className="px-5 py-3 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-sm rounded-2xl transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4 inline-block mr-1.5" />
                    Quản lý danh sách lớp {selectedClass}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-amber-950 mb-2">
                  CHƯA CÓ HỌC SINH NÀO Ở LỚP {selectedClass} ĐỂ BẮT ĐẦU ĐUA!
                </h2>
                <p className="text-sm font-bold text-slate-600 max-w-md mx-auto mb-6">
                  Vui lòng thêm tên các bạn học sinh vào danh sách lớp {selectedClass} để mở cuộc đua vịt nhé!
                </p>
                <button
                  id="btn-open-add-students"
                  onClick={() => setShowStudentModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black text-sm rounded-2xl shadow-lg border-2 border-white flex items-center gap-2 mx-auto transition-all active:scale-95 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Thêm danh sách học sinh lớp {selectedClass} ngay</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <DuckRaceTrack
            racers={racers}
            status={raceStatus}
            durationSeconds={durationSeconds}
            onRaceFinished={handleRaceFinished}
            soundEnabled={soundEnabled}
          />
        )}

        {/* Classroom Summary Footer */}
        <ClassroomSummary
          students={students}
          history={history}
          onUpdateStudents={handleUpdateStudents}
          onOpenAddModal={() => setShowStudentModal(true)}
          soundEnabled={soundEnabled}
        />
      </div>

      {/* Footer Branding for Educational App */}
      <footer className="mt-6 text-center text-xs font-bold text-amber-900/60 flex flex-wrap items-center justify-center gap-2">
        <span>LUCKY WHEELS • Tác giả: <strong className="text-amber-950 font-black">NGUYỄN CÔNG TUẤN</strong></span>
        <span>•</span>
        <span>Dành cho máy chiếu, màn hình tương tác & Smartboard</span>
      </footer>

      {/* Student Manager Modal */}
      <StudentManagerModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        students={students}
        onUpdateStudents={handleUpdateStudents}
        soundEnabled={soundEnabled}
        selectedClass={selectedClass}
      />

      {/* Winner Celebration Modal */}
      <WinnerCelebrationModal
        isOpen={showWinnerModal}
        winner={winner}
        autoEliminate={autoEliminate}
        onContinue={handleContinueAfterWin}
        onReRace={handleReRace}
        soundEnabled={soundEnabled}
      />
    </main>
  );
}
