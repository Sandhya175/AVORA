import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, ChevronDown, X, Tag, Calendar, Flag, MoreHorizontal, GripVertical, Star } from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  due: string;
  done: boolean;
  starred: boolean;
  progress: number;
  tags: string[];
  description: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Design landing page UI', category: 'Design', priority: 'high', due: 'Jun 10', done: false, starred: true, progress: 65, tags: ['UI', 'Figma'], description: 'Create the full landing page design in Figma with all components.' },
  { id: '2', title: 'Build homepage UI', category: 'Development', priority: 'medium', due: 'Jun 10', done: true, starred: false, progress: 100, tags: ['React', 'Tailwind'], description: 'Implement the React components for the homepage.' },
  { id: '3', title: 'Fix responsive issues', category: 'Development', priority: 'high', due: 'Jun 11', done: false, starred: false, progress: 30, tags: ['Bug', 'CSS'], description: 'Fix layout breaking on mobile and tablet screens.' },
  { id: '4', title: 'Prepare for client presentation', category: 'Work', priority: 'medium', due: 'Jun 12', done: false, starred: true, progress: 45, tags: ['Meeting'], description: 'Prepare slides and demo for client review meeting.' },
  { id: '5', title: 'Read 20 pages of Deep Work', category: 'Personal', priority: 'low', due: 'Jun 10', done: false, starred: false, progress: 0, tags: ['Reading', 'Self'], description: 'Continue reading Deep Work by Cal Newport.' },
  { id: '6', title: 'Set up CI/CD pipeline', category: 'Development', priority: 'high', due: 'Jun 13', done: false, starred: false, progress: 10, tags: ['DevOps', 'GitHub'], description: 'Configure GitHub Actions for automated deployment.' },
  { id: '7', title: 'Weekly team sync notes', category: 'Work', priority: 'low', due: 'Jun 14', done: false, starred: false, progress: 0, tags: ['Meeting', 'Notes'], description: 'Write up notes from the weekly team sync meeting.' },
  { id: '8', title: 'User research interviews', category: 'Design', priority: 'medium', due: 'Jun 15', done: false, starred: true, progress: 20, tags: ['Research', 'UX'], description: 'Conduct 5 user interviews for the onboarding flow.' },
];

const catColors: Record<string, string> = {
  Design: '#8B5CF6', Development: '#6366F1', Work: '#A855F7', Personal: '#EC4899',
};

const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
  high: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'High' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Medium' },
  low: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', label: 'Low' },
};

const categories = ['All', 'Design', 'Development', 'Work', 'Personal'];
const priorities = ['All', 'High', 'Medium', 'Low'];

