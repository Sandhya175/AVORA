import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowRight, Play, CheckCircle2, Zap, Brain, BarChart2,
  ChevronRight, Star, Shield, Clock, Target, Moon, Sun,
  LayoutDashboard, CheckSquare, Calendar,
} from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';
import { AvoraLogo } from './AvoraLogo';

const features = [
  { icon: CheckSquare, title: 'Smart Task Management', desc: 'AI-powered prioritization that learns your work patterns and optimizes your daily schedule.' },
  { icon: Brain, title: 'Deep Focus Engine', desc: 'Pomodoro-based focus sessions with distraction blocking and ambient soundscapes.' },
  { icon: BarChart2, title: 'Productivity Analytics', desc: 'Real-time insights into your performance trends, helping you work smarter every day.' },
  { icon: Target, title: 'Goal Tracking', desc: 'Set, track, and achieve goals with visual progress indicators and milestone celebrations.' },
  { icon: Calendar, title: 'Smart Calendar', desc: 'Sync tasks with your calendar, auto-schedule based on priority and available time blocks.' },
  { icon: Shield, title: 'AI Assistant', desc: 'Context-aware AI that summarizes your day, suggests next steps, and writes task descriptions.' },
];

const pricingPlans = [
  {
    name: 'Starter', price: 0, desc: 'Perfect for individuals',
    features: ['Up to 50 tasks', 'Basic analytics', '5 AI queries/day', 'Calendar sync'],
    cta: 'Get Started Free', highlight: false,
  },
  {
    name: 'Pro', price: 12, desc: 'For serious achievers',
    features: ['Unlimited tasks', 'Advanced analytics', 'Unlimited AI', 'Focus mode', 'Priority support', 'Team sharing'],
    cta: 'Start Pro Trial', highlight: true,
  },
  {
    name: 'Team', price: 29, desc: 'For productive teams',
    features: ['Everything in Pro', 'Team dashboards', 'Shared goals', 'Admin controls', 'SSO', 'Dedicated support'],
    cta: 'Contact Sales', highlight: false,
  },
];

const miniTasks = [
  { label: 'Design landing page', cat: 'Design', done: false },
  { label: 'Build homepage UI', cat: 'Dev', done: true },
  { label: 'Fix responsive issues', cat: 'Dev', done: false },
  { label: 'Prepare presentation', cat: 'Work', done: false },
];

const catColors: Record<string, string> = {
  Design: '#8B5CF6', Dev: '#6366F1', Work: '#A855F7', Personal: '#EC4899',
};

