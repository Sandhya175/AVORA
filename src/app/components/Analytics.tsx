import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Award, Flame, Target, Zap, AlertCircle } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useTheme, getTheme } from './ThemeContext';
import { useIsMobile, useIsTablet } from './ui/use-mobile';
import { Task } from './TaskManagement';

interface MetricCardProps {
  label: string;
  value: string;
  sub: string;
  delta: string;
  positive: boolean;
  icon: React.ReactNode;
  t: ReturnType<typeof getTheme>;
}

function MetricCard({ label, value, sub, delta, positive, icon, t }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      style={{
        background: t.cardBg, backdropFilter: 'blur(20px)',
        border: `1px solid ${t.border}`, borderRadius: 16,
        padding: '20px', boxShadow: t.shadow,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: t.textMuted }}>{label}</span>
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: t.text }}>{value}</div>
      <div style={{ fontSize: 12, color: t.textDim }}>{sub}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {positive ? <TrendingUp size={12} color="#10B981" /> : <TrendingDown size={12} color="#EF4444" />}
        <span style={{ fontSize: 12, color: positive ? '#10B981' : '#EF4444', fontWeight: 600 }}>{delta}</span>
        <span style={{ fontSize: 12, color: t.textDim }}>vs last period</span>
      </div>
    </motion.div>
  );
}

const catColors: Record<string, string> = {
  Work: '#8B5CF6',
  Personal: '#EC4899',
  Study: '#6366F1',
  Health: '#10B981',
  Finance: '#F59E0B',
  Shopping: '#06B6D4',
};

