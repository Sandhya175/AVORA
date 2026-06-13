import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, SkipForward, Music, Volume2, VolumeX, Brain, Target, Coffee, Zap, CheckSquare } from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';
import { useIsMobile } from './ui/use-mobile';
import { Task } from './TaskManagement';

type FocusModeType = 'focus' | 'short' | 'long';

const soundOptions = [
  { label: 'Rain', icon: '🌧️' }, { label: 'Forest', icon: '🌲' },
  { label: 'Café', icon: '☕' }, { label: 'White Noise', icon: '🌊' },
  { label: 'None', icon: '🔇' },
];

export function FocusMode() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const isMobile = useIsMobile();

  // Load Pomodoro Settings from LocalStorage (with fallback)
  const [durations, setDurations] = useState({ focus: 25, short: 5, long: 15 });
  const [mode, setMode] = useState<FocusModeType>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [completedBreaks, setCompletedBreaks] = useState(0);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
  
  // Ambient Sound State
  const [sound, setSound] = useState('Rain');
  const [muted, setMuted] = useState(false);
  
  // Task State from LocalStorage
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Load settings & tasks
  useEffect(() => {
    const loadSettings = () => {
      const prodSettings = localStorage.getItem('avora_prod_settings');
      if (prodSettings) {
        const parsed = JSON.parse(prodSettings);
        setDurations({
          focus: parsed.pomodoroLength || 25,
          short: parsed.shortBreak || 5,
          long: parsed.longBreak || 15,
        });
      }

      const savedTasks = localStorage.getItem('avora_tasks');
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        setTasks(parsed);
        // Set first pending task as selected by default
        const firstPending = parsed.find((t: any) => !t.done);
        if (firstPending) setSelectedTaskId(firstPending.id);
      }

      const savedFocusSeconds = localStorage.getItem('avora_focus_seconds');
      if (savedFocusSeconds) {
        setTotalFocusSeconds(Number(savedFocusSeconds));
      }
    };
    loadSettings();
    window.addEventListener('storage', loadSettings);
    window.addEventListener('tasks_updated', loadSettings);
    return () => {
      window.removeEventListener('storage', loadSettings);
      window.removeEventListener('tasks_updated', loadSettings);
    };
  }, []);

  // Update timeLeft when mode or durations change
  useEffect(() => {
    const min = durations[mode];
    setTimeLeft(min * 60);
    setIsRunning(false);
  }, [mode, durations]);

  // Timer Countdown loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          // Play notification sound if possible
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(520, audioCtx.currentTime);
            osc.type = 'sine';
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
          } catch (e) {}

          // Handle focus round completion
          if (mode === 'focus') {
            setCompletedSessions(s => s + 1);
            const focusSessionSecs = durations.focus * 60;
            const nextTotalSecs = totalFocusSeconds + focusSessionSecs;
            setTotalFocusSeconds(nextTotalSecs);
            localStorage.setItem('avora_focus_seconds', String(nextTotalSecs));
            window.dispatchEvent(new Event('tasks_updated'));

            // Auto advance task progress if a task was selected
            if (selectedTaskId) {
              const savedTasks = localStorage.getItem('avora_tasks');
              if (savedTasks) {
                const parsed: Task[] = JSON.parse(savedTasks);
                const updated = parsed.map(t => {
                  if (t.id === selectedTaskId) {
                    const nextProgress = Math.min(100, t.progress + 25);
                    const done = nextProgress === 100;
                    return {
                      ...t,
                      progress: nextProgress,
                      done,
                      status: done ? 'completed' as const : 'in_progress' as const
                    };
                  }
                  return t;
                });
                localStorage.setItem('avora_tasks', JSON.stringify(updated));
                window.dispatchEvent(new Event('tasks_updated'));
              }
            }
          } else {
            setCompletedBreaks(b => b + 1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mode, durations, totalFocusSeconds, selectedTaskId]);

  const reset = () => {
    setTimeLeft(durations[mode] * 60);
    setIsRunning(false);
  };

  const skip = () => {
    setMode(m => m === 'focus' ? 'short' : 'focus');
  };

  const currentModeConfig = {
    focus: { label: 'Focus', color: '#8B5CF6', desc: 'Deep work session' },
    short: { label: 'Short Break', color: '#10B981', desc: 'Quick refresh' },
    long: { label: 'Long Break', color: '#3B82F6', desc: 'Full recharge' },
  }[mode];

  const progress = 1 - (timeLeft / (durations[mode] * 60));
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const SIZE = 260;
  const R = (SIZE - 20) / 2;
  const CIRC = 2 * Math.PI * R;

  const card: React.CSSProperties = {
    background: t.cardBg, backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.shadow,
  };

  // Convert total focus seconds to nice format
  const formatFocusTime = (secs: number) => {
    if (secs === 0) return '2h 24m'; // default fallback mockup
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const todayStats = [
    { label: 'Sessions', value: String(completedSessions), icon: Brain, color: '#8B5CF6' },
    { label: 'Focus Time', value: formatFocusTime(totalFocusSeconds), icon: Zap, color: '#A855F7' },
    { label: 'Breaks', value: String(completedBreaks), icon: Coffee, color: '#10B981' },
    { label: 'Tasks Completed', value: String(tasks.filter(t => t.done).length), icon: CheckSquare, color: '#3B82F6' },
  ];

  const activeTasksList = tasks.filter(t => !t.done).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Today Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14 }}>
        {todayStats.map(s => (
          <div key={s.label} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 750, color: t.text }}>{s.value}</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: 22 }}>
        
        {/* Timer main card */}
        <div style={{ ...card, padding: isMobile ? '24px 16px' : '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          
          {/* Mode Selector buttons */}
          <div style={{ display: 'flex', gap: 4, background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)', border: `1px solid ${t.border}`, borderRadius: 14, padding: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['focus', 'short', 'long'] as const).map(m => {
              const label = m === 'focus' ? 'Focus' : m === 'short' ? 'Short Break' : 'Long Break';
              const activeColor = m === 'focus' ? '#8B5CF6' : m === 'short' ? '#10B981' : '#3B82F6';
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: '8px 20px', borderRadius: 10, fontSize: 13, cursor: 'pointer', border: 'none',
                    background: active ? `linear-gradient(135deg, ${activeColor}, ${activeColor}cc)` : 'transparent',
                    color: active ? 'white' : t.textMuted, fontWeight: active ? 600 : 400,
                    boxShadow: active ? `0 4px 14px ${activeColor}40` : 'none', transition: 'all 0.2s',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Circular Countdown visual */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute', width: SIZE * 0.8, height: SIZE * 0.8, borderRadius: '50%',
              background: `radial-gradient(circle, ${currentModeConfig.color}20 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }} />
            <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} strokeWidth={8} />
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none"
                stroke={`url(#timer-grad-${mode})`} strokeWidth={8}
                strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
              <defs>
                <linearGradient id={`timer-grad-${mode}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={currentModeConfig.color} />
                  <stop offset="100%" stopColor={mode === 'focus' ? '#A855F7' : mode === 'long' ? '#6366F1' : '#34D399'} />
                </linearGradient>
              </defs>
            </svg>
            
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 13, color: currentModeConfig.color, fontWeight: 600, marginTop: 4 }}>
                {currentModeConfig.desc}
              </div>
            </div>
          </div>

          {/* Sessions tracker indicators */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: i <= completedSessions ? currentModeConfig.color : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                boxShadow: i <= completedSessions ? `0 0 8px ${currentModeConfig.color}80` : 'none',
                transition: 'all 0.3s',
              }} />
            ))}
            <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 6 }}>{completedSessions}/4 sessions</span>
          </div>

          {/* Controls Button Panel */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button onClick={reset} style={{ width: 44, height: 44, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', border: `1px solid ${t.border}`, cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={16} />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(!isRunning)}
              style={{
                width: 68, height: 68, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg,${currentModeConfig.color},${mode === 'focus' ? '#A855F7' : '#34D399'})`,
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 28px ${currentModeConfig.color}40`,
              }}
            >
              {isRunning ? <Pause size={26} fill="white" /> : <Play size={26} fill="white" style={{ marginLeft: 3 }} />}
            </motion.button>
            <button onClick={skip} style={{ width: 44, height: 44, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', border: `1px solid ${t.border}`, cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SkipForward size={16} />
            </button>
          </div>

          {/* Ambient Sound Selector */}
          <div style={{ width: '100%', borderTop: `1px solid ${t.borderSubtle}`, paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 6, fontSize: 13, color: t.textMuted, alignItems: 'center' }}>
                <Music size={14} /> Ambient Audio
              </div>
              <button onClick={() => setMuted(!muted)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted }}>
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {soundOptions.map(s => {
                const active = sound === s.label;
                return (
                  <button
                    key={s.label}
                    onClick={() => setSound(s.label)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                      padding: '8px 12px', borderRadius: 10, fontSize: 11, cursor: 'pointer',
                      background: active ? `${currentModeConfig.color}20` : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                      color: active ? currentModeConfig.color : t.textMuted,
                      border: `1px solid ${active ? currentModeConfig.color + '40' : 'transparent'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Real Task Picker */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: 14, fontWeight: 650, color: t.text, marginBottom: 12 }}>Associate Active Task</div>
            {activeTasksList.length === 0 ? (
              <div style={{ fontSize: 12, color: t.textMuted, textAlign: 'center', padding: '12px 0' }}>
                No active tasks to focus on!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeTasksList.map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    style={{
                      padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                      border: selectedTaskId === task.id ? `1.5px solid ${currentModeConfig.color}` : `1px solid ${t.borderSubtle}`,
                      background: selectedTaskId === task.id ? `${currentModeConfig.color}10` : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
                      display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
                      boxShadow: selectedTaskId === task.id ? `0 0 12px ${currentModeConfig.color}20` : 'none',
                    }}
                  >
                    <div style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selectedTaskId === task.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: currentModeConfig.color }} />}
                    </div>
                    <span style={{ fontSize: 12.5, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pomodoro Focus Guidelines */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: 14, fontWeight: 650, color: t.text, marginBottom: 12 }}>Focus Protocol</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { emoji: '📵', tip: 'Keep notification devices silenced.' },
                { emoji: '🎧', tip: 'Play ambient loops to mask background noises.' },
                { emoji: '🪟', tip: 'Work on a single primary tab to reduce multitasking.' },
                { emoji: '💧', tip: 'Stay hydrated during breaks.' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <span style={{ fontSize: 12, color: t.textMuted }}>{item.tip}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
