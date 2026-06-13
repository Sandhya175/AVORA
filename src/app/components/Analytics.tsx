import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Award, Flame, Target, Zap } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useTheme, getTheme } from './ThemeContext';

const weeklyTasks = [
  { day: 'Mon', completed: 4, added: 6, focus: 2.1 },
  { day: 'Tue', completed: 7, added: 5, focus: 3.5 },
  { day: 'Wed', completed: 5, added: 8, focus: 2.8 },
  { day: 'Thu', completed: 9, added: 7, focus: 4.2 },
  { day: 'Fri', completed: 11, added: 9, focus: 5.1 },
  { day: 'Sat', completed: 8, added: 4, focus: 3.9 },
  { day: 'Sun', completed: 6, added: 3, focus: 2.6 },
];

const monthlyData = [
  { month: 'Jan', score: 72 }, { month: 'Feb', score: 68 }, { month: 'Mar', score: 78 },
  { month: 'Apr', score: 82 }, { month: 'May', score: 75 }, { month: 'Jun', score: 92 },
];

const hourlyData = [
  { hour: '6', score: 30 }, { hour: '7', score: 45 }, { hour: '8', score: 72 },
  { hour: '9', score: 88 }, { hour: '10', score: 94 }, { hour: '11', score: 86 },
  { hour: '12', score: 65 }, { hour: '13', score: 58 }, { hour: '14', score: 70 },
  { hour: '15', score: 82 }, { hour: '16', score: 78 }, { hour: '17', score: 60 },
  { hour: '18', score: 48 }, { hour: '19', score: 38 }, { hour: '20', score: 25 },
];

const categoryBreakdown = [
  { name: 'Work', value: 45, hours: 18.5, color: '#8B5CF6' },
  { name: 'Development', value: 28, hours: 11.2, color: '#6366F1' },
  { name: 'Design', value: 15, hours: 6.0, color: '#A855F7' },
  { name: 'Personal', value: 12, hours: 4.8, color: '#EC4899' },
];

const streakData = [
  { day: 'M', active: true }, { day: 'T', active: true }, { day: 'W', active: true },
  { day: 'T', active: false }, { day: 'F', active: true }, { day: 'S', active: true }, { day: 'S', active: true },
];

interface MetricCardProps { label: string; value: string; sub: string; delta: string; positive: boolean; icon: React.ReactNode; t: ReturnType<typeof getTheme>; }

function MetricCard({ label, value, sub, delta, positive, icon, t }: MetricCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} style={{
      background: t.cardBg, backdropFilter: 'blur(20px)',
      border: `1px solid ${t.border}`, borderRadius: 16,
      padding: '20px', boxShadow: t.shadow,
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: t.textMuted }}>{label}</span>
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: t.text }}>{value}</div>
      <div style={{ fontSize: 12, color: t.textDim }}>{sub}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {positive ? <TrendingUp size={12} color="#22C55E" /> : <TrendingDown size={12} color="#EF4444" />}
        <span style={{ fontSize: 12, color: positive ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{delta}</span>
        <span style={{ fontSize: 12, color: t.textDim }}>vs last period</span>
      </div>
    </motion.div>
  );
}

export function Analytics() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const [range, setRange] = useState<'week' | 'month' | 'quarter'>('week');

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
      {/* Range toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 14, color: t.textMuted }}>Insights for your productivity trends</div>
        <div style={{ display: 'flex', gap: 6, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: 4 }}>
          {(['week', 'month', 'quarter'] as const).map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: '6px 16px', borderRadius: 9, fontSize: 12, cursor: 'pointer', border: 'none',
              background: range === r ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
              color: range === r ? 'white' : t.textMuted, fontWeight: range === r ? 600 : 400, textTransform: 'capitalize',
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <MetricCard label="Productivity Score" value="92/100" sub="This week's average" delta="+8 pts" positive={true} icon={<Award size={18} color="#F59E0B" />} t={t} />
        <MetricCard label="Tasks Completed" value="50" sub="21 tasks this week" delta="+32%" positive={true} icon={<Target size={18} color="#22C55E" />} t={t} />
        <MetricCard label="Focus Hours" value="21.2h" sub="Avg 3h/day" delta="+18%" positive={true} icon={<Flame size={18} color="#A855F7" />} t={t} />
        <MetricCard label="Completion Rate" value="76%" sub="Goal: 80%" delta="-4%" positive={false} icon={<Zap size={18} color="#6366F1" />} t={t} />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Weekly Tasks Chart */}
        <div style={{ ...card, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
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
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyTasks} barSize={16} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} vertical={false} />
              <XAxis dataKey="day" stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} />
              <YAxis stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} width={24} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="completed" fill="#8B5CF6" radius={[5, 5, 0, 0]} />
              <Bar dataKey="added" fill="#6366F1" radius={[5, 5, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Score */}
        <div style={{ ...card, padding: '22px 20px' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>Monthly Score</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>Productivity trend over 6 months</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} vertical={false} />
              <XAxis dataKey="month" stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} />
              <YAxis stroke={t.textDim} tick={{ fontSize: 11, fill: t.textDim }} axisLine={false} tickLine={false} width={28} domain={[60, 100]} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#A855F7' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Peak Hours */}
        <div style={{ ...card, padding: '22px 20px' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>Peak Productivity Hours</div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16 }}>When you're most focused</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={isDark ? 0.4 : 0.25} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke={t.textDim} tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} interval={2} />
              <YAxis stroke={t.textDim} tick={{ fontSize: 10, fill: t.textDim }} axisLine={false} tickLine={false} width={24} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} fill="url(#hourGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 8, fontSize: 12, color: t.textMuted }}>
            Peak: <span style={{ color: t.primary, fontWeight: 600 }}>9–11 AM</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div style={{ ...card, padding: '22px 20px' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 16 }}>Time by Category</div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={38} outerRadius={55} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                {categoryBreakdown.map((c, i) => <Cell key={i} fill={c.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 6 }}>
            {categoryBreakdown.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                <span style={{ fontSize: 12, color: t.textMuted, flex: 1 }}>{c.name}</span>
                <span style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{c.hours}h</span>
                <span style={{ fontSize: 11, color: t.textDim }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak & Achievements */}
        <div style={{ ...card, padding: '22px 20px' }}>
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

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: '🔥 Current Streak', value: '6 days' },
              { label: '🏆 Best Streak', value: '18 days' },
              { label: '⚡ Total Focus Sessions', value: '142' },
              { label: '🎯 Goals Completed', value: '8/10' },
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
