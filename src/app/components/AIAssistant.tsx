import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Mic, Paperclip, RefreshCw, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';
import { useIsMobile } from './ui/use-mobile';
import { Task } from './TaskManagement';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const quickPrompts = [
  '📋 Summarize my tasks',
  '🎯 What should I focus on first?',
  '📊 Give me productivity stats',
  '🗓️ Create a schedule plan',
  '⚡ Show urgent tasks',
];

function getDynamicAIResponse(text: string, tasks: Task[], focusHours: number): string {
  const lower = text.toLowerCase();
  
  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pending = tasks.filter(t => !t.done);
  const inProgress = tasks.filter(t => t.status === 'in_progress');
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' || t.priority === 'high');

  if (lower.includes('summarize') || lower.includes('summary')) {
    if (total === 0) {
      return "You currently have no tasks in your workspace. Try creating a task first! 📋";
    }
    const categoriesList = Array.from(new Set(tasks.map(t => t.category))).join(', ');
    return `Here is your dynamic task summary:\n\n📋 **Total Tasks:** ${total}\n✅ **Completed:** ${completed}\n⏱️ **In Progress:** ${inProgress.length}\n💤 **Pending:** ${pending.length - inProgress.length}\n\n**Categories Active:** ${categoriesList || 'None'}`;
  }

  if (lower.includes('focus') || lower.includes('first') || lower.includes('today')) {
    if (pending.length === 0) {
      return "Excellent work! All of your tasks are completed. You have nothing pending to focus on today! 🎉";
    }
    
    // Sort pending tasks by priority (urgent > high > medium > low) and then by due date
    const priValues = { urgent: 4, high: 3, medium: 2, low: 1 };
    const sorted = [...pending].sort((a, b) => {
      const pDiff = (priValues[b.priority] || 2) - (priValues[a.priority] || 2);
      if (pDiff !== 0) return pDiff;
      return new Date(a.due).getTime() - new Date(b.due).getTime();
    });

    const recommendations = sorted.slice(0, 3).map((t, idx) => {
      const prioEmoji = t.priority === 'urgent' || t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢';
      return `${idx + 1}. ${prioEmoji} **${t.title}** (Priority: ${t.priority.toUpperCase()}, due ${t.due})`;
    }).join('\n');

    return `Based on your active tasks, here's my recommended focus order:\n\n${recommendations}\n\nWould you like me to schedule a Pomodoro session for these? ⚡`;
  }

  if (lower.includes('urgent') || lower.includes('high priority')) {
    const activeUrgent = pending.filter(t => t.priority === 'urgent' || t.priority === 'high');
    if (activeUrgent.length === 0) {
      return "No urgent or high priority tasks on your active schedule right now! Great job staying ahead. 🙌";
    }
    const list = activeUrgent.map((t, idx) => `• 🔴 **${t.title}** (Category: ${t.category}, due ${t.due})`).join('\n');
    return `Here are your urgent/high-priority tasks:\n\n${list}\n\nI recommend tackling these first during your peak productivity blocks. 🚀`;
  }

  if (lower.includes('productivity') || lower.includes('performance') || lower.includes('stats')) {
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return `Here is your real-time productivity score sheet:\n\n📈 **Completion Rate:** ${rate}%\n✅ **Tasks Done:** ${completed}\n⏱️ **Total Focus Hours:** ${focusHours}h\n🔥 **Active Tasks Remaining:** ${pending.length}\n\nKeep focusing! Small consistent steps turn plans into progress. 💪`;
  }

  if (lower.includes('schedule') || lower.includes('tomorrow') || lower.includes('plan')) {
    if (pending.length === 0) {
      return "Your schedule is clear! No pending tasks. Enjoy some rest or add new goals. 🌟";
    }
    const scheduleList = pending.slice(0, 2).map((t, idx) => {
      const time = idx === 0 ? "9:00 AM" : "11:00 AM";
      return `• ${time} — **${t.title}** (${t.category})`;
    }).join('\n');
    return `Here is a custom focus schedule for tomorrow:\n\n**Morning block (9 AM - 12 PM)**\n${scheduleList}\n• 12:00 PM — Rest and break (30m)\n\n**Afternoon block (1 PM - 4 PM)**\n• Review progress and wrap up administrative tasks.\n\nLet me know if you would like to edit or adjust this! 🗓️`;
  }

  return "I'm your AVORA assistant. Try asking me:\n\n• \"What should I focus on first?\"\n• \"Summarize my tasks\"\n• \"Show urgent tasks\"\n• \"Give me productivity stats\"";
}

