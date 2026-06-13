import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2, Clock, AlertCircle, TrendingUp, Flame,
  MoreHorizontal, ChevronRight, Plus, ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useTheme, getTheme } from './ThemeContext';

const weeklyData = [
  { day: 'M', tasks: 4, focus: 2.1 },
  { day: 'T', tasks: 7, focus: 3.5 },
  { day: 'W', tasks: 5, focus: 2.8 },
  { day: 'T', tasks: 9, focus: 4.2 },
  { day: 'F', tasks: 8, focus: 3.9 },
  { day: 'S', tasks: 11, focus: 5.1 },
  { day: 'S', tasks: 6, focus: 2.6 },
];

const productivityData = [
  { time: '6am', score: 35 }, { time: '8am', score: 62 }, { time: '10am', score: 88 },
  { time: '12pm', score: 72 }, { time: '2pm', score: 58 }, { time: '4pm', score: 81 },
  { time: '6pm', score: 55 }, { time: '8pm', score: 40 },
];

const categoryData = [
  { name: 'Work', value: 45, color: '#8B5CF6' },
  { name: 'Personal', value: 25, color: '#6366F1' },
  { name: 'Design', value: 20, color: '#A855F7' },
  { name: 'Learning', value: 10, color: '#EC4899' },
];

const tasks = [
  { id: '1', title: 'Design landing page UI', category: 'Design', priority: 'high', due: 'Today, 10:00 AM', done: false, assignee: 'S' },
  { id: '2', title: 'Build homepage UI', category: 'Development', priority: 'medium', due: 'Today, 12:30 PM', done: true, assignee: 'S' },
  { id: '3', title: 'Fix responsive issues', category: 'Development', priority: 'high', due: 'Today, 3:00 PM', done: false, assignee: 'M' },
  { id: '4', title: 'Prepare for presentation', category: 'Work', priority: 'medium', due: 'Tomorrow', done: false, assignee: 'S' },
  { id: '5', title: 'Read 20 pages', category: 'Personal', priority: 'low', due: 'Today, 8:00 PM', done: false, assignee: 'S' },
];

const priorityConfig: Record<string, { color: string; bg: string }> = {
  high: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  low: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
};

const catColors: Record<string, string> = {
  Design: '#8B5CF6', Development: '#6366F1', Work: '#A855F7', Personal: '#EC4899',
};

interface StatCardProps {
  label: string; value: string; delta: string; positive: boolean; icon: React.ReactNode; accent: string; t: ReturnType<typeof getTheme>;
}

