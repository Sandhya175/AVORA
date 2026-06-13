import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Calendar, Flag, MoreHorizontal,
  Star, Trash2, Edit2, Check, AlertCircle, Play, Clock, GripVertical
} from 'lucide-react';
import { useTheme, getTheme } from './ThemeContext';
import { useTaskContext, Task } from '../context/TaskContext';

// ─── Category & Priority Config ────────────────────────────────────────────────

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

// ─── Draggable Task Card ───────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
  t: ReturnType<typeof getTheme>;
  card: React.CSSProperties;
  onReorder: (fromId: string, toId: string) => void;
  totalFiltered: number;
  index: number;
}

function TaskCard({
  task, activeMenu, setActiveMenu, onEdit, onDelete,
  isDark, t, card, onReorder, index, totalFiltered,
}: TaskCardProps) {
  const { toggleDone, toggleStar, setStatus, setProgress } = useTaskContext();

  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // ── Custom HTML5 drag ────────────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const fromId = e.dataTransfer.getData('text/plain');
    if (fromId && fromId !== task.id) {
      onReorder(fromId, task.id);
    }
  };

  // ── Touch drag ────────────────────────────────────────────────────────────

  const touchState = useRef<{ startY: number; dragId: string | null }>({ startY: 0, dragId: null });
  const [touchDragOverId, setTouchDragOverId] = useState<string | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchState.current.startY = e.touches[0].clientY;
    touchState.current.dragId = task.id;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.current.dragId) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardEl = el?.closest('[data-task-id]');
    if (cardEl) {
      const overId = cardEl.getAttribute('data-task-id');
      if (overId && overId !== task.id) {
        setTouchDragOverId(overId);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchState.current.dragId && touchDragOverId) {
      onReorder(touchState.current.dragId, touchDragOverId);
    }
    touchState.current.dragId = null;
    setTouchDragOverId(null);
  };

  const isCompleted = task.status === 'completed';
  const pc = priorityConfig[task.priority];
  const cc = catColors[task.category] || '#8B5CF6';

  return (
    <motion.div
      ref={dragRef}
      data-task-id={task.id}
      draggable
      onDragStart={handleDragStart as any}
      onDragEnd={handleDragEnd as any}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      style={{
        ...card,
        padding: '14px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        opacity: isDragging ? 0.45 : isCompleted ? 0.65 : 1,
        position: 'relative',
        overflow: 'visible',
        zIndex: activeMenu === task.id ? 50 : 1,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isDragging
          ? '0 12px 40px rgba(139,92,246,0.45)'
          : isDragOver
            ? `0 0 0 2px #8B5CF6, ${(card.boxShadow as string) || ''}`
            : (card.boxShadow as string),
        borderColor: isDragOver ? '#8B5CF6' : (card.border as any),
        transition: 'transform 0.15s, box-shadow 0.15s, opacity 0.15s, border-color 0.15s',
        cursor: 'default',
      }}
    >
      {/* Drag indicator drop line */}
      {isDragOver && (
        <div style={{
          position: 'absolute', top: -4, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #8B5CF6, #A855F7)',
          borderRadius: 3, zIndex: 2,
          boxShadow: '0 0 8px rgba(139,92,246,0.8)',
        }} />
      )}

      {/* Upper line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Drag handle */}
        <div
          draggable={false}
          style={{
            color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)',
            cursor: 'grab', flexShrink: 0, display: 'flex', alignItems: 'center',
            touchAction: 'none',
          }}
          title="Drag to reorder"
        >
          <GripVertical size={14} />
        </div>

        {/* Status Checkbox */}
        <button
          onClick={() => toggleDone(task.id)}
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
        <button onClick={() => toggleStar(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: task.starred ? '#F59E0B' : t.textDim, flexShrink: 0 }}>
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
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  style={{
                    position: 'absolute', right: 0, top: 28, zIndex: 200,
                    background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12,
                    width: 170, padding: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                  }}
                >
                  {[
                    { icon: <Edit2 size={13} />, label: 'Edit Details', action: () => { onEdit({ ...task }); setActiveMenu(null); }, color: t.text },
                    { icon: <Check size={13} />, label: 'Complete Task', action: () => { setStatus(task.id, 'completed'); setActiveMenu(null); }, color: '#10B981' },
                    { icon: <Play size={13} />, label: 'Start Progress', action: () => { setStatus(task.id, 'in_progress'); setActiveMenu(null); }, color: '#3B82F6' },
                    { icon: <Clock size={13} />, label: 'Mark Pending', action: () => { setStatus(task.id, 'pending'); setActiveMenu(null); }, color: '#F59E0B' },
                    { icon: <Trash2 size={13} />, label: 'Delete Task', action: () => { onDelete(task.id); setActiveMenu(null); }, color: '#EF4444' },
                  ].map(({ icon, label, action, color }) => (
                    <button
                      key={label}
                      onClick={action}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 10px', background: 'none', border: 'none', borderRadius: 8,
                        color, fontSize: 13, cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                    >
                      {icon} {label}
                    </button>
                  ))}
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
            onChange={e => setProgress(task.id, Number(e.target.value))}
            style={{ flex: 1, accentColor: cc, height: 4, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 10, color: t.textDim, width: 26 }}>{task.progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function TaskManagement() {
  const { isDark } = useTheme();
  const t = getTheme(isDark);
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    tasks, addTask, editTask, deleteTask, reorderTasks,
  } = useTaskContext();

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
      setSearchParams(prev => {
        prev.delete('add');
        return prev;
      });
    }
  }, [searchParams]);

  // Close any menu on outside click
  useEffect(() => {
    const close = () => setActiveMenu(null);
    document.addEventListener('click', close, { capture: false });
    return () => document.removeEventListener('click', close);
  }, []);

  // Compute stats from context tasks
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
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    addTask({
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      due: newTask.due || new Date().toISOString().split('T')[0],
    });
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
    editTask(editingTask);
    setEditingTask(null);
  };

  const handleDeleteTask = useCallback((id: string) => {
    deleteTask(id);
    setTaskToDelete(null);
  }, [deleteTask]);

  const handleReorder = useCallback((fromId: string, toId: string) => {
    reorderTasks(fromId, toId);
  }, [reorderTasks]);

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
          {/* Drag hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: t.textDim }}>
            <GripVertical size={12} />
            Drag to reorder
          </div>

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

          {(statusFilter !== 'All' || catFilter !== 'All' || priFilter !== 'All' || search) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setCatFilter('All');
                setPriFilter('All');
                setSearchParams(prev => { prev.delete('q'); return prev; });
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 200 }}>
        {filtered.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: '48px', color: t.textMuted }}>
            <AlertCircle size={24} style={{ margin: '0 auto 12px', color: t.textDim }} />
            <div>No tasks found matching your filters.</div>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                totalFiltered={filtered.length}
                activeMenu={activeMenu}
                setActiveMenu={id => {
                  // stop propagation so document click doesn't immediately close
                  setActiveMenu(id);
                }}
                onEdit={setEditingTask}
                onDelete={id => setTaskToDelete(id)}
                isDark={isDark}
                t={t}
                card={card}
                onReorder={handleReorder}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Add Task Modal overlay */}
      <AnimatePresence>
        {showAdd && (
          <div style={modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
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
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }}
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
          <div style={modalOverlay} onClick={e => { if (e.target === e.currentTarget) setEditingTask(null); }}>
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
                  autoFocus
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
