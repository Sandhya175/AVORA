import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  CheckCircle2, Clock, AlertCircle, TrendingUp, Flame,
  MoreHorizontal, ChevronRight, Plus, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useTheme, getTheme } from './ThemeContext';
import { useIsMobile, useIsTablet } from '../hooks/use-mobile';
import { useTaskContext } from '../context/TaskContext';

interface StatCardProps {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: React.ReactNode;
  accent: string;
  t: ReturnType<typeof getTheme>;
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
        transition: 'all 0.2s',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 12, color: t.textMuted, letterSpacing: '0.02em' }}>{label}</div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: t.text, lineHeight: 1 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
        <ArrowUpRight size={12} color={positive ? '#10B981' : '#EF4444'} style={{ transform: positive ? 'none' : 'rotate(90deg)', flexShrink: 0 }} />
        <span style={{ color: positive ? '#10B981' : '#EF4444', fontWeight: 600 }}>{delta}</span>
        <span style={{ color: t.textDim }}>vs last week</span>
      </div>
    </motion.div>
  );
}

const priorityConfig: Record<string, { color: string; bg: string }> = {
  high: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  urgent: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  low: { color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
};

const catColors: Record<string, string> = {
  Work: '#8B5CF6', Personal: '#EC4899', Study: '#6366F1', Health: '#10B981', Finance: '#F59E0B', Shopping: '#06B6D4'
};

export function Dashboard() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const navigate = useNavigate();
  const { tasks, toggleDone } = useTaskContext();

  const [focusTime, setFocusTime] = useState(() => {
    const savedFocusSeconds = localStorage.getItem('avora_focus_seconds');
    if (savedFocusSeconds) return (Number(savedFocusSeconds) / 3600).toFixed(1) + 'h';
    return '2.4h';
  });
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'done'>('all');

  // Filter tasks for dashboard (shows maximum 5 tasks)
  const dashboardTasks = tasks.filter(task => {
    if (taskFilter === 'pending') return !task.done;
    if (taskFilter === 'done') return task.done;
    return true;
  }).slice(0, 5);

  const completed = tasks.filter(t => t.done).length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Chart Data Calculations
  // Category Breakdown
  const categoryMap: Record<string, number> = {};
  tasks.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
  });
  const categoryData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: Math.round((categoryMap[cat] / (total || 1)) * 100),
    color: catColors[cat] || '#8B5CF6'
  })).slice(0, 4);

  // If no category data, provide defaults
  const displayCategoryData = categoryData.length > 0 ? categoryData : [
    { name: 'Work', value: 50, color: '#8B5CF6' },
    { name: 'Personal', value: 30, color: '#EC4899' },
    { name: 'Study', value: 20, color: '#6366F1' },
  ];

  // Weekly Progress (dynamic mockup based on task counts)
  const weeklyData = [
    { day: 'M', tasks: Math.max(1, completed), focus: 2.1 },
    { day: 'T', tasks: Math.max(2, pending), focus: 3.5 },
    { day: 'W', tasks: Math.max(3, inProgress), focus: 2.8 },
    { day: 'T', tasks: Math.max(1, total - completed), focus: 4.2 },
    { day: 'F', tasks: Math.max(completed, 2), focus: 3.9 },
    { day: 'S', tasks: 0, focus: 0 },
    { day: 'S', tasks: 0, focus: 0 },
  ];

  // Productivity Overview (mock line graph)
  const productivityData = [
    { time: '6am', score: 35 }, { time: '8am', score: 62 }, { time: '10am', score: 88 },
    { time: '12pm', score: 72 }, { time: '2pm', score: 58 }, { time: '4pm', score: 81 },
    { time: '6pm', score: 55 }, { time: '8pm', score: 40 },
  ];

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Stats Row - Grid for responsiveness */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <StatCard label="Total Tasks" value={String(total)} delta={`+${total}`} positive={true} icon={<CheckCircle2 size={16} color="#8B5CF6" />} accent="#8B5CF6" t={t} />
        <StatCard label="Completed" value={String(completed)} delta={`+${completed}`} positive={true} icon={<CheckCircle2 size={16} color="#10B981" />} accent="#10B981" t={t} />
        <StatCard label="In Progress" value={String(inProgress)} delta={`+${inProgress}`} positive={true} icon={<Clock size={16} color="#3B82F6" />} accent="#3B82F6" t={t} />
        <StatCard label="Pending" value={String(pending)} delta={`+${pending}`} positive={false} icon={<AlertCircle size={16} color="#EC4899" />} accent="#EC4899" t={t} />
        <div style={{ gridColumn: isMobile ? 'span 2' : 'auto' }}>
          <StatCard label="Focus Time" value={focusTime} delta="+12%" positive={true} icon={<Flame size={16} color="#A855F7" />} accent="#A855F7" t={t} />
        </div>
      </div>

      {/* Main Grid: Tasks and Weekly Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 340px', gap: 20 }}>
        
        {/* Today's Tasks */}
        <div style={{ ...card, padding: isMobile ? '16px' : '22px 24px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexDirection: isMobile ? 'column' : 'row', gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Task Workspace</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(['all', 'pending', 'done'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 11, cursor: 'pointer', border: 'none',
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
            </div>
          </div>

          {/* Task Table Container (Scrollable on Mobile) */}
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <div style={{ minWidth: isMobile ? 480 : 'auto' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 100px 90px 70px', gap: 8, padding: '0 0 8px', borderBottom: `1px solid ${t.borderSubtle}`, marginBottom: 4 }}>
                <div />
                <div style={{ fontSize: 11, color: t.textDim, fontWeight: 600 }}>Task</div>
                <div style={{ fontSize: 11, color: t.textDim, fontWeight: 600 }}>Category</div>
                <div style={{ fontSize: 11, color: t.textDim, fontWeight: 600 }}>Due Date</div>
                <div style={{ fontSize: 11, color: t.textDim, fontWeight: 600 }}>Priority</div>
              </div>

              {dashboardTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: t.textMuted }}>No tasks found in this view.</div>
              ) : (
                dashboardTasks.map((task, i) => {
                  const done = task.done;
                  const pc = priorityConfig[task.priority] || priorityConfig.medium;
                  const cc = catColors[task.category] || '#8B5CF6';
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        display: 'grid', gridTemplateColumns: '24px 1fr 100px 90px 70px',
                        gap: 8, alignItems: 'center', padding: '10px 0',
                        borderBottom: `1px solid ${t.borderSubtle}`,
                      }}
                    >
                      <button
                        onClick={() => toggleDone(task.id)}
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
                      <div style={{ fontSize: 13, color: done ? t.textDim : t.text, textDecoration: done ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.title}
                      </div>
                      <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: `${cc}18`, color: cc, fontWeight: 700, textAlign: 'center', display: 'inline-block', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.category}
                      </span>
                      <span style={{ fontSize: 11, color: t.textMuted, whiteSpace: 'nowrap' }}>{task.due}</span>
                      <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: pc.bg, color: pc.color, fontWeight: 700, textTransform: 'capitalize', textAlign: 'center', display: 'inline-block' }}>
                        {task.priority}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/app/tasks?add=true')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, marginTop: 16,
              background: 'none', border: `1px dashed ${t.border}`, borderRadius: 10,
              padding: '10px', cursor: 'pointer', color: t.textMuted, fontSize: 13, width: '100%',
              justifyContent: 'center', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = t.primary}
            onMouseLeave={e => e.currentTarget.style.borderColor = t.border}
          >
            <Plus size={14} /> Add new task
          </button>
        </div>

        {/* Weekly Progress */}
        <div style={{ ...card, padding: '22px 20px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Weekly Progress</div>
            <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600, background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: 6 }}>+23%</span>
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Completion metrics</div>
          
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="day" stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} />
                <YAxis stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} width={18} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((_, i) => (
                    <Cell key={i} fill={i === 4 ? '#A855F7' : (isDark ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.25)')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {displayCategoryData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: t.textMuted, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                <div style={{ flex: 2, height: 4, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.value}%`, background: c.color, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 11, color: t.textMuted, minWidth: 28, textAlign: 'right' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Grid for responsiveness */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 240px 240px', gap: 20 }}>
        
        {/* Productivity Overview */}
        <div style={{ ...card, padding: '22px 24px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexDirection: isMobile ? 'column' : 'row', gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Productivity Overview</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['This Week', 'This Month'].map((opt, i) => (
                <button key={opt} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', border: 'none', background: i === 0 ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent', color: i === 0 ? 'white' : t.textMuted, fontWeight: i === 0 ? 600 : 400 }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: '100%', height: 130 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={isDark ? 0.35 : 0.25} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="time" stroke={t.textDim} tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} />
                <YAxis stroke={t.textDim} tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} width={18} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} fill="url(#prodGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Category Donut */}
        <div style={{ ...card, padding: '22px 20px', minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 4 }}>Task Breakdown</div>
          <div style={{ position: 'relative', width: '100%', height: 110 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={displayCategoryData} cx="50%" cy="50%" innerRadius={32} outerRadius={50} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {displayCategoryData.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>AVORA</div>
              <div style={{ fontSize: 9, color: t.textDim }}>Tasks</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
            {displayCategoryData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: t.textMuted, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                <span style={{ fontSize: 11, color: t.textMuted }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...card, padding: '18px 20px', flex: 1 }}>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 6 }}>Completion Rate</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: t.text }}>{completionRate}%</div>
            <div style={{ fontSize: 11, color: '#10B981', fontWeight: 500 }}>↑ Dynamic rate</div>
            <div style={{ height: 4, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', marginTop: 10 }}>
              <div style={{ height: '100%', borderRadius: 2, width: `${completionRate}%`, background: 'linear-gradient(90deg,#8B5CF6,#A855F7)' }} />
            </div>
          </div>
          
          <div style={{ ...card, padding: '18px 20px', flex: 1 }}>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 6 }}>Daily Goal Progress</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: t.text }}>{completed}</div>
              <div style={{ fontSize: 14, color: t.textDim }}>/ {Math.max(completed, 5)}</div>
            </div>
            <div style={{ fontSize: 11, color: '#10B981', fontWeight: 500 }}>🔥 Keep the streak!</div>
            <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
              {[8, 6, 9, 7, 10, 9, 8].map((v, i) => (
                <div key={i} style={{ flex: 1, height: 16, borderRadius: 3, background: i === 4 ? 'linear-gradient(180deg,#A855F7,#8B5CF6)' : (isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.12)'), opacity: 0.4 + v / 20 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
