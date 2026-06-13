import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Search, Filter, X, Tag, Calendar, Flag, MoreHorizontal,
  Star, Trash2, Edit2, Check, AlertCircle, Play, CheckSquare, Clock
} from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'Work' | 'Personal' | 'Study' | 'Health' | 'Finance' | 'Shopping';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due: string;
  done: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  starred: boolean;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Integrate LocalStorage Sync', description: 'Verify that tasks, settings, and themes persist across page reloads.', category: 'Work', priority: 'high', due: '2026-06-13', done: true, status: 'completed', progress: 100, starred: false },
  { id: '2', title: 'Configure Vite Development Environment', description: 'Set up build pipelines, optimization plugins, and server ports.', category: 'Study', priority: 'medium', due: '2026-06-12', done: true, status: 'completed', progress: 100, starred: false },
  { id: '3', title: 'Establish Base CSS Theme Tokens', description: 'Define dark/light color palettes, transitions, and glow constants.', category: 'Work', priority: 'high', due: '2026-06-11', done: true, status: 'completed', progress: 100, starred: true },
  { id: '4', title: 'Conduct Security Auditing on Local Storage', description: 'Sanitize stored inputs and verify secure data isolation.', category: 'Finance', priority: 'urgent', due: '2026-06-10', done: true, status: 'completed', progress: 100, starred: false },
  { id: '5', title: 'Build Homepage Hero Section', description: 'Implement glassmorphism cards and neon glow graphics.', category: 'Work', priority: 'high', due: '2026-06-14', done: false, status: 'in_progress', progress: 45, starred: true },
  { id: '6', title: 'Resolve Dropdown Clipping in Tasks List', description: 'Lift active menu stacking context to prevent elements rendering underneath.', category: 'Work', priority: 'high', due: '2026-06-14', done: false, status: 'in_progress', progress: 80, starred: false },
  { id: '7', title: 'Polish Interactive Chart Widgets', description: 'Add hover animations and custom SVG gradients to the analytics tab.', category: 'Study', priority: 'medium', due: '2026-06-15', done: false, status: 'in_progress', progress: 30, starred: false },
  { id: '8', title: 'Implement Mobile Nav Drawer', description: 'Ensure the sidebar collapses into a hamburger menu on small devices.', category: 'Study', priority: 'medium', due: '2026-06-16', done: false, status: 'pending', progress: 0, starred: false },
  { id: '9', title: 'Schedule Cardio Workout Session', description: 'Complete a 45-minute HIIT workout session and full body stretch.', category: 'Health', priority: 'low', due: '2026-06-15', done: false, status: 'pending', progress: 0, starred: false },
  { id: '10', title: 'Plan Weekly Grocery Shopping', description: 'List ingredients for high-protein meals and batch prep meals.', category: 'Shopping', priority: 'low', due: '2026-06-16', done: false, status: 'pending', progress: 0, starred: false }
];

const catColors: Record<string, string> = {
  Work: '#8B5CF6',
  Personal: '#EC4899',
  Study: '#6366F1',
  Health: '#10B981',
  Finance: '#F59E0B',
  Shopping: '#06B6D4',
};

const priorityConfig: Record<Task['priority'], { color: string; bg: string; label: string }> = {
  urgent: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'Urgent' },
  high: { color: '#F97316', bg: 'rgba(249,115,22,0.12)', label: 'High' },
  medium: { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', label: 'Medium' },
  low: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', label: 'Low' },
};

const categories: Task['category'][] = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Shopping'];
const priorities: Task['priority'][] = ['low', 'medium', 'high', 'urgent'];

