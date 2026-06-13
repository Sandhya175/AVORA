import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, CheckSquare, Calendar, BarChart2, Brain,
  MessageSquare, Settings, Search, Bell, Sun, Moon, Plus,
  Target, Zap, ChevronRight, User,
} from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';
import { AvoraLogo } from './AvoraLogo';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
  { icon: CheckSquare, label: 'Tasks', path: '/app/tasks' },
  { icon: Calendar, label: 'Calendar', path: '/app/calendar' },
  { icon: BarChart2, label: 'Analytics', path: '/app/analytics' },
  { icon: Brain, label: 'Focus Mode', path: '/app/focus' },
  { icon: MessageSquare, label: 'AI Assistant', path: '/app/ai' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

const pageTitles: Record<string, { title: string; sub: string }> = {
  '/app': { title: 'Good Morning, Sandhya! 🌅', sub: "Let's make today productive" },
  '/app/tasks': { title: 'Task Management', sub: 'Organize your work efficiently' },
  '/app/calendar': { title: 'Calendar', sub: 'Plan your schedule' },
  '/app/analytics': { title: 'Analytics', sub: 'Track your performance' },
  '/app/focus': { title: 'Focus Mode', sub: 'Deep work, zero distractions' },
  '/app/ai': { title: 'AI Assistant', sub: 'Your smart productivity partner' },
  '/app/settings': { title: 'Settings', sub: 'Customize your experience' },
};

const CircularProgress = ({ value, size = 64, isDark }: { value: number; size?: number; isDark: boolean }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139,92,246,0.1)'} strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#fg)" strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export function Layout() {
  const { isDark, toggleTheme } = useTheme();
  const t = getTheme(isDark);
  const location = useLocation();
  const navigate = useNavigate();
  const pageInfo = pageTitles[location.pathname] || { title: 'AVORA', sub: 'Productivity Platform' };

  const sidebarStyle: React.CSSProperties = {
    width: 220,
    minWidth: 220,
    height: '100vh',
    background: t.sidebarBg,
    borderRight: `1px solid ${t.border}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 40,
    boxShadow: isDark ? '4px 0 24px rgba(0,0,0,0.4)' : '4px 0 24px rgba(139,92,246,0.06)',
    overflowY: 'auto',
  };

  const glassCard: React.CSSProperties = {
    background: isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.05)',
    border: `1px solid ${t.border}`,
    borderRadius: 14,
    backdropFilter: 'blur(12px)',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: t.bg }}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        {/* Logo */}
        <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${t.borderSubtle}` }}>
          <AvoraLogo size="default" />
          <div style={{ marginTop: 4, fontSize: 10, color: t.textDim, letterSpacing: '0.06em' }}>
            Productivity Mode <span style={{ color: t.primary }}>PRO</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '14px 12px', flex: 1 }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  marginBottom: 3,
                  textDecoration: 'none',
                  color: isActive ? '#FFFFFF' : t.textMuted,
                  background: isActive
                    ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                    : 'transparent',
                  boxShadow: isActive ? '0 4px 14px rgba(139, 92, 246, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.06)';
                    (e.currentTarget as HTMLElement).style.color = t.primary;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = t.textMuted;
                  }
                }}
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Focus Score Widget */}
        <div style={{ padding: '0 12px 20px' }}>
          <div style={{ ...glassCard, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8, letterSpacing: '0.04em' }}>Focus Score</div>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress value={88} size={64} isDark={isDark} />
              <div style={{ position: 'absolute', fontSize: 15, fontWeight: 700, color: t.primary }}>88%</div>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: t.textMuted }}>Keep it up 🔥</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Bar */}
        <header style={{
          height: 64,
          background: isDark ? 'rgba(5, 8, 22, 0.9)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${t.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text, lineHeight: 1.2 }}>{pageInfo.title}</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>{pageInfo.sub}</div>
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: t.inputBg, border: `1px solid ${t.border}`,
            borderRadius: 10, padding: '7px 14px', width: 220,
            backdropFilter: 'blur(10px)',
          }}>
            <Search size={14} color={t.textDim} />
            <input
              placeholder="Search tasks, projects..."
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: t.text, width: '100%' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={toggleTheme}
              style={{
                background: t.inputBg, border: `1px solid ${t.border}`,
                borderRadius: 8, padding: '7px 9px', cursor: 'pointer',
                color: t.textMuted, display: 'flex', alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Bell size={15} />
              <span style={{ position: 'absolute', top: 5, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
            </button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 12px rgba(139,92,246,0.4)' }}>
              <User size={15} color="white" />
            </div>
            <button
              onClick={() => navigate('/app/tasks')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                border: 'none', borderRadius: 9, padding: '7px 14px',
                color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={14} />
              Add Task
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