export function TaskManagement() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [priFilter, setPriFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [newTask, setNewTask] = useState({ title: '', category: 'Work', priority: 'medium' as const, due: '' });

  const filtered = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || task.category === catFilter;
    const matchPri = priFilter === 'All' || task.priority === priFilter.toLowerCase();
    return matchSearch && matchCat && matchPri;
  });

  const toggle = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const toggleStar = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t));

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      category: newTask.category,
      priority: newTask.priority,
      due: newTask.due || 'No due date',
      done: false, starred: false, progress: 0,
      tags: [], description: '',
    };
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', category: 'Work', priority: 'medium', due: '' });
    setShowAdd(false);
  };

  const card: React.CSSProperties = {
    background: t.cardBg,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`,
    borderRadius: 18, boxShadow: t.shadow,
  };

  const inputStyle: React.CSSProperties = {
    background: t.inputBg, border: `1px solid ${t.border}`,
    borderRadius: 10, padding: '9px 14px', color: t.text, fontSize: 14,
    outline: 'none', width: '100%',
  };

  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header row */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
        {[
          { label: 'Total Tasks', value: total, color: '#8B5CF6' },
          { label: 'Completed', value: completed, color: '#22C55E' },
          { label: 'In Progress', value: tasks.filter(t => !t.done && t.progress > 0).length, color: '#F59E0B' },
          { label: 'Starred', value: tasks.filter(t => t.starred).length, color: '#EC4899' },
        ].map(stat => (
          <div key={stat.label} style={{ ...card, flex: 1, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}

        {/* Overall progress */}
        <div style={{ ...card, flex: 2, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Overall Progress</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.primary }}>{Math.round((completed / total) * 100)}%</div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completed / total) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg,#8B5CF6,#A855F7)', borderRadius: 4 }}
            />
          </div>
          <div style={{ fontSize: 11, color: t.textMuted }}>{completed} of {total} tasks completed</div>
        </div>
      </div>

      {/* Filters + Add */}
      <div style={{ ...card, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: '8px 14px', flex: 1, minWidth: 200 }}>
          <Search size={14} color={t.textDim} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." style={{ background: 'transparent', border: 'none', outline: 'none', color: t.text, fontSize: 13, flex: 1 }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, display: 'flex' }}><X size={12} /></button>}
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: 'none',
              background: catFilter === c ? (catColors[c] || 'linear-gradient(135deg,#8B5CF6,#6366F1)') : (isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)'),
              color: catFilter === c ? 'white' : t.textMuted, fontWeight: catFilter === c ? 600 : 400,
              boxShadow: catFilter === c ? `0 2px 10px ${catColors[c] || 'rgba(139,92,246,0.3)'}60` : 'none',
              transition: 'all 0.2s',
            }}>
              {c}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {priorities.map(p => (
            <button key={p} onClick={() => setPriFilter(p)} style={{
              padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: 'none',
              background: priFilter === p ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : (isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.06)'),
              color: priFilter === p ? 'white' : t.textMuted, fontWeight: priFilter === p ? 600 : 400, transition: 'all 0.2s',
            }}>
              {p}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: 3 }}>
          {(['list', 'board'] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)} style={{
              padding: '5px 12px', borderRadius: 7, fontSize: 12, cursor: 'pointer', border: 'none',
              background: viewMode === v ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
              color: viewMode === v ? 'white' : t.textMuted, transition: 'all 0.2s', textTransform: 'capitalize',
            }}>
              {v}
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdd(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
            borderRadius: 10, padding: '8px 18px', color: 'white', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={14} /> New Task
        </motion.button>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ ...card, padding: '20px 24px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 14 }}>New Task</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <input value={newTask.title} onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))}
                placeholder="Task title..." style={{ ...inputStyle, flex: 2, minWidth: 200 }} />
              <select value={newTask.category} onChange={e => setNewTask(n => ({ ...n, category: e.target.value }))}
                style={{ ...inputStyle, flex: 1, minWidth: 120, cursor: 'pointer' }}>
                {['Work', 'Design', 'Development', 'Personal'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={newTask.priority} onChange={e => setNewTask(n => ({ ...n, priority: e.target.value as any }))}
                style={{ ...inputStyle, flex: 1, minWidth: 100, cursor: 'pointer' }}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input type="date" value={newTask.due} onChange={e => setNewTask(n => ({ ...n, due: e.target.value }))}
                style={{ ...inputStyle, flex: 1, minWidth: 130 }} />
              <button onClick={addTask} style={{ background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none', borderRadius: 10, padding: '9px 20px', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.35)' }}>Add</button>
              <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: `1px solid ${t.border}`, borderRadius: 10, padding: '9px 14px', color: t.textMuted, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      {viewMode === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: t.textMuted }}>No tasks found matching your filters.</div>
          )}
          <AnimatePresence>
            {filtered.map((task, i) => {
              const pc = priorityConfig[task.priority];
              const cc = catColors[task.category] || '#8B5CF6';
              const done = task.done;
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -1 }}
                  style={{
                    ...card,
                    padding: '14px 20px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    opacity: done ? 0.65 : 1,
                  }}
                >
                  <GripVertical size={14} color={t.textDim} style={{ cursor: 'grab', flexShrink: 0 }} />
                  <button onClick={() => toggle(task.id)} style={{
                    width: 20, height: 20, borderRadius: 6, cursor: 'pointer', border: 'none',
                    background: done ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
                    boxShadow: done ? '0 0 8px rgba(139,92,246,0.4)' : 'none',
                    outline: done ? 'none' : `2px solid ${t.border}`, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  }}>
                    {done && <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: done ? t.textDim : t.text, textDecoration: done ? 'line-through' : 'none' }}>{task.title}</span>
                      {task.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${cc}18`, color: cc, fontWeight: 600 }}>{tag}</span>
                      ))}
                    </div>
                    {task.progress > 0 && task.progress < 100 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                        <div style={{ flex: 1, height: 3, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden', maxWidth: 160 }}>
                          <div style={{ height: '100%', width: `${task.progress}%`, background: 'linear-gradient(90deg,#8B5CF6,#A855F7)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 10, color: t.textDim }}>{task.progress}%</span>
                      </div>
                    )}
                  </div>

                  <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: `${cc}15`, color: cc, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{task.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.textMuted, fontSize: 12, flexShrink: 0, minWidth: 70 }}>
                    <Calendar size={11} />
                    {task.due}
                  </div>
                  <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: pc.bg, color: pc.color, fontWeight: 600, flexShrink: 0 }}>
                    <Flag size={10} style={{ display: 'inline', marginRight: 3 }} />{pc.label}
                  </span>
                  <button onClick={() => toggleStar(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.starred ? '#F59E0B' : t.textDim, flexShrink: 0 }}>
                    <Star size={14} fill={task.starred ? '#F59E0B' : 'none'} />
                  </button>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textDim, flexShrink: 0 }}>
                    <MoreHorizontal size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Board View */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, alignItems: 'start' }}>
          {Object.keys(catColors).map(cat => {
            const catTasks = filtered.filter(t => t.category === cat);
            const cc = catColors[cat];
            return (
              <div key={cat} style={{ ...card, padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cc }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{cat}</span>
                  <span style={{ fontSize: 11, color: t.textMuted, marginLeft: 'auto' }}>{catTasks.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {catTasks.map(task => (
                    <div key={task.id} style={{
                      background: isDark ? 'rgba(139,92,246,0.05)' : 'rgba(139,92,246,0.04)',
                      border: `1px solid ${t.borderSubtle}`, borderRadius: 10, padding: '10px 12px',
                    }}>
                      <div style={{ fontSize: 13, color: task.done ? t.textDim : t.text, textDecoration: task.done ? 'line-through' : 'none', marginBottom: 6 }}>{task.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: priorityConfig[task.priority].color }}>{priorityConfig[task.priority].label}</span>
                        <span style={{ fontSize: 10, color: t.textDim }}>{task.due}</span>
                      </div>
                      {task.progress > 0 && (
                        <div style={{ height: 3, borderRadius: 2, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden', marginTop: 6 }}>
                          <div style={{ height: '100%', width: `${task.progress}%`, background: cc, borderRadius: 2 }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
