import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  ArrowRight, CheckCircle2, Brain, BarChart2, Star, Shield, Target, Calendar,
  Moon, Sun, CheckSquare, Menu, X, ArrowUpRight, Lock, Monitor, Laptop
} from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';
import { AvoraLogo } from './AvoraLogo';
import { useIsMobile } from './ui/use-mobile';

const features = [
  { icon: CheckSquare, title: 'Smart Task Management', desc: 'Prioritize your daily checklist. Group tasks by category, set priorities, and track execution.' },
  { icon: Brain, title: 'Deep Focus Engine', desc: 'Pomodoro-based focus sessions with flexible configurations and custom break reminders.' },
  { icon: BarChart2, title: 'Productivity Analytics', desc: 'Visualize your performance with dynamic completion rates, weekly progress, and category distributions.' },
  { icon: Target, title: 'Goal Setting & Tracking', desc: 'Define daily and weekly task completion targets. Track progress and celebrate achievements.' },
  { icon: Calendar, title: 'Interactive Calendar', desc: 'Coordinate due dates, schedule priorities, and inspect upcoming task lists day by day.' },
  { icon: Shield, title: 'Privacy First', desc: 'All data is stored directly in your browser\'s local storage. Your workspace remains entirely private.' },
];

const pricingPlans = [
  {
    name: 'Starter', price: 0, desc: 'Perfect for individuals starting out',
    features: ['Unlimited tasks', 'LocalStorage persistence', 'Basic analytics charts', 'Standard Pomodoro timer'],
    cta: 'Get Started Free', highlight: false,
  },
  {
    name: 'Pro', price: 12, desc: 'For power users and professionals',
    features: ['Advanced productivity charts', 'Custom Pomodoro durations', 'AI Task Assistant simulator', 'Category breakdowns', 'Priority support'],
    cta: 'Launch Dashboard', highlight: true,
  },
  {
    name: 'Team', price: 29, desc: 'For collaborative teams',
    features: ['Everything in Pro', 'Unlimited workspaces', 'Admin control center', 'Data export & backup'],
    cta: 'Contact Sales', highlight: false,
  },
];

const steps = [
  { step: '01', title: 'Capture Tasks', desc: 'Add task details, categories, priorities, and deadlines in seconds.' },
  { step: '02', title: 'Focus & Execute', desc: 'Launch a Pomodoro session to block distractions and track focus duration.' },
  { step: '03', title: 'Analyze & Improve', desc: 'Review weekly completion rates and charts to optimize your daily routine.' },
];

const whyChooseAvora = [
  { icon: Lock, title: 'Offline-First & Local', desc: 'Your data belongs to you. No signups, no cloud sync, just instant local productivity.' },
  { icon: Laptop, title: 'Premium Glassmorphic UI', desc: 'A gorgeous dark-mode experience with glow effects, custom transitions, and modern aesthetics.' },
  { icon: Monitor, title: 'Rule-Based AI Assistant', desc: 'Generate task summaries and focus recommendations locally using smart parsing algorithms.' },
];

const miniTasks = [
  { label: 'Review project proposal', cat: 'Work', done: false },
  { label: 'Implement responsive design', cat: 'Dev', done: true },
  { label: 'Set up Pomodoro timer state', cat: 'Dev', done: false },
  { label: 'Plan weekly meals', cat: 'Personal', done: false },
];

const catColors: Record<string, string> = {
  Design: '#8B5CF6', Dev: '#6366F1', Work: '#A855F7', Personal: '#EC4899',
};