export function TaskManagement() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const [searchParams, setSearchParams] = useSearchParams();

  // Local Storage Task State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('avora_tasks');
    const seeded = localStorage.getItem('avora_tasks_seeded_v2');
    if (saved && seeded === 'true') {
      return JSON.parse(saved);
    }
    localStorage.setItem('avora_tasks', JSON.stringify(initialTasks));
    localStorage.setItem('avora_tasks_seeded_v2', 'true');
    return initialTasks;
  });

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('avora_tasks', JSON.stringify(newTasks));
    window.dispatchEvent(new Event('tasks_updated'));
  };

  // Filters
  const search = searchParams.get('q') || '';
  const [statusFilter, setStatusFilter] = useState<'All' | 'pending' | 'in_progress' | 'completed'>('All');
  const [catFilter, setCatFilter] = useState<'All' | Task['category']>('All');
  const [priFilter, setPriFilter] = useState<'All' | Task['priority']>('All');

  // Modals & Menu Toggles
  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // New task form fields
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'Work' as Task['category'],
    priority: 'medium' as Task['priority'],
    due: new Date().toISOString().split('T')[0],
  });

  // Open Add Task Modal automatically if 'add=true' is in URL
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowAdd(true);
      // clean URL param
      setSearchParams(prev => {
        prev.delete('add');
        return prev;
      });
    }
  }, [searchParams]);

  // Compute stats
  const completed = tasks.filter(t => t.done || t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const total = tasks.length;

  const filtered = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                        task.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchCat = catFilter === 'All' || task.category === catFilter;
    const matchPri = priFilter === 'All' || task.priority === priFilter;
    return matchSearch && matchStatus && matchCat && matchPri;
  });

  // CRUD handlers
  const handleToggleDone = (id: string) => {
    const updated = tasks.map(task => {
      if (task.id === id) {
        const nextDone = !task.done;
        return {
          ...task,
          done: nextDone,
          status: nextDone ? 'completed' as const : 'pending' as const,
          progress: nextDone ? 100 : 0
        };
      }
      return task;
    });
    saveTasks(updated);
  };

  const handleToggleStar = (id: string) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  };

  const handleStatusChange = (id: string, status: Task['status']) => {
    saveTasks(tasks.map(t => {
      if (t.id === id) {
        let done = t.done;
        let progress = t.progress;
        if (status === 'completed') {
          done = true;
          progress = 100;
        } else if (status === 'pending') {
          done = false;
          progress = 0;
        } else if (status === 'in_progress' && progress === 0) {
          progress = 25; // default starting progress
          done = false;
        }
        return { ...t, status, done, progress };
      }
      return t;
    }));
    setActiveMenu(null);
  };

  const handleProgressChange = (id: string, progress: number) => {
    saveTasks(tasks.map(t => {
      if (t.id === id) {
        let status = t.status;
        let done = t.done;
        if (progress === 100) {
          status = 'completed';
          done = true;
        } else if (progress === 0) {
          status = 'pending';
          done = false;
        } else {
          status = 'in_progress';
          done = false;
        }
        return { ...t, progress, status, done };
      }
      return t;
    }));
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const created: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      due: newTask.due || 'No due date',
      done: false,
      status: 'pending',
      progress: 0,
      starred: false,
    };
    saveTasks([created, ...tasks]);
    setNewTask({
      title: '',
      description: '',
      category: 'Work',
      priority: 'medium',
      due: new Date().toISOString().split('T')[0],
    });
    setShowAdd(false);
  };

  const handleEditTask = () => {
    if (!editingTask || !editingTask.title.trim()) return;
    saveTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
    setTaskToDelete(null);
    setActiveMenu(null);
  };

  const card: React.CSSProperties = {
    background: t.cardBg,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${t.border}`,
    borderRadius: 18,
    boxShadow: t.shadow,
  };

  const modalOverlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
    zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 16,
  };

  const inputStyle: React.CSSProperties = {
    background: t.inputBg, border: `1px solid ${t.border}`,
    borderRadius: 10, padding: '10px 14px', color: t.text, fontSize: 14,
    outline: 'none', width: '100%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
        {[
          { label: 'Total Tasks', value: total, color: '#8B5CF6' },
          { label: 'Completed', value: completed, color: '#10B981' },
          { label: 'In Progress', value: inProgress, color: '#3B82F6' },
          { label: 'Pending', value: pending, color: '#EC4899' },
        ].map(stat => (
          <div key={stat.label} style={{ ...card, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6, fontWeight: 500 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters & Actions Bar */}
      <div style={{ ...card, padding: '20px', display: 'flex', gap: 16, flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Status Filters */}
          <div style={{ display: 'flex', gap: 4, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: 3, flexWrap: 'wrap' }}>
            {(['All', 'pending', 'in_progress', 'completed'] as const).map(status => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', border: 'none',
                    background: active ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
                    color: active ? 'white' : t.textMuted, transition: 'all 0.2s', textTransform: 'capitalize',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {status === 'in_progress' ? 'In Progress' : status}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none',
              borderRadius: 10, padding: '10px 18px', color: 'white', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.35)',
              marginLeft: 'auto',
            }}
          >
            <Plus size={14} /> New Task
          </button>
        </div>

        {/* Detailed Filters row */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', borderTop: `1px solid ${t.borderSubtle}`, paddingTop: 16 }}>
          
          {/* Category Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: t.textDim }}>Category:</span>
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value as any)}
              style={{ ...inputStyle, padding: '6px 12px', fontSize: 12, width: 'auto', cursor: 'pointer' }}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Priority Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: t.textDim }}>Priority:</span>
            <select
              value={priFilter}
              onChange={e => setPriFilter(e.target.value as any)}
              style={{ ...inputStyle, padding: '6px 12px', fontSize: 12, width: 'auto', cursor: 'pointer' }}
            >
              <option value="All">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(statusFilter !== 'All' || catFilter !== 'All' || priFilter !== 'All' || search) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setCatFilter('All');
                setPriFilter('All');
                setSearchParams(prev => {
                  prev.delete('q');
                  return prev;
                });
              }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', color: t.primary,
                fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Task List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 200 }}>
        {filtered.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: '48px', color: t.textMuted }}>
            <AlertCircle size={24} style={{ margin: '0 auto 12px', color: t.textDim }} />
            <div>No tasks found matching your filters.</div>
          </div>
        ) : (
          filtered.map((task, i) => {
            const pc = priorityConfig[task.priority];
            const cc = catColors[task.category] || '#8B5CF6';
            const isCompleted = task.status === 'completed';
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  ...card,
                  padding: '14px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  opacity: isCompleted ? 0.65 : 1,
                  position: 'relative',
                  overflow: 'visible',
                  zIndex: activeMenu === task.id ? 50 : 1
                }}
              >
                {/* Upper line */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Status Checkbox */}
                  <button
                    onClick={() => handleToggleDone(task.id)}
                    style={{
                      width: 22, height: 22, borderRadius: 6, cursor: 'pointer', border: 'none',
                      background: isCompleted ? 'linear-gradient(135deg,#8B5CF6,#6366F1)' : 'transparent',
                      boxShadow: isCompleted ? '0 0 8px rgba(139,92,246,0.4)' : 'none',
                      outline: isCompleted ? 'none' : `2px solid ${t.border}`, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                    }}
                  >
                    {isCompleted && <Check size={14} strokeWidth={3} color="white" />}
                  </button>

                  {/* Task text & tag */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 14, fontWeight: 600, color: t.text,
                        textDecoration: isCompleted ? 'line-through' : 'none'
                      }}>
                        {task.title}
                      </span>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${cc}18`, color: cc, fontWeight: 700 }}>
                        {task.category}
                      </span>
                    </div>
                    {task.description && (
                      <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.description}
                      </div>
                    )}
                  </div>

                  {/* Star */}
                  <button onClick={() => handleToggleStar(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.starred ? '#F59E0B' : t.textDim, flexShrink: 0 }}>
                    <Star size={16} fill={task.starred ? '#F59E0B' : 'none'} />
                  </button>

                  {/* Options Menu Toggle */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveMenu(activeMenu === task.id ? null : task.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, display: 'flex' }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    
                    {/* Action dropdown card */}
                    <AnimatePresence>
                      {activeMenu === task.id && (
                        <>
                          <div onClick={() => setActiveMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 39 }} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{
                              position: 'absolute', right: 0, top: 24, zIndex: 40,
                              background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10,
                              width: 160, padding: 6, boxShadow: t.shadow,
                            }}
                          >
                            <button
                              onClick={() => {
                                setEditingTask({ ...task });
                                setActiveMenu(null);
                              }}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'none', border: 'none', borderRadius: 6, color: t.text, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}
                            >
                              <Edit2 size={13} /> Edit Details
                            </button>
                            <button
                              onClick={() => handleStatusChange(task.id, 'completed')}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'none', border: 'none', borderRadius: 6, color: t.text, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}
                            >
                              <Check size={13} /> Complete Task
                            </button>
                            <button
                              onClick={() => handleStatusChange(task.id, 'in_progress')}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'none', border: 'none', borderRadius: 6, color: t.text, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}
                            >
                              <Play size={13} /> Start Progress
                            </button>
                            <button
                              onClick={() => handleStatusChange(task.id, 'pending')}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'none', border: 'none', borderRadius: 6, color: t.text, fontSize: 12, cursor: 'pointer', textAlign: 'left' }}
                            >
                              <Clock size={13} /> Mark Pending
                            </button>
                            <button
                              onClick={() => setTaskToDelete(task.id)}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'none', border: 'none', borderRadius: 6, color: '#EF4444', fontSize: 12, cursor: 'pointer', textAlign: 'left' }}
                            >
                              <Trash2 size={13} /> Delete Task
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Lower line (Metadata & Progress Slider) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, borderTop: `1px solid ${t.borderSubtle}`, paddingTop: 10 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.textMuted, fontSize: 11 }}>
                      <Calendar size={12} />
                      Due: {task.due}
                    </div>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: pc.bg, color: pc.color, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Flag size={10} />
                      {pc.label}
                    </span>
                  </div>

                  {/* Progress bar and slider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 220, maxWidth: '100%' }}>
                    <span style={{ fontSize: 11, color: t.textMuted, width: 70, textAlign: 'right' }}>
                      {task.status === 'in_progress' ? 'In Progress' : task.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                    <input
                      type="range" min="0" max="100" step="5"
                      value={task.progress}
                      onChange={e => handleProgressChange(task.id, Number(e.target.value))}
                      style={{ flex: 1, accentColor: cc, height: 4 }}
                    />
                    <span style={{ fontSize: 10, color: t.textDim, width: 26 }}>{task.progress}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add Task Modal overlay */}
      <AnimatePresence>
        {showAdd && (
          <div style={modalOverlay}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ ...card, padding: '24px', width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Create New Task</h3>
                <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div>
                <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Task Title</label>
                <input
                  value={newTask.title}
                  onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Review client deck..."
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Outline key metrics and updates..."
                  rows={3}
                  style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Category</label>
                  <select
                    value={newTask.category}
                    onChange={e => setNewTask(prev => ({ ...prev, category: e.target.value as any }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {priorities.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Due Date</label>
                <input
                  type="date"
                  value={newTask.due}
                  onChange={e => setNewTask(prev => ({ ...prev, due: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  onClick={() => setShowAdd(false)}
                  style={{ background: 'transparent', border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 18px', color: t.textMuted, cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  style={{ background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none', borderRadius: 10, padding: '10px 22px', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.35)' }}
                >
                  Create Task
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal overlay */}
      <AnimatePresence>
        {editingTask && (
          <div style={modalOverlay}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ ...card, padding: '24px', width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Edit Task Details</h3>
                <button onClick={() => setEditingTask(null)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div>
                <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Task Title</label>
                <input
                  value={editingTask.title}
                  onChange={e => setEditingTask(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Description</label>
                <textarea
                  value={editingTask.description}
                  onChange={e => setEditingTask(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                  rows={3}
                  style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Category</label>
                  <select
                    value={editingTask.category}
                    onChange={e => setEditingTask(prev => prev ? ({ ...prev, category: e.target.value as any }) : null)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={e => setEditingTask(prev => prev ? ({ ...prev, priority: e.target.value as any }) : null)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {priorities.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: t.textMuted, display: 'block', marginBottom: 4 }}>Due Date</label>
                <input
                  type="date"
                  value={editingTask.due}
                  onChange={e => setEditingTask(prev => prev ? ({ ...prev, due: e.target.value }) : null)}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  onClick={() => setEditingTask(null)}
                  style={{ background: 'transparent', border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 18px', color: t.textMuted, cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditTask}
                  style={{ background: 'linear-gradient(135deg,#8B5CF6,#6366F1)', border: 'none', borderRadius: 10, padding: '10px 22px', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 14px rgba(139,92,246,0.35)' }}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal overlay */}
      <AnimatePresence>
        {taskToDelete && (
          <div style={modalOverlay}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ ...card, padding: '24px', width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0 }}>
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Delete Task</h3>
                  <p style={{ fontSize: 13, color: t.textMuted, marginTop: 2 }}>Are you sure you want to permanently delete this task? This action cannot be undone.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button
                  onClick={() => setTaskToDelete(null)}
                  style={{ background: 'transparent', border: `1px solid ${t.border}`, borderRadius: 10, padding: '10px 18px', color: t.textMuted, cursor: 'pointer', fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTask(taskToDelete)}
                  style={{ background: '#EF4444', border: 'none', borderRadius: 10, padding: '10px 22px', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
