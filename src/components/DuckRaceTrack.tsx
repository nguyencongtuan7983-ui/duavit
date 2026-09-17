import React, { useEffect, useRef, useState, useMemo } from 'react';
import { DuckRacer, RaceStatus } from '../types';
import { DuckSprite } from './DuckSprite';
import { Flag, Trophy, Sparkles, Volume2 } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface DuckRaceTrackProps {
  racers: DuckRacer[];
  status: RaceStatus;
  durationSeconds: number;
  onRaceFinished: (winner: DuckRacer) => void;
  soundEnabled: boolean;
}

export const DuckRaceTrack: React.FC<DuckRaceTrackProps> = ({
  racers,
  status,
  durationSeconds,
  onRaceFinished,
  soundEnabled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{ [id: string]: number }>({});
  const [boosts, setBoosts] = useState<{ [id: string]: boolean }>({});
  const [quackStates, setQuackStates] = useState<{ [id: string]: boolean }>({});
  const [wobbles, setWobbles] = useState<{ [id: string]: number }>({});
  const [countdownNum, setCountdownNum] = useState<number | string | null>(null);

  // Keep track of simulation progress
  const animFrameRef = useRef<number | null>(null);
  const raceStartTimeRef = useRef<number>(0);
  const raceWinnerRef = useRef<DuckRacer | null>(null);
  const finishTriggeredRef = useRef<boolean>(false);

  // Determine lane heights
  const totalRacers = racers.length;
  // Adaptive lane height based on number of racers
  const laneHeight = useMemo(() => {
    if (totalRacers <= 6) return 85;
    if (totalRacers <= 12) return 72;
    if (totalRacers <= 20) return 60;
    return 52;
  }, [totalRacers]);

  // Pre-seed random speed profiles and predetermined winner index for fair exciting race
  const raceProfileRef = useRef<{
    winnerId: string;
    speeds: { [id: string]: { base: number; boostPoints: number[] } };
  } | null>(null);

  // Initialize positions when racers change or status returns to idle
  useEffect(() => {
    if (status === 'idle') {
      const initialPos: { [id: string]: number } = {};
      const initialBoost: { [id: string]: boolean } = {};
      const initialWobble: { [id: string]: number } = {};
      racers.forEach((r) => {
        initialPos[r.id] = 2; // start line at 2%
        initialBoost[r.id] = false;
        initialWobble[r.id] = 0;
      });
      setPositions(initialPos);
      setBoosts(initialBoost);
      setWobbles(initialWobble);
      setCountdownNum(null);
      finishTriggeredRef.current = false;
      raceWinnerRef.current = null;
    }
  }, [racers, status]);

  // Handle countdown sequence
  useEffect(() => {
    if (status !== 'countdown') return;

    let step = 3;
    setCountdownNum(step);
    if (soundEnabled) soundEffects.countdown(false);

    const interval = setInterval(() => {
      step -= 1;
      if (step > 0) {
        setCountdownNum(step);
        if (soundEnabled) soundEffects.countdown(false);
      } else if (step === 0) {
        setCountdownNum('XUẤT PHÁT!');
        if (soundEnabled) {
          soundEffects.countdown(true);
          soundEffects.whistle();
          soundEffects.quack();
        }
      } else {
        clearInterval(interval);
        setCountdownNum(null);
      }
    }, 900);

    return () => clearInterval(interval);
  }, [status, soundEnabled]);

  // Main Race Physics Loop
  useEffect(() => {
    if (status !== 'racing') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    // Set up profiles
    finishTriggeredRef.current = false;
    const randomWinner = racers[Math.floor(Math.random() * racers.length)];
    raceWinnerRef.current = randomWinner;

    const speeds: { [id: string]: { base: number; boostPoints: number[] } } = {};
    racers.forEach((r) => {
      // Create 2-4 boost checkpoints between 15% and 85% of race time
      const boostCount = Math.floor(Math.random() * 3) + 2;
      const boostPoints = Array.from({ length: boostCount }, () => Math.random() * 0.7 + 0.15);
      speeds[r.id] = {
        base: r.id === randomWinner?.id ? 1.0 : Math.random() * 0.25 + 0.85,
        boostPoints,
      };
    });

    raceProfileRef.current = {
      winnerId: randomWinner?.id || '',
      speeds,
    };

    raceStartTimeRef.current = performance.now();
    const durationMs = durationSeconds * 1000;

    let lastQuackTime = 0;

    const tick = (now: number) => {
      const elapsed = now - raceStartTimeRef.current;
      const linearProgress = Math.min(1, elapsed / durationMs);

      // Random quacks during race
      if (soundEnabled && now - lastQuackTime > 1600 && Math.random() < 0.4) {
        soundEffects.quack(Math.random() * 0.6 + 0.8);
        lastQuackTime = now;
      }

      const newPositions: { [id: string]: number } = {};
      const newBoosts: { [id: string]: boolean } = {};
      const newWobbles: { [id: string]: number } = {};

      const winnerId = raceProfileRef.current?.winnerId;

      racers.forEach((racer) => {
        const profile = raceProfileRef.current?.speeds[racer.id];
        const isWinner = racer.id === winnerId;

        // Base distance calculation:
        // Use smooth bezier-like easing with noise
        let progressPercent: number;

        if (isWinner) {
          // Winner reaches 96% right as linearProgress reaches 1.0
          // Adds exciting lead changes in middle of race!
          const dramaticSurge = linearProgress > 0.75 ? Math.pow((linearProgress - 0.75) / 0.25, 1.4) * 0.28 : 0;
          progressPercent = 2 + (linearProgress * 0.68 + dramaticSurge) * 94;
        } else {
          // Non-winners fluctuate between 2% and ~91%
          const noise = Math.sin((elapsed / 600) + racer.laneIndex * 1.5) * 4;
          const maxCompetitorProgress = 91 + (Math.sin(racer.laneIndex) * 3);
          const scaled = Math.min(linearProgress * 0.94, 0.93);
          progressPercent = Math.max(2, Math.min(maxCompetitorProgress, 2 + scaled * 92 + noise));
        }

        // Check if boosting right now
        const isBoostingNow = profile?.boostPoints.some(bp => Math.abs(linearProgress - bp) < 0.04) || (isWinner && linearProgress > 0.82);

        newPositions[racer.id] = Math.min(97, progressPercent);
        newBoosts[racer.id] = isBoostingNow;
        newWobbles[racer.id] = Math.sin(now / 150 + racer.laneIndex);
      });

      setPositions(newPositions);
      setBoosts(newBoosts);
      setWobbles(newWobbles);

      // Check if race completed
      if (linearProgress >= 1.0 && !finishTriggeredRef.current) {
        finishTriggeredRef.current = true;
        if (raceWinnerRef.current) {
          if (soundEnabled) {
            soundEffects.whistle();
            soundEffects.victory();
          }
          onRaceFinished(raceWinnerRef.current);
        }
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [status, racers, durationSeconds, onRaceFinished, soundEnabled]);

  // Handle clicking duck for a quack
  const handleDuckClick = (racer: DuckRacer) => {
    if (soundEnabled) {
      soundEffects.quack(Math.random() * 0.5 + 0.85);
    }
    setQuackStates((prev) => ({ ...prev, [racer.id]: true }));
    setTimeout(() => {
      setQuackStates((prev) => ({ ...prev, [racer.id]: false }));
    }, 300);
  };

  // Top 3 current leaders for classroom suspense
  const sortedRacers = useMemo(() => {
    return [...racers].sort((a, b) => (positions[b.id] || 0) - (positions[a.id] || 0));
  }, [racers, positions]);

  return (
    <div
      id="race-track-wrapper"
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border-4 border-amber-300 shadow-xl bg-gradient-to-b from-sky-400 via-sky-300 to-cyan-400 select-none"
    >
      {/* Top Riverbank Grass & Flowers */}
      <div className="h-6 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 flex items-center justify-between px-6 border-b-2 border-emerald-700/40 relative z-10 shadow-sm">
        <div className="flex items-center gap-4 text-xs font-bold text-white/90">
          <span className="flex items-center gap-1">🌿 DÒNG SÔNG ĐUA VỊT MAY MẮN</span>
          {status === 'racing' && sortedRacers[0] && (
            <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-black text-[11px] animate-pulse flex items-center gap-1 shadow-sm">
              <Trophy className="w-3 h-3 text-amber-900 fill-amber-900" />
              Đang dẫn đầu: {sortedRacers[0].name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/90 font-bold">
          <span>🏁 ĐÍCH ĐẾN ({durationSeconds}s)</span>
        </div>
      </div>

      {/* Countdown Overlay Display */}
      {countdownNum !== null && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/35 backdrop-blur-[2px]">
          <div className="text-center animate-bounce">
            <span className="inline-block px-8 py-4 bg-amber-400 text-amber-950 font-black text-6xl md:text-8xl rounded-3xl border-4 border-white shadow-2xl tracking-wider">
              {countdownNum}
            </span>
          </div>
        </div>
      )}

      {/* River Swimming Area */}
      <div
        className="relative w-full overflow-y-auto overflow-x-hidden max-h-[64vh] min-h-[360px]"
        style={{ height: `${Math.max(360, racers.length * laneHeight + 20)}px` }}
      >
        {/* Animated Water Texture Ripples */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px] animate-pulse" />
        </div>

        {/* Start Line / Vạch xuất phát */}
        <div className="absolute top-0 bottom-0 left-[7%] w-3 border-r-4 border-dashed border-white/80 z-10 flex flex-col justify-between items-center py-2 pointer-events-none">
          <span className="bg-emerald-600 text-white font-extrabold text-[10px] tracking-tighter px-1 rounded transform -rotate-90 origin-center whitespace-nowrap shadow">
            XUẤT PHÁT
          </span>
          <span className="bg-emerald-600 text-white font-extrabold text-[10px] tracking-tighter px-1 rounded transform -rotate-90 origin-center whitespace-nowrap shadow">
            START
          </span>
        </div>

        {/* Finish Line / Vạch đích */}
        <div className="absolute top-0 bottom-0 right-[6%] w-8 z-10 pointer-events-none flex flex-col items-center">
          {/* Checkered flag pole */}
          <div className="h-full w-4 bg-[repeating-conic-gradient(#ffffff_0%_25%,#0f172a_0%_50%)] [background-size:12px_12px] shadow-lg border-x border-slate-700" />
          <div className="absolute top-2 -right-3 bg-red-600 text-white px-2 py-0.5 rounded font-black text-[11px] shadow-md flex items-center gap-1 border border-white">
            <Flag className="w-3.5 h-3.5 fill-current" /> ĐÍCH
          </div>
        </div>

        {/* Floating Decorative Water Lilies */}
        <div className="absolute top-8 left-[35%] opacity-40 pointer-events-none text-2xl">🪷</div>
        <div className="absolute top-32 left-[65%] opacity-40 pointer-events-none text-2xl">🪷</div>
        <div className="absolute bottom-12 left-[20%] opacity-40 pointer-events-none text-xl">🌱</div>
        <div className="absolute bottom-28 left-[80%] opacity-40 pointer-events-none text-xl">🌱</div>

        {/* Lanes and Ducks */}
        {racers.map((racer, index) => {
          const progress = positions[racer.id] || 2;
          const isBoosting = boosts[racer.id] || false;
          const isQuacking = quackStates[racer.id] || false;
          const wobble = wobbles[racer.id] || 0;
          const laneTop = index * laneHeight + 10;
          const currentRank = sortedRacers.findIndex((r) => r.id === racer.id) + 1;

          return (
            <div
              key={racer.id}
              className="absolute left-0 right-0 transition-all"
              style={{
                top: `${laneTop}px`,
                height: `${laneHeight}px`,
              }}
            >
              {/* Lane divider buoy water line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-sky-200/40 border-b border-sky-400/30" />

              {/* Lane number */}
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-sky-900/60 w-5 text-center">
                #{index + 1}
              </div>

              {/* Duck Container placed by progress percentage */}
              <div
                id={`duck-racer-${racer.id}`}
                onClick={() => handleDuckClick(racer)}
                className="absolute top-1/2 -translate-y-1/2 flex items-center cursor-pointer group select-none transition-transform duration-75"
                style={{
                  left: `${progress}%`,
                  zIndex: isBoosting ? 25 : 15 + index,
                }}
              >
                {/* Clickable duck unit */}
                <div className="relative flex flex-col items-center">
                  {/* Name Tag Pill above duck */}
                  <div
                    className={`px-2 py-0.5 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1 border transition-all duration-150 whitespace-nowrap ${
                      currentRank === 1 && status === 'racing'
                        ? 'bg-amber-400 text-amber-950 border-amber-200 scale-110 shadow-amber-400/50'
                        : currentRank <= 3 && status === 'racing'
                        ? 'bg-sky-100 text-sky-950 border-sky-300'
                        : 'bg-white/95 text-slate-800 border-slate-200'
                    }`}
                  >
                    {currentRank === 1 && status === 'racing' && (
                      <Sparkles className="w-3 h-3 text-amber-800 fill-amber-700 animate-spin" />
                    )}
                    <span className="truncate max-w-[120px]">{racer.name}</span>
                    {status === 'racing' && currentRank <= 3 && (
                      <span className="text-[10px] px-1 py-0.2 rounded-full bg-black/10 font-black">
                        #{currentRank}
                      </span>
                    )}
                  </div>

                  {/* Duck Sprite */}
                  <div className="relative mt-0.5">
                    <DuckSprite
                      color={racer.color}
                      accessory={racer.accessory}
                      wobble={wobble}
                      isBoosting={isBoosting}
                      quacking={isQuacking}
                      size={laneHeight > 70 ? 56 : 46}
                    />

                    {/* Speed Boost Badge */}
                    {isBoosting && (
                      <span className="absolute -top-3 -right-2 bg-gradient-to-r from-red-500 to-amber-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full shadow animate-bounce">
                        TĂNG TỐC! 🚀
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Riverbank Grass */}
      <div className="h-6 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 flex items-center justify-between px-6 border-t-2 border-emerald-700/40 relative z-10 shadow-inner">
        <span className="text-[11px] font-bold text-white/90">
          💡 Mẹo: Nhấn vào vịt của bạn để nghe tiếng &quot;Quạc quạc!&quot; cổ vũ!
        </span>
        <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-200">
          <Volume2 className="w-3 h-3" />
          <span>Âm thanh trường học sinh động</span>
        </div>
      </div>
    </div>
  );
};
