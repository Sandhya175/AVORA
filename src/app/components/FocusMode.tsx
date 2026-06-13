import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, SkipForward, Music, Volume2, VolumeX, Brain, Target, Coffee, Zap, CheckSquare } from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';

type FocusMode = 'focus' | 'short' | 'long';

const modeConfig = {
  focus: { label: 'Focus', time: 25 * 60, color: '#8B5CF6', desc: 'Deep work session' },
  short: { label: 'Short Break', time: 5 * 60, color: '#22C55E', desc: 'Quick refresh' },
  long: { label: 'Long Break', time: 15 * 60, color: '#6366F1', desc: 'Full recharge' },
};

const soundOptions = [
  { label: 'Rain', icon: '🌧️' }, { label: 'Forest', icon: '🌲' },
  { label: 'Café', icon: '☕' }, { label: 'White Noise', icon: '🌊' },
  { label: 'None', icon: '🔇' },
];

const tasksList = [
  { id: '1', title: 'Design landing page UI', done: false },
  { id: '2', title: 'Fix responsive issues', done: false },
  { id: '3', title: 'Review pull requests', done: true },
  { id: '4', title: 'Write unit tests', done: false },
];

const todayStats = [
  { label: 'Sessions', value: '4', icon: Brain, color: '#8B5CF6' },
  { label: 'Focus Time', value: '1h 40m', icon: Zap, color: '#A855F7' },
  { label: 'Breaks', value: '3', icon: Coffee, color: '#22C55E' },
  { label: 'Tasks Done', value: '5', icon: CheckSquare, color: '#6366F1' },
];