const weeklyData = [40, 65, 45, 80, 72, 90, 60];
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function DashboardMockup({ isDark }: { isDark: boolean }) {
  const t = getTheme(isDark);
  const isMobile = useIsMobile();
  const cardStyle: React.CSSProperties = {
    background: t.glass,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${t.border}`,
    borderRadius: 18,
    boxShadow: t.shadow,
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 440, margin: '0 auto' }}>
      {/* Main dashboard card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          ...cardStyle,
          padding: isMobile ? 16 : 20,
          boxShadow: `${t.shadow}, 0 0 60px rgba(139,92,246,0.2)`,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Good Morning, Sandhya! 🌅</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Let's make today productive</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {[
              { label: 'Tasks', value: '4' },
              { label: 'Done', value: '1' },
              { label: 'Pending', value: '3' },
              { label: 'Focus', value: '2.4h' },
            ].map(stat => (
              <div key={stat.label} style={{ flex: 1, background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)', borderRadius: 8, padding: '6px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>{stat.value}</div>
                <div style={{ fontSize: 9, color: t.textDim, marginTop: 1 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks + Goals */}
        <div style={{ display: 'flex', gap: 12, flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>Today's Tasks</div>
            {miniTasks.map((task, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, border: task.done ? 'none' : `1.5px solid ${t.border}`, background: task.done ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {task.done && <span style={{ color: 'white', fontSize: 8, fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1, fontSize: 10, color: task.done ? t.textDim : t.text, textDecoration: task.done ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.label}</div>
                <span style={{ fontSize: 8, padding: '2px 5px', borderRadius: 4, background: `${catColors[task.cat] || '#8B5CF6'}22`, color: catColors[task.cat] || '#8B5CF6', fontWeight: 600 }}>{task.cat}</span>
              </div>
            ))}
          </div>
          <div style={{ width: isMobile ? '100%' : 100, flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>Weekly Goal</div>
            {[
              { label: 'Tasks Completed', pct: 75 },
              { label: 'Focus Time', pct: 60 },
            ].map(g => (
              <div key={g.label} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 9, color: t.textMuted }}>{g.label}</span>
                  <span style={{ fontSize: 9, color: t.primary, fontWeight: 600 }}>{g.pct}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}>
                  <div style={{ height: '100%', borderRadius: 2, width: `${g.pct}%`, background: 'linear-gradient(90deg,#8B5CF6,#A855F7)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Focus Score Card - Hidden on Mobile to avoid overflow */}
      {!isMobile && (
        <>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{
              ...cardStyle,
              position: 'absolute',
              top: -36,
              left: -60,
              padding: '12px 16px',
              width: 110,
              textAlign: 'center',
              boxShadow: `${t.shadow}, 0 0 30px rgba(139,92,246,0.25)`,
            }}
          >
            <div style={{ fontSize: 9, color: t.textMuted, marginBottom: 6 }}>Focus Score</div>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={52} height={52} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={26} cy={26} r={21} fill="none" stroke={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(139,92,246,0.1)'} strokeWidth={5} />
                <circle cx={26} cy={26} r={21} fill="none" stroke="url(#fs-grad)" strokeWidth={5}
                  strokeDasharray={2 * Math.PI * 21} strokeDashoffset={2 * Math.PI * 21 * 0.14} strokeLinecap="round" />
                <defs>
                  <linearGradient id="fs-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', fontSize: 13, fontWeight: 700, color: t.primary }}>86%</div>
            </div>
            <div style={{ fontSize: 8, color: t.textDim, marginTop: 3 }}>Keep it up! 🔥</div>
          </motion.div>

          {/* Floating Weekly Progress Card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              ...cardStyle,
              position: 'absolute',
              bottom: -30,
              left: -50,
              padding: '12px 14px',
              width: 150,
              boxShadow: `${t.shadow}, 0 0 24px rgba(139,92,246,0.2)`,
            }}
          >
            <div style={{ fontSize: 9, color: t.textMuted, marginBottom: 8 }}>Weekly Progress</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 36 }}>
              {weeklyData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{
                    flex: 1, width: '100%', borderRadius: 3,
                    background: i === 5 ? 'linear-gradient(180deg,#A855F7,#8B5CF6)' : (isDark ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.15)'),
                    height: `${(v / 100) * 32}px`,
                    minHeight: 4, alignSelf: 'flex-end',
                    boxShadow: i === 5 ? '0 0 8px rgba(168,85,247,0.5)' : 'none',
                  }} />
                  <span style={{ fontSize: 7, color: t.textDim }}>{weekDays[i]}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 6, fontSize: 9, color: '#22C55E', fontWeight: 600 }}>+23% this week</div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const { isDark, setTheme } = useTheme();
  const t = getTheme(isDark);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Why Avora', id: 'why-avora' },
    { label: 'Pricing', id: 'pricing' }
  ];

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.label);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const glowBg: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: isDark ? 0.35 : 0.15,
    pointerEvents: 'none',
  };

  return (
    <div style={{ background: t.bg, minHeight: '100vh', color: t.text, fontFamily: 'inherit', overflowX: 'hidden' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: t.navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 48px', height: 60,
      }}>
        <div style={{ cursor: 'pointer' }} onClick={() => scrollToSection('home')}>
          <AvoraLogo size="default" />
        </div>
        
        {/* Desktop Navigation Links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navItems.map(item => {
              const active = activeSection === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: active ? t.primary : t.textMuted, fontSize: 14, padding: '6px 12px',
                    borderRadius: 8, transition: 'all 0.2s',
                    fontWeight: active ? 600 : 400,
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.color = t.primary;
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.color = t.textMuted;
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={toggleTheme} style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: t.textMuted, display: 'flex' }}>
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          
          {!isMobile && (
            <button
              onClick={() => navigate('/app')}
              style={{
                background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
                borderRadius: 10, padding: '8px 20px', color: 'white', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
                transition: 'all 0.2s',
              }}
            >
              Start Planning
            </button>
          )}

          {/* Hamburger Menu Icon for Mobile */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: t.textMuted, display: 'flex' }}
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          )}
        </div>
      </nav>

      {/* Slide-in Mobile Drawer */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: 60, left: 0, right: 0,
              background: t.cardBg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
              borderBottom: `1px solid ${t.border}`, zIndex: 49,
              padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 16,
              boxShadow: t.shadow,
            }}
          >
            {navItems.map(item => {
              const active = activeSection === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: active ? t.primary : t.text, fontSize: 16,
                    padding: '8px 0', textAlign: 'left', fontWeight: active ? 600 : 400,
                    borderBottom: `1px solid ${t.borderSubtle}`
                  }}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/app');
              }}
              style={{
                background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
                borderRadius: 10, padding: '12px 20px', color: 'white', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
                textAlign: 'center', marginTop: 8
              }}
            >
              Start Planning
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80, paddingBottom: 40, overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ ...glowBg, width: isMobile ? 300 : 500, height: isMobile ? 300 : 500, background: '#8B5CF6', top: '10%', left: '-5%' }} />
        <div style={{ ...glowBg, width: isMobile ? 250 : 400, height: isMobile ? 250 : 400, background: '#6366F1', top: '30%', right: '10%' }} />

        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 48px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? 40 : 80,
          width: '100%'
        }}>
          {/* Left Content */}
          <div style={{ flex: 1, maxWidth: 520, textAlign: isMobile ? 'center' : 'left' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20,
                background: isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.08)',
                border: `1px solid ${t.border}`, borderRadius: 30, padding: '5px 14px',
              }}>
                <div style={{ width: 3, height: 16, borderRadius: 2, background: 'linear-gradient(180deg,#8B5CF6,#A855F7)' }} />
                <span style={{ fontSize: 12, color: t.textMuted }}>Plan better. Achieve more.</span>
              </div>

              {/* Hero Logo (huge) */}
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <AvoraLogo size="hero" />
              </div>

              {/* Tagline */}
              <div style={{ fontSize: isMobile ? 36 : 46, fontWeight: 800, lineHeight: 1.2, marginBottom: 20, color: t.text }}>
                Turn Plans{' '}
                <span style={{
                  background: 'linear-gradient(135deg,#8B5CF6,#A855F7)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  fontStyle: 'italic',
                }}>
                  Into Progress
                </span>
              </div>

              <p style={{ fontSize: isMobile ? 14 : 16, color: t.textMuted, lineHeight: 1.7, marginBottom: 30 }}>
                Avora is a premium productivity platform built for professionals and students. Organize checklists, start focused sessions, and visually track your daily goals with our elegant dashboard.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 14, justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(139,92,246,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/app')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
                    borderRadius: 12, padding: '13px 28px', color: 'white', cursor: 'pointer',
                    fontSize: 15, fontWeight: 600, boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                  }}
                >
                  Launch Dashboard <ArrowRight size={16} />
                </motion.button>
              </div>

              {/* Social proof */}
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 12, marginTop: 32 }}>
                <div style={{ display: 'flex' }}>
                  {['#8B5CF6', '#6366F1', '#A855F7', '#7C3AED'].map((c, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: '50%', background: c,
                      border: `2px solid ${t.bg}`, marginLeft: i > 0 ? -8 : 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>{['S','A','M','R'][i]}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: t.textMuted, textAlign: isMobile ? 'center' : 'left' }}>
                  Trusted by <strong style={{ color: t.text }}>12,000+</strong> productive professionals
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right - Dashboard Mockup */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ width: '100%', maxWidth: 440 }}
            >
              <DashboardMockup isDark={isDark} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: isMobile ? '60px 16px' : '100px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{ fontSize: 13, color: t.primary, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>Features</div>
          <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, marginBottom: 14, color: t.text }}>Built for daily productivity</div>
          <div style={{ fontSize: 15, color: t.textMuted, maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
            A premium collection of workspace modules designed to streamline your planning and execution.
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(139,92,246,0.15)' }}
              style={{
                background: t.glass,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${t.border}`,
                borderRadius: 18,
                padding: '24px',
                cursor: 'default',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(99,102,241,0.15))', border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <f.icon size={20} color={t.primary} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: isMobile ? '60px 16px' : '100px 48px', background: isDark ? 'rgba(139,92,246,0.02)' : 'rgba(139,92,246,0.01)', borderTop: `1px solid ${t.borderSubtle}`, borderBottom: `1px solid ${t.borderSubtle}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <div style={{ fontSize: 13, color: t.primary, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>Workflow</div>
            <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, marginBottom: 14, color: t.text }}>How Avora Works</div>
            <div style={{ fontSize: 15, color: t.textMuted, maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>
              Three simple steps to maximize your output and stay aligned with your targets.
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 24, justifyContent: 'space-between' }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{
                  flex: 1, background: t.glass, border: `1px solid ${t.border}`, borderRadius: 20, padding: '32px 24px', position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: 20, right: 24, fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.25 }}>
                  {step.step}
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 10 }}>{step.title}</h4>
                <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Avora Section */}
      <section id="why-avora" style={{ padding: isMobile ? '60px 16px' : '100px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 40, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: t.primary, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>Why Avora</div>
            <h3 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: t.text, marginBottom: 18 }}>Designed for the ambitious</h3>
            <p style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
              Avora stands out by combining modern aesthetics with lightweight, local-first architectures. Enjoy a professional task space with no ads, tracking, or server load times.
            </p>
            <button
              onClick={() => navigate('/app')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
                borderRadius: 10, padding: '12px 24px', color: 'white', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.3)',
              }}
            >
              Open Workspace <ArrowUpRight size={15} />
            </button>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            {whyChooseAvora.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '20px', background: t.glass, border: `1px solid ${t.border}`, borderRadius: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(168,85,247,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={18} color={t.primary} />
                </div>
                <div>
                  <h5 style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 4 }}>{item.title}</h5>
                  <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: isMobile ? '60px 16px' : '80px 48px', position: 'relative', overflow: 'hidden', borderTop: `1px solid ${t.borderSubtle}` }}>
        <div style={{ ...glowBg, width: 400, height: 400, background: '#8B5CF6', top: '20%', left: '30%', opacity: isDark ? 0.12 : 0.06 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 13, color: t.primary, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>Pricing</div>
            <div style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: t.text, marginBottom: 10 }}>Simple, transparent pricing</div>
            <div style={{ fontSize: 15, color: t.textMuted }}>Start for free. No credit card required.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24 }}>
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -6 }}
                style={{
                  background: plan.highlight
                    ? 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(99,102,241,0.12))'
                    : t.glass,
                  backdropFilter: 'blur(16px)',
                  border: plan.highlight ? `1.5px solid ${t.primary}` : `1px solid ${t.border}`,
                  borderRadius: 22,
                  padding: '32px 24px',
                  position: 'relative',
                  boxShadow: plan.highlight ? `0 0 40px rgba(139,92,246,0.2)` : t.shadow,
                }}
              >
                {plan.highlight && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg,#8B5CF6,#A855F7)',
                    borderRadius: 20, padding: '3px 14px', fontSize: 11, color: 'white', fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(139,92,246,0.5)',
                  }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16 }}>{plan.desc}</div>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: t.text }}>${plan.price}</span>
                  <span style={{ fontSize: 14, color: t.textMuted }}>/mo</span>
                </div>
                <div style={{ marginBottom: 24 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <CheckCircle2 size={13} color={t.primary} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: t.textMuted }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/app')}
                  style={{
                    width: '100%', padding: '11px', borderRadius: 10,
                    background: plan.highlight ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
                    border: plan.highlight ? 'none' : `1px solid ${t.border}`,
                    color: plan.highlight ? 'white' : t.text,
                    cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    boxShadow: plan.highlight ? '0 4px 16px rgba(139,92,246,0.4)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: isMobile ? '40px 16px' : '80px 48px' }}>
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 800, margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(99,102,241,0.1))',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${t.border}`, borderRadius: 28, padding: isMobile ? '40px 20px' : '60px 40px',
            boxShadow: '0 0 60px rgba(139,92,246,0.15)',
          }}
        >
          <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: t.text, marginBottom: 14 }}>
            Ready to transform your productivity?
          </div>
          <div style={{ fontSize: 15, color: t.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
            Join thousands of professionals who trust AVORA to manage their daily tasks and deep focus cycles.
          </div>
          <button
            onClick={() => navigate('/app')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
              borderRadius: 12, padding: '14px 32px', color: 'white', cursor: 'pointer',
              fontSize: 15, fontWeight: 600, boxShadow: '0 6px 24px rgba(139,92,246,0.4)',
            }}
          >
            Start Planning Now <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '30px 48px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <AvoraLogo size="sm" />
        <div style={{ fontSize: 13, color: t.textDim }}>© 2026 AVORA Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy Policy', 'Terms of Service', 'Support'].map(l => (
            <button key={l} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, fontSize: 13 }}>{l}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}