function formatAIText(text: string) {
  return text.split('\n').map((line, i) => {
    const boldProcessed = line.replace(/\*\*(.+?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
    return <div key={i} style={{ marginBottom: line === '' ? 6 : 2 }} dangerouslySetInnerHTML={{ __html: boldProcessed || '&nbsp;' }} />;
  });
}

export function AIAssistant() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const isMobile = useIsMobile();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  // Load context from LocalStorage
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusHours, setFocusHours] = useState(2.4);

  useEffect(() => {
    const loadContext = () => {
      const savedTasks = localStorage.getItem('avora_tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      const savedFocusSeconds = localStorage.getItem('avora_focus_seconds');
      if (savedFocusSeconds) {
        setFocusHours(Number((Number(savedFocusSeconds) / 3600).toFixed(1)));
      }
    };
    loadContext();
    window.addEventListener('storage', loadContext);
    window.addEventListener('tasks_updated', loadContext);
    return () => {
      window.removeEventListener('storage', loadContext);
      window.removeEventListener('tasks_updated', loadContext);
    };
  }, []);

  // Initialize welcome message with real numbers
  useEffect(() => {
    const pendingCount = tasks.filter(t => !t.done).length;
    const rate = tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 88;
    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Good day! I'm your AVORA AI assistant. I can help you organize your day, prioritize tasks, analyze your productivity trends, and keep you on track.\n\nYou currently have **${pendingCount} pending tasks** and your overall completion rate is **${rate}%**. 🚀\n\nWhat would you like to work on today?`
      }
    ]);
  }, [tasks.length]); // reset only when task count changes

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const response = getDynamicAIResponse(text, tasks, focusHours);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: response, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  const card: React.CSSProperties = {
    background: t.cardBg, backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.shadow,
  };

  const pendingCount = tasks.filter(t => !t.done).length;
  const rate = tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', gap: 20, height: isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 140px)' }}>
      {/* Chat Area */}
      <div style={{ ...card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div style={{ padding: '12px 20px', borderBottom: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(139,92,246,0.45)' }}>
              <Sparkles size={18} color="white" />
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: `2px solid ${t.cardBg}` }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>AVORA Assistant</div>
            <div style={{ fontSize: 11, color: '#22C55E' }}>Online · Ready to analyze</div>
          </div>
          <button onClick={() => setMessages(prev => prev.slice(0, 1))} style={{ marginLeft: 'auto', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
            <RefreshCw size={12} /> New Chat
          </button>
        </div>

        {/* Messages list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}
              >
                {/* Avatar */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'ai' ? 'linear-gradient(135deg,#8B5CF6,#A855F7)' : (isDark ? '#1E293B' : '#F1F0FF'),
                  border: `1px solid ${t.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: msg.role === 'ai' ? '0 0 10px rgba(139,92,246,0.3)' : 'none',
                }}>
                  {msg.role === 'ai' ? <Sparkles size={14} color="white" /> : <User size={14} color={t.primary} />}
                </div>

                {/* Bubble */}
                <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg,#8B5CF6,#6366F1)'
                      : (isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)'),
                    border: `1px solid ${msg.role === 'user' ? 'transparent' : t.border}`,
                    color: msg.role === 'user' ? 'white' : t.text,
                    fontSize: 13.5, lineHeight: 1.6,
                    boxShadow: msg.role === 'user' ? '0 4px 14px rgba(139,92,246,0.35)' : t.shadow,
                  }}>
                    {formatAIText(msg.text)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: t.textDim }}>{msg.time}</span>
                    {msg.role === 'ai' && msg.id !== 'welcome' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[{ icon: ThumbsUp, label: 'up' }, { icon: ThumbsDown, label: 'down' }, { icon: Copy, label: 'copy' }].map((a, idx) => (
                          <button key={idx} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, display: 'flex', padding: 2 }}>
                            <a.icon size={11} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} color="white" />
              </div>
              <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)', border: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: t.primary }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${t.borderSubtle}` }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: '10px 14px' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, display: 'flex', flexShrink: 0 }}><Paperclip size={15} /></button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask AVORA AI about your tasks..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13.5 }}
              />
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, display: 'flex', flexShrink: 0 }}><Mic size={15} /></button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              style={{
                width: 44, height: 44, borderRadius: 12, border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
                background: input.trim() ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : (isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.12)'),
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: input.trim() ? '0 4px 14px rgba(139,92,246,0.4)' : 'none',
                flexShrink: 0, transition: 'all 0.2s',
              }}
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Sidebar Panel - Hidden on Mobile */}
      {!isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Prompts */}
          <div style={{ ...card, padding: '18px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt.slice(2).trim())}
                  style={{
                    textAlign: 'left', padding: '9px 12px', borderRadius: 10, cursor: 'pointer', border: 'none',
                    background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)',
                    color: t.textMuted, fontSize: 12, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)'}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Context Panel */}
          <div style={{ ...card, padding: '18px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>Today\'s Context</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Pending Tasks', value: String(pendingCount), color: t.primary },
                { label: 'Completion Rate', value: `${rate}%`, color: '#10B981' },
                { label: 'Hours Focused', value: `${focusHours}h`, color: '#F59E0B' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ fontSize: 12, color: t.textMuted }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