const weeklyData = [40, 65, 45, 80, 72, 90, 60];
const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function DashboardMockup({ isDark }: { isDark: boolean }) {
  const t = getTheme(isDark);
  const cardStyle: React.CSSProperties = {
    background: t.glass,
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${t.border}`,
    borderRadius: 18,
    boxShadow: t.shadow,
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
      {/* Main dashboard card */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          ...cardStyle,
          padding: 20,
          boxShadow: `${t.shadow}, 0 0 60px rgba(139,92,246,0.2)`,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Good Morning ☀️</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Let's make today productive</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            {[
              { label: 'Total Tasks', value: '3' },
              { label: 'Completed', value: '5' },
              { label: 'In Progress', value: '3' },
              { label: 'Focus Time', value: '2.4h' },
            ].map(stat => (
              <div key={stat.label} style={{ flex: 1, background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.primary }}>{stat.value}</div>
                <div style={{ fontSize: 9, color: t.textDim, marginTop: 1 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks + Goals */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>Today's Tasks</div>
            {miniTasks.map((task, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, border: task.done ? 'none' : `1.5px solid ${t.border}`, background: task.done ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {task.done && <span style={{ color: 'white', fontSize: 8, fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1, fontSize: 10, color: task.done ? t.textDim : t.text, textDecoration: task.done ? 'line-through' : 'none' }}>{task.label}</div>
                <span style={{ fontSize: 8, padding: '2px 5px', borderRadius: 4, background: `${catColors[task.cat]}22`, color: catColors[task.cat], fontWeight: 600 }}>{task.cat}</span>
              </div>
            ))}
          </div>
          <div style={{ width: 100 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, marginBottom: 8 }}>Goals</div>
            {[
              { label: 'Q2 Targets', pct: 72 },
              { label: 'Fitness', pct: 55 },
              { label: 'Learning', pct: 88 },
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

      {/* Floating Focus Score Card */}
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
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const t = getTheme(isDark);

  const navItems = ['Home', 'Features', 'How It Works', 'Why Avora', 'Pricing'];

  const glowBg: React.CSSProperties = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: isDark ? 0.35 : 0.15,
    pointerEvents: 'none',
  };

  const navBtnStyle: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: t.textMuted, fontSize: 14, padding: '6px 10px',
    borderRadius: 8, transition: 'color 0.2s',
  };

  return (
    <div style={{ background: t.bg, minHeight: '100vh', color: t.text, fontFamily: 'inherit', overflow: 'hidden' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: t.navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 60,
      }}>
        <AvoraLogo size="default" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navItems.map(item => (
            <button key={item} style={navBtnStyle}>{item}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={toggleTheme} style={{ background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: t.textMuted, display: 'flex' }}>
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => navigate('/app')}
            style={{
              background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
              borderRadius: 10, padding: '8px 20px', color: 'white', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
              transition: 'all 0.2s',
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 60, overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ ...glowBg, width: 500, height: 500, background: '#8B5CF6', top: '10%', left: '-5%' }} />
        <div style={{ ...glowBg, width: 400, height: 400, background: '#6366F1', top: '30%', right: '10%' }} />
        <div style={{ ...glowBg, width: 300, height: 300, background: '#A855F7', bottom: '10%', left: '30%' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 80, width: '100%' }}>
          {/* Left */}
          <div style={{ flex: 1, maxWidth: 520 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
                background: isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.08)',
                border: `1px solid ${t.border}`, borderRadius: 30, padding: '5px 14px',
              }}>
                <div style={{ width: 3, height: 16, borderRadius: 2, background: 'linear-gradient(180deg,#8B5CF6,#A855F7)' }} />
                <span style={{ fontSize: 13, color: t.textMuted }}>Plan better. Achieve more.</span>
              </div>

              {/* Hero Logo (huge) */}
              <div style={{ marginBottom: 24 }}>
                <AvoraLogo size="hero" />
              </div>

              {/* Tagline */}
              <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.25, marginBottom: 20, color: t.text }}>
                Turn Plans{' '}
                <span style={{
                  background: 'linear-gradient(135deg,#8B5CF6,#A855F7)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  fontStyle: 'italic',
                }}>
                  Into Progress
                </span>
              </div>

              <p style={{ fontSize: 16, color: t.textMuted, lineHeight: 1.7, marginBottom: 36 }}>
                Avora helps you organize tasks, stay focused, and achieve your goals — one step at a time. The premium productivity platform built for ambitious people.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(139,92,246,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/app')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
                    borderRadius: 12, padding: '13px 26px', color: 'white', cursor: 'pointer',
                    fontSize: 15, fontWeight: 600, boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                  }}
                >
                  Get Started <ArrowRight size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${t.border}`, borderRadius: 12, padding: '13px 22px',
                    color: t.text, cursor: 'pointer', fontSize: 15, fontWeight: 500,
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#8B5CF6,#A855F7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(139,92,246,0.4)',
                  }}>
                    <Play size={10} fill="white" color="white" />
                  </div>
                  Watch Demo
                </motion.button>
              </div>

              {/* Social proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 28 }}>
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
                <div style={{ fontSize: 13, color: t.textMuted }}>
                  Trusted by <strong style={{ color: t.text }}>12,000+</strong> productive professionals
                </div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right - Dashboard Mockup */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 40, paddingBottom: 40 }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ width: '100%', maxWidth: 480 }}
            >
              <DashboardMockup isDark={isDark} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{ fontSize: 13, color: t.primary, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>Features</div>
          <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 14, color: t.text }}>Everything you need to stay productive</div>
          <div style={{ fontSize: 16, color: t.textMuted, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            A complete suite of productivity tools designed to help you focus on what matters most.
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(139,92,246,0.2)' }}
              style={{
                background: t.glass,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${t.border}`,
                borderRadius: 18,
                padding: '28px 24px',
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

      {/* Pricing Section */}
      <section style={{ padding: '80px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ ...glowBg, width: 400, height: 400, background: '#8B5CF6', top: '20%', left: '30%', opacity: isDark ? 0.12 : 0.06 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, color: t.primary, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12, textTransform: 'uppercase' }}>Pricing</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: t.text, marginBottom: 10 }}>Simple, transparent pricing</div>
            <div style={{ fontSize: 16, color: t.textMuted }}>Start free. Scale as you grow.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
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
                  padding: '32px 26px',
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
                <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 20 }}>{plan.desc}</div>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: t.text }}>${plan.price}</span>
                  <span style={{ fontSize: 14, color: t.textMuted }}>/mo</span>
                </div>
                <div style={{ marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <CheckCircle2 size={14} color={t.primary} />
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
      <section style={{ padding: '80px 48px' }}>
        <motion.div
          whileInView={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 800, margin: '0 auto', textAlign: 'center',
            background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(99,102,241,0.1))',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${t.border}`, borderRadius: 28, padding: '60px 40px',
            boxShadow: '0 0 60px rgba(139,92,246,0.15)',
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, color: t.text, marginBottom: 14 }}>
            Ready to transform your productivity?
          </div>
          <div style={{ fontSize: 16, color: t.textMuted, marginBottom: 30, lineHeight: 1.6 }}>
            Join thousands of professionals who trust AVORA to manage their most important work.
          </div>
          <button
            onClick={() => navigate('/app')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
              borderRadius: 12, padding: '14px 32px', color: 'white', cursor: 'pointer',
              fontSize: 16, fontWeight: 600, boxShadow: '0 6px 24px rgba(139,92,246,0.4)',
            }}
          >
            Start for Free <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: '30px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AvoraLogo size="sm" />
        <div style={{ fontSize: 13, color: t.textDim }}>© 2026 AVORA Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <button key={l} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, fontSize: 13 }}>{l}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}
