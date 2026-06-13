import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, CheckSquare, Calendar, BarChart2, Brain,
  MessageSquare, Settings, Search, Bell, Sun, Moon, Plus,
  Menu, X, PanelLeftClose, PanelLeft, PlusCircle, CheckCheck, Trash2
} from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';
import { AvoraLogo } from './AvoraLogo';
import { useTaskContext } from '../context/TaskContext';

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
  '/app': { title: 'Dashboard', sub: "Track your performance and progress" },
  '/app/tasks': { title: 'Task Management', sub: 'Organize your work efficiently' },
  '/app/calendar': { title: 'Calendar', sub: 'Plan your schedule' },
  '/app/analytics': { title: 'Analytics & Insights', sub: 'Track your performance trends' },
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

const avatarGradients = {
  purple: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
  blue: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
  indigo: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  pink: 'linear-gradient(135deg, #EC4899, #F43F5E)'
};

// ─── Relative time helper ─────────────────────────────────────────────────────
function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

const notifTypeEmoji: Record<string, string> = {
  created: '✅',
  completed: '🎉',
  deleted: '🗑',
  due_tomorrow: '⚠️',
  overdue: '🚨',
};

// ─────────────────────────────────────────────────────────────────────────────

export function Layout() {
  const { theme, setTheme, isDark } = useTheme();
  const t = getTheme(isDark);
  const location = useLocation();
  const navigate = useNavigate();
  const { tasks, notifications, unreadCount, markNotifRead, markAllRead, deleteNotif, clearAllNotifs } = useTaskContext();
  
  // Custom screen width detector
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusScore, setFocusScore] = useState(88);

  // Notification panel state
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Profile Drawer State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(() => localStorage.getItem('avora_profile_name') || 'Sandhya');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('avora_profile_email') || 'sandhya@avora.app');
  const [profileAvatar, setProfileAvatar] = useState(() => localStorage.getItem('avora_profile_avatar') || 'purple');
  const [profileStats, setProfileStats] = useState({ total: 0, completed: 0, focusTime: '0.0h', completionRate: 0 });

  const loadProfileStats = () => {
    const totalTasksCount = tasks.length;
    const completedTasksCount = tasks.filter((task) => task.done).length;

    const savedFocusSeconds = localStorage.getItem('avora_focus_seconds');
    let focusHrs = '0.0h';
    if (savedFocusSeconds) {
      focusHrs = (Number(savedFocusSeconds) / 3600).toFixed(1) + 'h';
    } else {
      focusHrs = '2.4h';
    }

    const completionRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

    setProfileStats({
      total: totalTasksCount,
      completed: completedTasksCount,
      focusTime: focusHrs,
      completionRate
    });
  };

  useEffect(() => {
    if (isProfileOpen) {
      loadProfileStats();
    }
  }, [isProfileOpen, tasks]);

  const handleProfileNameChange = (val: string) => {
    setProfileName(val);
    localStorage.setItem('avora_profile_name', val);
  };
  const handleProfileEmailChange = (val: string) => {
    setProfileEmail(val);
    localStorage.setItem('avora_profile_email', val);
  };
  const handleProfileAvatarChange = (val: string) => {
    setProfileAvatar(val);
    localStorage.setItem('avora_profile_avatar', val);
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync search input with URL query param if user edits from headers
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
  }, [location.search]);

  // Compute focus score from context tasks
  useEffect(() => {
    if (tasks.length > 0) {
      const done = tasks.filter((task) => task.done).length;
      setFocusScore(Math.round((done / tasks.length) * 100));
    }
  }, [tasks]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  // Adjust sidebar state when resizing between states
  useEffect(() => {
    if (isTablet) {
      setIsSidebarCollapsed(true);
    } else if (isDesktop) {
      setIsSidebarCollapsed(false);
    }
  }, [isTablet, isDesktop]);

  const activeSidebarWidth = isMobile ? 0 : (isSidebarCollapsed ? 64 : 220);

  const sidebarStyle: React.CSSProperties = {
    width: isSidebarCollapsed ? 64 : 220,
    minWidth: isSidebarCollapsed ? 64 : 220,
    height: '100vh',
    background: t.sidebarBg,
    borderRight: `1px solid ${t.border}`,
    display: isMobile ? 'none' : 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 40,
    boxShadow: isDark ? '4px 0 24px rgba(0,0,0,0.4)' : '4px 0 24px rgba(139,92,246,0.06)',
    transition: 'all 0.3s ease',
  };

  const mobileSidebarStyle: React.CSSProperties = {
    width: 240,
    height: '100vh',
    background: t.sidebarBg,
    borderRight: `1px solid ${t.border}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: isMobileDrawerOpen ? 0 : -250,
    top: 0,
    zIndex: 51,
    boxShadow: '8px 0 32px rgba(0,0,0,0.5)',
    transition: 'left 0.3s ease',
  };

  const glassCard: React.CSSProperties = {
    background: isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(139, 92, 246, 0.05)',
    border: `1px solid ${t.border}`,
    borderRadius: 14,
    backdropFilter: 'blur(12px)',
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    navigate(`/app/tasks?q=${encodeURIComponent(query)}`);
  };

  const renderNavLinks = (onClickItem?: () => void) => {
    return navItems.map(item => {
      const isActive = location.pathname === item.path || (item.path !== '/app' && location.pathname.startsWith(item.path));
      return (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/app'}
          onClick={onClickItem}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarCollapsed && !isMobile ? 'center' : 'flex-start',
            gap: isSidebarCollapsed && !isMobile ? 0 : 10,
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
          <item.icon size={17} style={{ flexShrink: 0 }} />
          {(!isSidebarCollapsed || isMobile) && <span>{item.label}</span>}
        </NavLink>
      );
    });
  };

  const pageInfo = pageTitles[location.pathname] || { title: 'AVORA', sub: 'Productivity Platform' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: t.bg }}>
      
      {/* Mobile Drawer Overlay */}
      {isMobile && isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50,
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <aside style={mobileSidebarStyle}>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${t.borderSubtle}` }}>
            <div style={{ cursor: 'pointer' }} onClick={() => { navigate('/'); setIsMobileDrawerOpen(false); }}>
              <AvoraLogo size="default" />
            </div>
            <button onClick={() => setIsMobileDrawerOpen(false)} style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          <nav style={{ padding: '14px 12px', flex: 1, overflowY: 'auto' }}>
            {renderNavLinks(() => setIsMobileDrawerOpen(false))}
          </nav>
          <div style={{ padding: '0 12px 20px' }}>
            <div style={{ ...glassCard, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>Task Score</div>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress value={focusScore} size={64} isDark={isDark} />
                <div style={{ position: 'absolute', fontSize: 15, fontWeight: 700, color: t.primary }}>{focusScore}%</div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Desktop/Tablet Sidebar */}
      {!isMobile && (
        <aside style={sidebarStyle}>
          {/* Logo */}
          <div style={{ padding: isSidebarCollapsed ? '20px 0' : '22px 20px 18px', borderBottom: `1px solid ${t.borderSubtle}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isSidebarCollapsed ? (
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', boxShadow: '0 0 10px rgba(139,92,246,0.6)' }} />
            ) : (
              <>
                <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                  <AvoraLogo size="default" />
                </div>
                <div style={{ marginTop: 4, fontSize: 10, color: t.textDim, letterSpacing: '0.06em' }}>
                  Productivity Mode <span style={{ color: t.primary }}>PRO</span>
                </div>
              </>
            )}
          </div>

          {/* Nav Links */}
          <nav style={{ padding: '14px 12px', flex: 1, overflowY: 'auto' }}>
            {renderNavLinks()}
          </nav>

          {/* Collapse sidebar button */}
          {!isTablet && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '10px 12px', padding: '10px', borderRadius: 10,
                border: 'none', background: t.inputBg, color: t.textMuted, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isSidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
            </button>
          )}

          {/* Focus Score Widget */}
          {!isSidebarCollapsed && (
            <div style={{ padding: '0 12px 20px' }}>
              <div style={{ ...glassCard, padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8, letterSpacing: '0.04em' }}>Task Score</div>
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress value={focusScore} size={64} isDark={isDark} />
                  <div style={{ position: 'absolute', fontSize: 15, fontWeight: 700, color: t.primary }}>{focusScore}%</div>
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: t.textMuted }}>Keep it up 🔥</div>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* Main Container */}
      <div style={{
        marginLeft: activeSidebarWidth,
        flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
        overflowX: 'hidden'
      }}>
        {/* Top Header */}
        <header style={{
          height: 64,
          background: isDark ? 'rgba(5, 8, 22, 0.9)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${t.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '0 16px' : '0 24px',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 30,
          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          {/* Mobile hamburger menu toggle */}
          {isMobile && (
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              style={{ background: 'none', border: 'none', color: t.text, cursor: 'pointer', display: 'flex', marginRight: 4 }}
            >
              <Menu size={20} />
            </button>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 600, color: t.text, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pageInfo.title}</div>
            {!isMobile && <div style={{ fontSize: 12, color: t.textMuted }}>{pageInfo.sub}</div>}
          </div>

          {/* Search - Shrink / Hide on Mobile header to fit buttons */}
          {!isMobile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: t.inputBg, border: `1px solid ${t.border}`,
              borderRadius: 10, padding: '7px 14px', width: 220,
              backdropFilter: 'blur(10px)',
            }}>
              <Search size={14} color={t.textDim} />
              <input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search tasks..."
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: t.text, width: '100%' }}
              />
            </div>
          )}

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
            <button
              onClick={() => setIsNotifOpen(true)}
              style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', position: 'relative', transition: 'all 0.2s' }}
              title="Notifications"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: -5, right: -5,
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: '#EF4444', color: 'white',
                  fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 3px', lineHeight: 1,
                  border: `2px solid ${t.bg}`,
                  boxShadow: '0 0 6px rgba(239,68,68,0.5)',
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <div
              onClick={() => setIsProfileOpen(true)}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: avatarGradients[profileAvatar as keyof typeof avatarGradients] || avatarGradients.purple,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: `0 0 12px ${(profileAvatar === 'purple' || profileAvatar === 'indigo') ? 'rgba(139,92,246,0.4)' : profileAvatar === 'blue' ? 'rgba(6,182,212,0.4)' : 'rgba(236,72,153,0.4)'}`,
                flexShrink: 0,
                fontSize: 13,
                fontWeight: 700,
                color: 'white',
              }}
            >
              {profileName.charAt(0).toUpperCase()}
            </div>
            
            {/* Show Add Task in header for Desktop/Tablet */}
            {!isMobile && (
              <button
                onClick={() => navigate('/app/tasks?add=true')}
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
            )}
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: isMobile ? '16px' : '24px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button (FAB) for Mobile Add Task */}
      {isMobile && (
        <button
          onClick={() => navigate('/app/tasks?add=true')}
          style={{
            position: 'fixed', bottom: 20, right: 20,
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(139,92,246,0.6)', border: 'none', cursor: 'pointer',
            zIndex: 48, transition: 'all 0.2s',
          }}
        >
          <PlusCircle size={28} />
        </button>
      )}
      {/* ─── Notification Center Panel ─────────────────────────────────── */}
      <AnimatePresence>
        {isNotifOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100,
                backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)'
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', right: 0, top: 0, bottom: 0,
                width: isMobile ? '100%' : 380,
                background: t.cardBg,
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                borderLeft: `1px solid ${t.border}`,
                boxShadow: t.shadow,
                zIndex: 101,
                display: 'flex', flexDirection: 'column',
                color: t.text,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 16px', borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Bell size={17} color={t.primary} />
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: '#EF4444', color: 'white', borderRadius: 10, padding: '1px 7px' }}>{unreadCount}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {notifications.length > 0 && (
                    <>
                      <button
                        onClick={markAllRead}
                        title="Mark all read"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
                      >
                        <CheckCheck size={13} /> All read
                      </button>
                      <button
                        onClick={clearAllNotifs}
                        title="Clear all"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '4px 8px', borderRadius: 6 }}
                      >
                        <Trash2 size={13} /> Clear
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex' }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 24px', color: t.textDim }}>
                    <Bell size={32} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <div style={{ fontSize: 14, fontWeight: 600 }}>No notifications yet</div>
                    <div style={{ fontSize: 12, marginTop: 6 }}>Actions like creating, completing, or deadline alerts appear here.</div>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => markNotifRead(notif.id)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '12px 20px',
                        background: notif.read ? 'transparent' : (isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.05)'),
                        borderBottom: `1px solid ${t.borderSubtle}`,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>
                        {notifTypeEmoji[notif.type] || '🔔'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: notif.read ? t.textMuted : t.text, fontWeight: notif.read ? 400 : 600, lineHeight: 1.4 }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: 11, color: t.textDim, marginTop: 4 }}>
                          {relativeTime(notif.timestamp)}
                        </div>
                      </div>
                      {!notif.read && (
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#8B5CF6', flexShrink: 0, marginTop: 6, boxShadow: '0 0 6px rgba(139,92,246,0.6)' }} />
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, display: 'flex', flexShrink: 0, padding: 2, borderRadius: 4, transition: 'color 0.2s' }}
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Drawer Overlay & Content */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            {/* Drawer Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
                backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)'
              }}
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', right: 0, top: 0, bottom: 0,
                width: isMobile ? '100%' : 380,
                background: t.cardBg,
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                borderLeft: `1px solid ${t.border}`,
                boxShadow: t.shadow,
                zIndex: 101,
                display: 'flex', flexDirection: 'column',
                padding: '24px',
                color: t.text,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>User Profile</h3>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Profile Card & Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, overflowY: 'auto' }}>
                {/* Big Avatar Display */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '20px 0' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: avatarGradients[profileAvatar as keyof typeof avatarGradients] || avatarGradients.purple,
                    boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 800, color: 'white'
                  }}>
                    {profileName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{profileName}</div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginTop: -8 }}>{profileEmail}</div>
                </div>

                {/* Edit Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: t.textMuted }}>Display Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={e => handleProfileNameChange(e.target.value)}
                      placeholder="Enter name"
                      style={{
                        background: t.inputBg, border: `1px solid ${t.border}`,
                        borderRadius: 10, padding: '8px 12px', color: t.text, fontSize: 13,
                        outline: 'none', width: '100%'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: t.textMuted }}>Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={e => handleProfileEmailChange(e.target.value)}
                      placeholder="Enter email"
                      style={{
                        background: t.inputBg, border: `1px solid ${t.border}`,
                        borderRadius: 10, padding: '8px 12px', color: t.text, fontSize: 13,
                        outline: 'none', width: '100%'
                      }}
                    />
                  </div>
                </div>

                {/* Avatar Gradient Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: t.textMuted }}>Avatar Theme</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {Object.keys(avatarGradients).map(name => {
                      const active = profileAvatar === name;
                      return (
                        <button
                          key={name}
                          onClick={() => handleProfileAvatarChange(name)}
                          style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: avatarGradients[name as keyof typeof avatarGradients],
                            border: active ? `2px solid ${t.primary}` : '2px solid transparent',
                            boxShadow: active ? '0 0 10px rgba(139,92,246,0.6)' : 'none',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Theme Preference Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: t.textMuted }}>Theme Preference</label>
                  <div style={{ display: 'flex', gap: 6, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: 4 }}>
                    {(['dark', 'light', 'system'] as const).map(th => {
                      const active = theme === th;
                      return (
                        <button
                          key={th}
                          onClick={() => setTheme(th)}
                          style={{
                            flex: 1, padding: '6px 8px', borderRadius: 9, fontSize: 11, cursor: 'pointer', border: 'none',
                            background: active ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
                            color: active ? 'white' : t.textMuted, fontWeight: active ? 600 : 400, textTransform: 'capitalize',
                            transition: 'all 0.2s',
                          }}
                        >
                          {th}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Productivity Stats Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10, borderTop: `1px solid ${t.borderSubtle}`, paddingTop: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: t.text }}>Workspace Stats</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${t.borderSubtle}`, borderRadius: 12, padding: '10px 12px' }}>
                      <div style={{ fontSize: 9, color: t.textMuted }}>Total Tasks</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{profileStats.total}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${t.borderSubtle}`, borderRadius: 12, padding: '10px 12px' }}>
                      <div style={{ fontSize: 9, color: t.textMuted }}>Completed</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#10B981' }}>{profileStats.completed}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${t.borderSubtle}`, borderRadius: 12, padding: '10px 12px' }}>
                      <div style={{ fontSize: 9, color: t.textMuted }}>Focus Time</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#A855F7' }}>{profileStats.focusTime}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${t.borderSubtle}`, borderRadius: 12, padding: '10px 12px' }}>
                      <div style={{ fontSize: 9, color: t.textMuted }}>Completion Rate</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: t.primary }}>{profileStats.completionRate}%</div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div style={{ height: 4, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', width: '100%', overflow: 'hidden', marginTop: 4 }}>
                    <div style={{ height: '100%', width: `${profileStats.completionRate}%`, background: 'linear-gradient(90deg, #8B5CF6, #A855F7)', borderRadius: 2 }} />
                  </div>
                </div>
              </div>

              {/* Close footer */}
              <button
                onClick={() => setIsProfileOpen(false)}
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', border: 'none',
                  borderRadius: 10, padding: '12px', color: 'white', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.3)',
                  textAlign: 'center', marginTop: 24, width: '100%'
                }}
              >
                Close Profile
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
