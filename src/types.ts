export type DuckAccessory = 'crown' | 'sunglasses' | 'cap' | 'flower' | 'bow' | 'none';

export type TargetClassName = '10A2' | '10A4' | '10A5' | '11A4' | '11A5' | '11A6' | '11A7';

export interface Student {
  id: string;
  name: string;
  color: string;
  accessory: DuckAccessory;
  isActive: boolean; // included in current race
  isEliminated: boolean; // already called and eliminated
  calledAt?: number;
  winsCount: number;
}

export interface DuckRacer {
  id: string;
  name: string;
  color: string;
  accessory: DuckAccessory;
  progress: number; // 0 to 100
  laneIndex: number;
  laneY: number; // normalized Y position or px
  speed: number;
  wobble: number;
  quackPulse: number;
  isBoosting: boolean;
  finished: boolean;
  rank: number | null;
  finishTime?: number;
}

export type RaceStatus = 'idle' | 'countdown' | 'racing' | 'finished';

export interface RaceSettings {
  durationSeconds: number; // custom duration in seconds
  autoEliminateWinner: boolean; // loại tên học sinh đã gọi
  soundEffects: boolean;
  bgmEnabled: boolean;
}

export interface HistoryRecord {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: number;
  duration: number;
}