export function Analytics() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [range, setRange] = useState<'week' | 'month' | 'quarter'>('week');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusHours, setFocusHours] = useState(2.4);

  useEffect(() => {
    const loadData = () => {
      const savedTasks = localStorage.getItem('avora_tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      
      const savedSeconds = localStorage.getItem('avora_focus_seconds');
      if (savedSeconds) {
        setFocusHours(Number((Number(savedSeconds) / 3600).toFixed(1)));
      } else {
        setFocusHours(2.4);
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    window.addEventListener('tasks_updated', loadData);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('tasks_updated', loadData);
    };
  }, []);

  // Calculations
  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  // Category distribution
  const catCounts: Record<string, number> = {};
  tasks.forEach(task => {
    catCounts[task.category] = (catCounts[task.category] || 0) + 1;
  });
  const categoryData = Object.keys(catCounts).map(cat => ({
    name: cat,
    value: Math.round((catCounts[cat] / (total || 1)) * 100),
    hours: Number((catCounts[cat] * 1.5).toFixed(1)), // mock hours derived from task count
    color: catColors[cat] || '#8B5CF6'
  }));

  const displayCategories = categoryData.length > 0 ? categoryData : [
    { name: 'Work', value: 45, hours: 12.0, color: '#8B5CF6' },
    { name: 'Personal', value: 25, hours: 6.0, color: '#EC4899' },
    { name: 'Study', value: 30, hours: 8.0, color: '#6366F1' },
  ];

  // Completion vs Added per day
  const weeklyTasks = [
    { day: 'Mon', completed: Math.max(1, completed), added: 2 },
    { day: 'Tue', completed: Math.max(0, pending), added: 3 },
    { day: 'Wed', completed: Math.max(2, inProgress), added: 4 },
    { day: 'Thu', completed: Math.max(1, completed), added: 2 },
    { day: 'Fri', completed: Math.max(3, completed), added: 5 },
    { day: 'Sat', completed: 0, added: 1 },
    { day: 'Sun', completed: 0, added: 1 },
  ];

  // Productivity Score logic
  const productivityScore = Math.min(100, Math.max(40, completionRate + 15));

  // Streaks
  const currentStreak = completed > 0 ? Math.min(7, Math.max(1, completed * 2 - 1)) : 0;
  const bestStreak = Math.max(currentStreak, 14);

  const monthlyData = [
    { month: 'Jan', score: 72 }, { month: 'Feb', score: 68 }, { month: 'Mar', score: 78 },
    { month: 'Apr', score: 82 }, { month: 'May', score: 75 }, { month: 'Jun', score: productivityScore },
  ];

  const hourlyData = [
    { hour: '6', score: 30 }, { hour: '7', score: 45 }, { hour: '8', score: 72 },
    { hour: '9', score: 88 }, { hour: '10', score: 94 }, { hour: '11', score: 86 },
    { hour: '12', score: 65 }, { hour: '13', score: 58 }, { hour: '14', score: 70 },
    { hour: '15', score: 82 }, { hour: '16', score: 78 }, { hour: '17', score: 60 },
    { hour: '18', score: 48 }, { hour: '19', score: 38 }, { hour: '20', score: 25 },
  ];

  const streakData = [
    { day: 'M', active: completed > 0 },
    { day: 'T', active: completed > 1 },
    { day: 'W', active: completed > 2 },
    { day: 'T', active: completed > 3 },
    { day: 'F', active: completed > 4 },
    { day: 'S', active: completed > 5 },
    { day: 'S', active: completed > 6 },
  ];

  const card: React.CSSProperties = {
    background: t.cardBg, backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.shadow,
  };

  const tooltipStyle = {
    contentStyle: { background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 10, color: t.text, fontSize: 12 },
    labelStyle: { color: t.textMuted },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      
      {/* Header filter toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
        <div style={{ fontSize: 14, color: t.textMuted }}>Insights for your productivity trends</div>
        <div style={{ display: 'flex', gap: 6, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: 4 }}>
          {(['week', 'month', 'quarter'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '6px 16px', borderRadius: 9, fontSize: 12, cursor: 'pointer', border: 'none',
                background: range === r ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
                color: range === r ? 'white' : t.textMuted, fontWeight: range === r ? 600 : 400, textTransform: 'capitalize',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16 }}>
        <MetricCard label="Productivity Score" value={`${productivityScore}/100`} sub="Calculated from tasks" delta="+8 pts" positive={true} icon={<Award size={18} color="#F59E0B" />} t={t} />
        <MetricCard label="Tasks Completed" value={String(completed)} sub={`${completed} of ${total} total`} delta="+32%" positive={true} icon={<Target size={18} color="#10B981" />} t={t} />
        <MetricCard label="Focus Hours" value={`${focusHours}h`} sub="Accumulated Focus" delta="+18%" positive={true} icon={<Flame size={18} color="#A855F7" />} t={t} />
        <div style={{ gridColumn: isMobile ? 'span 2' : 'auto' }}>
          <MetricCard label="Completion Rate" value={`${completionRate}%`} sub="Target: 80% daily" delta={`${completionRate - 76}%`} positive={completionRate >= 76} icon={<Zap size={18} color="#6366F1" />} t={t} />
        </div>
      </div>

      {/* Row 1: Weekly tasks & monthly score */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '2fr 1fr', gap: 20 }}>
        {/* Weekly Tasks Chart */}
        <div style={{ ...card, padding: '22px 24px', minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexDirection: isMobile ? 'column' : 'row', gap: 10 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>Tasks Overview</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>Completed vs Added this week</div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {[{ color: '#8B5CF6', label: 'Completed' }, { color: '#6366F1', label: 'Added' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                  <span style={{ fontSize: 11, color: t.textMuted }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTasks} barSize={16} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="day" stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} />
                <YAxis stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} width={20} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="completed" fill="#8B5CF6" radius={[5, 5, 0, 0]} />
                <Bar dataKey="added" fill="#6366F1" radius={[5, 5, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Score */}
        <div style={{ ...card, padding: '22px 20px', minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>Monthly Score</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Productivity trend over 6 months</div>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="month" stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} />
                <YAxis stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} width={24} domain={[50, 100]} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#A855F7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Peak hours, categories, streaks */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr 1fr', gap: 20 }}>
        
        {/* Peak Hours */}
        <div style={{ ...card, padding: '22px 20px', minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>Peak Productivity Hours</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16 }}>When you're most focused</div>
          <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={isDark ? 0.4 : 0.25} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke={t.textDim} tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} interval={2} />
                <YAxis stroke={t.textDim} tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} width={20} />
                <Tooltip {...tooltipStyle} />
                <Area type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} fill="url(#hourGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: t.textMuted }}>
            Peak Focus: <span style={{ color: t.primary, fontWeight: 600 }}>9–11 AM</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={{ ...card, padding: '22px 20px', minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 16 }}>Time by Category</div>
          <div style={{ width: '100%', height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={displayCategories} cx="50%" cy="50%" innerRadius={38} outerRadius={55} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {displayCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 6 }}>
            {displayCategories.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: t.textMuted, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                <span style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{c.hours}h</span>
                <span style={{ fontSize: 11, color: t.textDim }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak & Achievements */}
        <div style={{ ...card, padding: '22px 20px', minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 16 }}>Activity & Streaks</div>

          {/* Weekly streak dots */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>This week</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {streakData.map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    width: '100%', aspectRatio: '1', borderRadius: 6,
                    background: s.active ? 'linear-gradient(135deg,#8B5CF6,#A855F7)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                    boxShadow: s.active ? '0 0 8px rgba(139,92,246,0.4)' : 'none', marginBottom: 4,
                  }} />
                  <span style={{ fontSize: 9, color: t.textDim }}>{s.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: '🔥 Current Streak', value: `${currentStreak} days` },
              { label: '🏆 Best Streak', value: `${bestStreak} days` },
              { label: '⚡ Completed Tasks', value: String(completed) },
              { label: '🎯 Target Completion', value: `${completionRate}%` },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${t.borderSubtle}` }}>
                <span style={{ fontSize: 12, color: t.textMuted }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