function StatCard({ label, value, delta, positive, icon, accent, t }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: `0 8px 30px rgba(139,92,246,0.2)` }}
      style={{
        flex: 1,
        background: t.cardBg,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${t.border}`,
        borderRadius: 16,
        padding: '18px 20px',
        display: 'flex', flexDirection: 'column', gap: 8,
        boxShadow: t.shadow,
        transition: 'box-shadow 0.2s',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 12, color: t.textMuted, letterSpacing: '0.02em' }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
        <ArrowUpRight size={12} color={positive ? '#22C55E' : '#EF4444'} style={{ transform: positive ? 'none' : 'rotate(90deg)' }} />
        <span style={{ color: positive ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{delta}</span>
        <span style={{ color: t.textDim }}>vs last week</span>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(['2']));

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'pending') return !completedIds.has(task.id);
    if (taskFilter === 'done') return completedIds.has(task.id);
    return true;
  });

  const toggleTask = (id: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const tooltipStyle = {
    contentStyle: {
      background: t.tooltipBg, border: `1px solid ${t.border}`,
      borderRadius: 10, color: t.text, fontSize: 12,
      boxShadow: t.shadow,
    },
    labelStyle: { color: t.textMuted },
    cursor: { fill: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)' },
  };

  const card: React.CSSProperties = {
    background: t.cardBg,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`,
    borderRadius: 18,
    boxShadow: t.shadow,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 16 }}>
        <StatCard label="Total Tasks" value="21" delta="+12%" positive={true} icon={<CheckCircle2 size={16} color="#8B5CF6" />} accent="#8B5CF6" t={t} />
        <StatCard label="Completed" value="16" delta="+9%" positive={true} icon={<CheckCircle2 size={16} color="#22C55E" />} accent="#22C55E" t={t} />
        <StatCard label="In Progress" value="5" delta="+5%" positive={true} icon={<Clock size={16} color="#F59E0B" />} accent="#F59E0B" t={t} />
        <StatCard label="Pending" value="4" delta="+3%" positive={false} icon={<AlertCircle size={16} color="#EF4444" />} accent="#EF4444" t={t} />
        <StatCard label="Focus Time" value="4.2h" delta="+10%" positive={true} icon={<Flame size={16} color="#A855F7" />} accent="#A855F7" t={t} />
      </div>

      {/* Tasks + Weekly Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Today's Tasks */}
        <div style={{ ...card, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Today's Tasks</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'pending', 'done'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: 'none',
                    background: taskFilter === f ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : (isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)'),
                    color: taskFilter === f ? 'white' : t.textMuted,
                    fontWeight: taskFilter === f ? 600 : 400,
                    boxShadow: taskFilter === f ? '0 2px 8px rgba(139,92,246,0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <button style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: 20, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: t.textMuted }}>
                Pending (4)
              </button>
            </div>
          </div>

          {/* Task Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 110px 80px 80px 32px', gap: 8, padding: '0 0 8px', borderBottom: `1px solid ${t.borderSubtle}`, marginBottom: 4 }}>
            {['', 'Task', 'Category', 'Due Date', 'Priority', ''].map((h, i) => (
              <div key={i} style={{ fontSize: 11, color: t.textDim, fontWeight: 600, letterSpacing: '0.04em' }}>{h}</div>
            ))}
          </div>

          {filteredTasks.map((task, i) => {
            const done = completedIds.has(task.id);
            const pc = priorityConfig[task.priority];
            const cc = catColors[task.category] || '#8B5CF6';
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'grid', gridTemplateColumns: '24px 1fr 110px 80px 80px 32px',
                  gap: 8, alignItems: 'center', padding: '10px 0',
                  borderBottom: `1px solid ${t.borderSubtle}`,
                }}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  style={{
                    width: 18, height: 18, borderRadius: 5, cursor: 'pointer',
                    border: done ? 'none' : `2px solid ${t.border}`,
                    background: done ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all 0.2s',
                  }}
                >
                  {done && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
                </button>
                <div style={{ fontSize: 14, color: done ? t.textDim : t.text, textDecoration: done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.title}
                </div>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: `${cc}18`, color: cc, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 105 }}>
                  {task.category}
                </span>
                <span style={{ fontSize: 11, color: t.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.due}</span>
                <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: pc.bg, color: pc.color, fontWeight: 600, textTransform: 'capitalize', display: 'inline-block' }}>
                  {task.priority}
                </span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, display: 'flex', alignItems: 'center' }}>
                  <MoreHorizontal size={14} />
                </button>
              </motion.div>
            );
          })}

          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
            background: 'none', border: `1px dashed ${t.border}`, borderRadius: 8,
            padding: '8px 12px', cursor: 'pointer', color: t.textMuted, fontSize: 13, width: '100%',
          }}>
            <Plus size={14} /> Add new task
          </button>
        </div>

        {/* Weekly Progress */}
        <div style={{ ...card, padding: '22px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Weekly Progress</div>
            <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: 6 }}>+23%</span>
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Thu Week</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData} barSize={20} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} vertical={false} />
              <XAxis dataKey="day" stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} />
              <YAxis stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} width={24} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="tasks" radius={[6, 6, 0, 0]}>
                {weeklyData.map((_, i) => (
                  <Cell key={i} fill={i === 5 ? '#A855F7' : (isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.2)')} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categoryData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: t.textMuted, flex: 1 }}>{c.name}</span>
                <div style={{ flex: 2, height: 4, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.value}%`, background: c.color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 12, color: t.textMuted, minWidth: 28, textAlign: 'right' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: 20 }}>
        {/* Productivity Overview */}
        <div style={{ ...card, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Productivity Overview</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['This Week', 'This Month'].map((opt, i) => (
                <button key={opt} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', border: 'none', background: i === 0 ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent', color: i === 0 ? 'white' : t.textMuted }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={productivityData}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={isDark ? 0.35 : 0.25} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} vertical={false} />
              <XAxis dataKey="time" stroke={t.textDim} tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} />
              <YAxis stroke={t.textDim} tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} width={24} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} fill="url(#prodGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Task Category Donut */}
        <div style={{ ...card, padding: '22px 20px' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4 }}>Task Category</div>
          <div style={{ position: 'relative' }}>
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {categoryData.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Work</div>
              <div style={{ fontSize: 10, color: t.textDim }}>Top</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
            {categoryData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color }} />
                <span style={{ fontSize: 11, color: t.textMuted, flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 11, color: t.textMuted }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...card, padding: '18px 20px', flex: 1 }}>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 6 }}>Completion Rate</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: t.text }}>67%</div>
            <div style={{ fontSize: 11, color: '#22C55E' }}>↑ +5% this week</div>
            <div style={{ height: 4, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', marginTop: 10 }}>
              <div style={{ height: '100%', borderRadius: 2, width: '67%', background: 'linear-gradient(90deg,#8B5CF6,#A855F7)' }} />
            </div>
          </div>
          <div style={{ ...card, padding: '18px 20px', flex: 1 }}>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 6 }}>Productivity Score</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: t.text }}>92</div>
              <div style={{ fontSize: 14, color: t.textDim }}>/100</div>
            </div>
            <div style={{ fontSize: 11, color: '#22C55E' }}>🔥 Personal best!</div>
            <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
              {[8, 6, 9, 7, 10, 9, 8].map((v, i) => (
                <div key={i} style={{ flex: 1, height: 24, borderRadius: 3, background: i === 4 ? 'linear-gradient(180deg,#A855F7,#8B5CF6)' : (isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.12)'), opacity: 0.4 + v / 20 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