export function FocusMode() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const [mode, setMode] = useState<FocusMode>('focus');
  const [timeLeft, setTimeLeft] = useState(modeConfig.focus.time);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(2);
  const [sound, setSound] = useState('Rain');
  const [muted, setMuted] = useState(false);
  const [tasks, setTasks] = useState(tasksList);
  const [selectedTask, setSelectedTask] = useState<string | null>('2');

  const cfg = modeConfig[mode];
  const progress = 1 - timeLeft / cfg.time;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    setTimeLeft(cfg.time);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;
    const iv = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (mode === 'focus') setSessions(s => s + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [isRunning, mode]);

  const reset = () => { setTimeLeft(cfg.time); setIsRunning(false); };
  const skip = () => {
    setMode(m => m === 'focus' ? 'short' : 'focus');
  };

  const SIZE = 260;
  const R = (SIZE - 20) / 2;
  const CIRC = 2 * Math.PI * R;

  const card: React.CSSProperties = {
    background: t.cardBg, backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.shadow,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Today Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {todayStats.map(s => (
          <div key={s.label} style={{ ...card, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: t.text }}>{s.value}</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 22 }}>
        {/* Timer */}
        <div style={{ ...card, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          {/* Mode selector */}
          <div style={{ display: 'flex', gap: 8, background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)', border: `1px solid ${t.border}`, borderRadius: 14, padding: 4 }}>
            {(Object.keys(modeConfig) as FocusMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '8px 20px', borderRadius: 10, fontSize: 13, cursor: 'pointer', border: 'none',
                background: mode === m ? `linear-gradient(135deg,${modeConfig[m].color},${modeConfig[m].color}cc)` : 'transparent',
                color: mode === m ? 'white' : t.textMuted, fontWeight: mode === m ? 600 : 400,
                boxShadow: mode === m ? `0 4px 14px ${modeConfig[m].color}50` : 'none', transition: 'all 0.2s',
              }}>
                {modeConfig[m].label}
              </button>
            ))}
          </div>

          {/* Circular Timer */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Glow effect */}
            <div style={{
              position: 'absolute', width: SIZE * 0.8, height: SIZE * 0.8, borderRadius: '50%',
              background: `radial-gradient(circle, ${cfg.color}20 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }} />
            <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} strokeWidth={10} />
              {/* Progress */}
              <circle
                cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none"
                stroke={`url(#timer-grad-${mode})`} strokeWidth={10}
                strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - progress)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <defs>
                <linearGradient id={`timer-grad-${mode}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={cfg.color} />
                  <stop offset="100%" stopColor={mode === 'focus' ? '#A855F7' : mode === 'long' ? '#A855F7' : '#34D399'} />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: 54, fontWeight: 800, color: t.text, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 14, color: cfg.color, fontWeight: 600, marginTop: 4 }}>{cfg.desc}</div>
            </div>
          </div>

          {/* Session count */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: i <= sessions ? cfg.color : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                boxShadow: i <= sessions ? `0 0 8px ${cfg.color}80` : 'none',
                transition: 'all 0.3s',
              }} />
            ))}
            <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 6 }}>{sessions}/4 sessions</span>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button onClick={reset} style={{ width: 44, height: 44, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', border: `1px solid ${t.border}`, cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={16} />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRunning(r => !r)}
              style={{
                width: 72, height: 72, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg,${cfg.color},${mode === 'focus' ? '#A855F7' : '#34D399'})`,
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 28px ${cfg.color}60`,
              }}
            >
              {isRunning ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" style={{ marginLeft: 3 }} />}
            </motion.button>
            <button onClick={skip} style={{ width: 44, height: 44, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', border: `1px solid ${t.border}`, cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SkipForward size={16} />
            </button>
          </div>

          {/* Sound selector */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 6, fontSize: 13, color: t.textMuted, alignItems: 'center' }}>
                <Music size={14} /> Ambient Sound
              </div>
              <button onClick={() => setMuted(m => !m)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted }}>
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {soundOptions.map(s => (
                <button key={s.label} onClick={() => setSound(s.label)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                  padding: '8px 12px', borderRadius: 10, fontSize: 11, cursor: 'pointer', border: 'none',
                  background: sound === s.label ? `${cfg.color}20` : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'),
                  color: sound === s.label ? cfg.color : t.textMuted,
                  border: `1px solid ${sound === s.label ? cfg.color + '40' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Current Task */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 12 }}>Current Task</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => !task.done && setSelectedTask(task.id)}
                  style={{
                    padding: '10px 12px', borderRadius: 10, cursor: task.done ? 'default' : 'pointer',
                    border: selectedTask === task.id ? `1.5px solid ${cfg.color}` : `1px solid ${t.borderSubtle}`,
                    background: selectedTask === task.id ? `${cfg.color}10` : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'),
                    display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
                    boxShadow: selectedTask === task.id ? `0 0 12px ${cfg.color}25` : 'none',
                    opacity: task.done ? 0.5 : 1,
                  }}
                >
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: task.done ? 'none' : `1.5px solid ${t.border}`, background: task.done ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {task.done && <span style={{ color: 'white', fontSize: 9, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 13, color: task.done ? t.textDim : t.text, textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</span>
                  {selectedTask === task.id && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Focus Tips */}
          <div style={{ ...card, padding: '20px' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 12 }}>Focus Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { emoji: '📵', tip: 'Put your phone face down' },
                { emoji: '🎧', tip: 'Use headphones to block distractions' },
                { emoji: '💧', tip: 'Keep water nearby to stay hydrated' },
                { emoji: '🪟', tip: 'Close unnecessary browser tabs' },
              ].map(tip => (
                <div key={tip.tip} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ fontSize: 16 }}>{tip.emoji}</span>
                  <span style={{ fontSize: 12, color: t.textMuted }}>{tip.tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spotify-style inspirational quote */}
          <div style={{
            ...card, padding: '20px',
            background: isDark ? 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(99,102,241,0.08))' : 'linear-gradient(135deg,rgba(139,92,246,0.08),rgba(99,102,241,0.05))',
          }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>💡</div>
            <div style={{ fontSize: 13, color: t.text, lineHeight: 1.6, fontStyle: 'italic' }}>
              "The secret of getting ahead is getting started."
            </div>
            <div style={{ fontSize: 11, color: t.textDim, marginTop: 6 }}>— Mark Twain</div>
          </div>
        </div>
      </div>
    </div>
  );
}
