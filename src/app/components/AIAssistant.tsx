import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Bot, User, Mic, Paperclip, RefreshCw, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';

interface Message {
  id: string; role: 'user' | 'ai'; text: string; time: string;
}

const quickPrompts = [
  '📋 Summarize my tasks for today',
  '🎯 What should I focus on first?',
  '📊 How was my productivity this week?',
  '🗓️ Schedule my tasks for tomorrow',
  '💡 Give me productivity tips',
  '⚡ Create a focus plan for today',
];

const initialMessages: Message[] = [
  {
    id: '1', role: 'ai', time: '9:00 AM',
    text: "Good morning! I'm your AVORA AI assistant. I can help you organize your day, prioritize tasks, analyze your productivity trends, and keep you on track.\n\nYou have **5 tasks** due today and your focus score is **88%** — great start! 🚀\n\nWhat would you like to work on?",
  },
];

const aiResponses: Record<string, string> = {
  default: "I'm here to help! Could you tell me more about what you'd like to accomplish? I can help with task management, scheduling, productivity insights, and more.",
  tasks: "Based on your current tasks, here's my recommended order:\n\n1. 🔴 **Fix responsive issues** (High priority, due today)\n2. 🟡 **Design landing page UI** (High priority, in progress at 65%)\n3. 🟢 **Prepare for presentation** (Tomorrow's deadline)\n\nWould you like me to schedule focused work blocks for these?",
  focus: "Your **peak productivity hours** are between **9–11 AM** and **3–5 PM** based on your history. I recommend:\n\n• 9:00 AM — Start with the most challenging task\n• 11:00 AM — Short break (5 min)\n• 11:05 AM — Continue on secondary tasks\n\nShall I activate Focus Mode now?",
  productivity: "Here's your productivity summary for this week:\n\n📊 **Overall Score:** 92/100 (↑ 8 pts)\n✅ **Tasks Completed:** 50 (↑ 32%)\n⏱️ **Total Focus Time:** 21.2 hours\n🔥 **Current Streak:** 6 days\n\nYou're on track for your best week ever! Keep it up! 💪",
  schedule: "I'll create a balanced schedule for tomorrow:\n\n**Morning Block (9–12)**\n• 9:00 Fix responsive issues (2h)\n• 11:00 Code review (1h)\n\n**Afternoon Block (2–5)**\n• 2:00 Client presentation prep (2h)\n• 4:00 Email & admin (1h)\n\nWant me to block these in your calendar?",
};

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('task') || lower.includes('today') || lower.includes('focus on first')) return aiResponses.tasks;
  if (lower.includes('focus plan') || lower.includes('focus on') || lower.includes('productive')) return aiResponses.focus;
  if (lower.includes('productivity') || lower.includes('week') || lower.includes('stats') || lower.includes('summary')) return aiResponses.productivity;
  if (lower.includes('schedule') || lower.includes('tomorrow')) return aiResponses.schedule;
  return aiResponses.default;
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
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: getAIResponse(text), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 1400 + Math.random() * 800);
  };

  const card: React.CSSProperties = {
    background: t.cardBg, backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.shadow,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, height: 'calc(100vh - 140px)' }}>
      {/* Chat Area */}
      <div style={{ ...card, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderSubtle}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#8B5CF6,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(139,92,246,0.45)' }}>
              <Sparkles size={18} color="white" />
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: `2px solid ${t.cardBg}` }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>AVORA AI</div>
            <div style={{ fontSize: 11, color: '#22C55E' }}>Online · Ready to help</div>
          </div>
          <button onClick={() => setMessages(initialMessages)} style={{ marginLeft: 'auto', background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: t.textMuted, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
            <RefreshCw size={12} /> New Chat
          </button>
        </div>

        {/* Messages */}
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
                    fontSize: 14, lineHeight: 1.6,
                    boxShadow: msg.role === 'user' ? '0 4px 14px rgba(139,92,246,0.35)' : t.shadow,
                  }}>
                    {formatAIText(msg.text)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: t.textDim }}>{msg.time}</span>
                    {msg.role === 'ai' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[{ icon: ThumbsUp, label: 'up' }, { icon: ThumbsDown, label: 'down' }, { icon: Copy, label: 'copy' }].map(a => (
                          <button key={a.label} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, display: 'flex', padding: 2 }}>
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

        {/* Input */}
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${t.borderSubtle}` }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: '10px 14px' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, display: 'flex', flexShrink: 0 }}><Paperclip size={15} /></button>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask me anything about your productivity..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 14 }}
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

      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Quick Prompts */}
        <div style={{ ...card, padding: '18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickPrompts.map(prompt => (
              <motion.button
                key={prompt}
                whileHover={{ x: 4, background: isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)' }}
                onClick={() => sendMessage(prompt.slice(2).trim())}
                style={{
                  textAlign: 'left', padding: '9px 12px', borderRadius: 10, cursor: 'pointer', border: 'none',
                  background: isDark ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)',
                  color: t.textMuted, fontSize: 12.5, transition: 'all 0.15s',
                }}
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Context Panel */}
        <div style={{ ...card, padding: '18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>Today's Context</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Pending Tasks', value: '5', color: t.primary },
              { label: 'Focus Score', value: '88%', color: '#22C55E' },
              { label: 'Hours Focused', value: '1.7h', color: '#F59E0B' },
              { label: 'Next Deadline', value: 'Today, 3 PM', color: '#EF4444' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${t.borderSubtle}` }}>
                <span style={{ fontSize: 12, color: t.textMuted }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div style={{ ...card, padding: '18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>AI Capabilities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['📋 Task summarization', '🗓️ Smart scheduling', '📊 Productivity insights', '🎯 Goal coaching', '⚡ Daily planning', '🔍 Pattern analysis'].map(cap => (
              <div key={cap} style={{ fontSize: 12, color: t.textMuted, padding: '4px 0' }}>{cap}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
